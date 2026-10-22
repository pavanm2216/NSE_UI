// FIXED FUNCTIONS FOR buy-step-5
// Replace the handleMandateSetup and handlePaymentInitiate functions in MFInvestPage.tsx

// FOR SIP MANDATE (investmentType === 'SIP')
const handleMandateSetup = async () => {
  setMandateStatus('processing');
  try {
    if (!investor?.ucc) {
      throw new Error('Investor UCC not found');
    }
    
    // Step 1: Create the SIP order first
    const schemeCode = getBestSchemeCode(selectedFund!);
    if (!isValidSchemeCode(schemeCode)) {
      throw new Error(`Invalid scheme code: ${schemeCode}`);
    }
    
    const freqMap: Record<string, string> = { Monthly: 'm', Quarterly: 'q' };
    const dateMap: Record<string, string> = {
      '1st': '01', '5th': '05', '10th': '10', '15th': '15',
      '20th': '20', '25th': '25', '28th': '28',
    };
    const today = new Date();
    const startDay = parseInt(dateMap[sipDate] || '10');
    const startDate = new Date(today.getFullYear(), today.getMonth() + 1, startDay);
    const startDateStr = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')}`;
    
    const arnNumber = extractARNNumber(getARNFromEnv());
    const ref = `ORD${Date.now().toString().slice(-8)}`;
    
    console.log('[SIP Mandate] Creating SIP order...');
    const sxpRes = await registerSxp({
      sxp_type: 'sip',
      mem_sxp_ref_id: ref,
      investor: { ucc: investor.ucc },
      member: arnNumber,
      src_scheme: schemeCode,
      amount: Number(amount),
      cur: 'INR',
      is_fresh: true,
      phys_or_demat: 'p',
      isunits: false,
      min_redeem_flag: false,
      dpc: false,
      start_date: startDateStr,
      end_date: null,
      freq: freqMap[sipFrequency] || 'm',
      txn_date: startDay,
      mem_details: {
        euin: '',
        euin_flag: null,
        sub_br_code: '',
        sub_br_arn: getARNFromEnv(),
        partner_id: '',
      },
      holder: [{ holder_rank: '1', email: investor.email || '', mobnum: investor.mobile || '' }],
      remark: '',
      email: investor.email || '',
      mobnum: investor.mobile || '',
      kyc_passed: true,
      first_order_today: true,
      brokerage: 0,
      ninstallments: sipDuration === 'Until Cancelled' ? 0 : parseInt(sipDuration) * 12,
      special_product: {
        special_prod_type: '',
        special_prod_name: '',
        target_scheme: '',
        target_amt: 0,
        goal_type: '',
        goal_amt: 0,
        sip_tenure: 0,
      },
    });
    
    const bseSxpId = sxpRes?.data?.id;
    if (!bseSxpId) {
      throw new Error('Failed to create SIP order');
    }
    
    setBseOrderNumericId(Number(bseSxpId));
    setOrderId(String(bseSxpId));
    setTransactionId(ref);
    
    console.log('[SIP Mandate] SIP order created:', bseSxpId);
    
    // Step 2: Now initiate mandate payment with the created order ID
    console.log('[SIP Mandate] Initiating mandate payment...');
    const response = await initiatePayment(
      investor.ucc,
      [Number(bseSxpId)],
      ['mandate'],
      {
        euin: '',
        euin_flag: false,
        sub_br_code: '',
        sub_br_arn: getARNFromEnv(),
        partner_id: '',
      },
      `${window.location.origin}/payment-callback`
    );
    
    console.log('[SIP Mandate] Payment gateway response:', response);
    
    if (response.payment_url) {
      setPaymentUrl(response.payment_url);
    }
    if (response.payment_ref_id) {
      setPaymentRef(response.payment_ref_id);
    }
    
    setMandateStatus('success');
  } catch (err) {
    console.error('[SIP Mandate] Setup failed:', err);
    setOrderError(err instanceof Error ? err.message : 'Mandate setup failed');
    setMandateStatus('failed');
  }
};

// FOR ONE-TIME PAYMENT (investmentType === 'One-Time')
const handlePaymentInitiate = async () => {
  setPaymentStatus('processing');
  try {
    if (!investor?.ucc) {
      throw new Error('Investor UCC not found');
    }
    
    // Step 1: Create the one-time order first
    const selectedBank = bankAccounts.find(b => b.ifsc === bankId);
    const arnFromEnv = getARNFromEnv();
    const schemeCode = selectedFund!.parentSchemeCode || selectedFund!.isin;
    
    if (!schemeCode) {
      throw new Error('Scheme code is missing. The selected fund does not have valid scheme identifiers.');
    }
    
    const ref = `ORD${Date.now().toString().slice(-8)}`;
    
    console.log('[Payment] Creating one-time order...');
    const orderRes = await placeOrder([{
      type: 'p',
      mem_ord_ref_id: ref,
      investor: { ucc: investor.ucc },
      member: extractARNNumber(arnFromEnv),
      scheme: schemeCode,
      amount: Number(amount),
      cur: 'INR',
      is_units: false,
      all_units: false,
      min_redeem_flag: false,
      folio: '',
      is_fresh: true,
      phys_or_demat: 'D',
      holder: [{ holder_rank: '1', email: investor.email || '', mobnum: investor.mobile || '' }],
      email: investor.email || '',
      mobnum: investor.mobile || '',
      kyc_passed: true,
      dpc: false,
      is_nomination_opted: false,
      bank_acct: selectedBank ? {
        ifsc: selectedBank.ifsc,
        no: selectedBank.no,
        type: selectedBank.type,
        name: selectedBank.name,
      } : undefined,
      mem_details: {
        euin: '',
        euin_flag: false,
        sub_br_code: '',
        sub_br_arn: arnFromEnv,
        partner_id: '',
      },
    }]);
    
    const bseOrderId = orderRes?.data?.orders?.[0]?.id || orderRes?.data?.id;
    if (!bseOrderId) {
      throw new Error('Failed to create order');
    }
    
    setBseOrderNumericId(Number(bseOrderId));
    setOrderId(String(bseOrderId));
    setTransactionId(ref);
    
    console.log('[Payment] Order created:', bseOrderId);
    
    // Step 2: Map payment method to gateway format
    const paymentMethods = paymentMethod === 'UPI' ? ['upi'] : paymentMethod === 'Net Banking' ? ['netbanking'] : ['upi', 'netbanking'];
    
    // Step 3: Now initiate payment through BSE gateway with the created order
    console.log('[Payment] Initiating payment...');
    const response = await initiatePayment(
      investor.ucc,
      [Number(bseOrderId)],
      paymentMethods,
      {
        euin: '',
        euin_flag: false,
        sub_br_code: '',
        sub_br_arn: arnFromEnv,
        partner_id: '',
      },
      `${window.location.origin}/payment-callback`
    );
    
    console.log('[Payment] Payment gateway response:', response);
    
    if (response.payment_url) {
      setPaymentUrl(response.payment_url);
      // Redirect to payment gateway
      window.location.href = response.payment_url;
    }
    if (response.payment_ref_id) {
      setPaymentRef(response.payment_ref_id);
    }
    
    setPaymentStatus('success');
  } catch (err) {
    console.error('[Payment] Initiation failed:', err);
    setOrderError(err instanceof Error ? err.message : 'Payment initiation failed');
    setPaymentStatus('failed');
  }
};
