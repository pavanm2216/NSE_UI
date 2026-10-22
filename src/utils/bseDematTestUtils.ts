/**
 * BSE Demat Troubleshooting Test Utility
 * 
 * Use this to test physical mode orders and debug depository validation errors.
 * Run in browser console or integrate into your test suite.
 */

import { placeOrder } from '@/services/starmf/orderService';
import { getUCCList } from '@/services/starmf/uccService';
import { getARNFromEnv, extractARNNumber } from '@/utils/arnValidator';

/**
 * Test 1: Verify UCC List API returns depository data
 */
export async function testUCCListAPI() {
  console.log('=== TEST 1: UCC List API ===');
  try {
    const res = await getUCCList({ start: 0, length: 1 });
    const inv = res?.data?.lists?.[0];
    
    if (!inv) {
      console.error('❌ No investor found in UCC list');
      return null;
    }

    console.log('✅ Investor found:', inv.investor?.client_code);
    console.log('📋 Depository data:', JSON.stringify(inv.depository, null, 2));
    
    return {
      ucc: inv.investor?.client_code,
      depository: inv.depository?.[0],
      holder: inv.holder?.[0],
    };
  } catch (err) {
    console.error('❌ UCC List API failed:', err);
    return null;
  }
}

/**
 * Test 2: Place a physical mode order (baseline test)
 * This should work if the order flow is correct, regardless of depository issues.
 */
export async function testPhysicalModeOrder(investorData: any) {
  console.log('\n=== TEST 2: Physical Mode Order ===');
  
  if (!investorData?.ucc) {
    console.error('❌ No UCC provided');
    return null;
  }

  try {
    const arnFromEnv = getARNFromEnv();
    const ref = `TEST_PHYS_${Date.now().toString().slice(-8)}`;

    const order = {
      type: 'p' as const,
      mem_ord_ref_id: ref,
      investor: { ucc: investorData.ucc },
      member: extractARNNumber(arnFromEnv),
      scheme: '007-DP',  // Test scheme code - adjust if needed
      amount: 1000,
      cur: 'INR' as const,
      is_units: false,
      all_units: false,
      min_redeem_flag: false,
      folio: '',
      is_fresh: true,
      phys_or_demat: 'P' as const,  // PHYSICAL MODE - no depository
      holder: [
        {
          holder_rank: '1',
          email: investorData.holder?.contact?.[0]?.email_address || 'test@example.com',
          mobnum: investorData.holder?.contact?.[0]?.contact_number || '9999999999',
        },
      ],
      email: investorData.holder?.contact?.[0]?.email_address || 'test@example.com',
      mobnum: investorData.holder?.contact?.[0]?.contact_number || '9999999999',
      kyc_passed: true,
      dpc: false,
      is_nomination_opted: false,
      mem_details: {
        euin: '',
        euin_flag: false,
        sub_br_code: '',
        sub_br_arn: arnFromEnv,
        partner_id: '',
      },
      // NO depository_acct field
    };

    console.log('📤 Sending physical mode order:', JSON.stringify(order, null, 2));
    
    const result = await placeOrder([order]);
    
    if (result.success) {
      console.log('✅ Physical mode order succeeded!');
      console.log('📋 Response:', JSON.stringify(result.data, null, 2));
      return result.data;
    } else {
      console.error('❌ Physical mode order failed');
      console.error('📋 Validation errors:', result.validationErrors);
      console.error('📋 Error message:', result.errorMessage);
      return null;
    }
  } catch (err) {
    console.error('❌ Physical mode order error:', err);
    return null;
  }
}

/**
 * Test 3: Place a demat mode order (will likely fail with depository error)
 * Use this to confirm the depository validation error.
 */
export async function testDematModeOrder(investorData: any) {
  console.log('\n=== TEST 3: Demat Mode Order (Expected to Fail) ===');
  
  if (!investorData?.ucc || !investorData?.depository) {
    console.error('❌ No UCC or depository data provided');
    return null;
  }

  try {
    const arnFromEnv = getARNFromEnv();
    const ref = `TEST_DEMAT_${Date.now().toString().slice(-8)}`;
    const dep = investorData.depository;

    const order = {
      type: 'p' as const,
      mem_ord_ref_id: ref,
      investor: { ucc: investorData.ucc },
      member: extractARNNumber(arnFromEnv),
      scheme: '007-DP',  // Test scheme code - adjust if needed
      amount: 1000,
      cur: 'INR' as const,
      is_units: false,
      all_units: false,
      min_redeem_flag: false,
      folio: '',
      is_fresh: true,
      phys_or_demat: 'D' as const,  // DEMAT MODE
      holder: [
        {
          holder_rank: '1',
          email: investorData.holder?.contact?.[0]?.email_address || 'test@example.com',
          mobnum: investorData.holder?.contact?.[0]?.contact_number || '9999999999',
        },
      ],
      email: investorData.holder?.contact?.[0]?.email_address || 'test@example.com',
      mobnum: investorData.holder?.contact?.[0]?.contact_number || '9999999999',
      kyc_passed: true,
      dpc: false,
      is_nomination_opted: false,
      depository_acct: {
        depository: dep.depository_code === 'CDSL' ? 'C' : 'N',
        dp_id: dep.dp_id,
        client_id: dep.client_id,
      },
      mem_details: {
        euin: '',
        euin_flag: false,
        sub_br_code: '',
        sub_br_arn: arnFromEnv,
        partner_id: '',
      },
    };

    console.log('📤 Sending demat mode order:', JSON.stringify(order, null, 2));
    
    const result = await placeOrder([order]);
    
    if (result.success) {
      console.log('✅ Demat mode order succeeded!');
      console.log('📋 Response:', JSON.stringify(result.data, null, 2));
      return result.data;
    } else {
      console.error('❌ Demat mode order failed (expected)');
      console.error('📋 Validation errors:', result.validationErrors);
      console.error('📋 Error message:', result.errorMessage);
      
      // Extract depository error details
      const dematError = result.validationErrors?.find(e => 
        e.field?.includes('DepositoryDetail') || e.field?.includes('depository')
      );
      if (dematError) {
        console.error('🔍 Depository Error Details:');
        console.error('   Field:', dematError.field);
        console.error('   Values:', dematError.values);
        console.error('   Message:', dematError.message);
      }
      
      return null;
    }
  } catch (err) {
    console.error('❌ Demat mode order error:', err);
    return null;
  }
}

/**
 * Run all tests in sequence
 */
export async function runAllTests() {
  console.log('🚀 Starting BSE Demat Troubleshooting Tests\n');
  
  // Test 1: Get investor data
  const investorData = await testUCCListAPI();
  if (!investorData) {
    console.error('❌ Cannot proceed without investor data');
    return;
  }

  // Test 2: Physical mode (should work)
  const physicalResult = await testPhysicalModeOrder(investorData);
  
  // Test 3: Demat mode (likely to fail)
  const dematResult = await testDematModeOrder(investorData);

  // Summary
  console.log('\n=== TEST SUMMARY ===');
  console.log(`Physical Mode: ${physicalResult ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Demat Mode: ${dematResult ? '✅ PASS' : '❌ FAIL'}`);
  
  if (physicalResult && !dematResult) {
    console.log('\n💡 Interpretation:');
    console.log('   - Physical mode works → Order flow is correct');
    console.log('   - Demat mode fails → Depository data issue (not format)');
    console.log('   - Action: Contact BSE support with depository data mismatch');
  }
}

/**
 * Browser console usage:
 * 
 * 1. Import this file in your component or run in console
 * 2. Call: await runAllTests()
 * 3. Check console output for results
 * 4. Share results with BSE support
 */
