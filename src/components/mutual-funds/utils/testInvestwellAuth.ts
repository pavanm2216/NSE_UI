/**
 * Test utility for InvestWell API authentication
 * Run in browser console to debug auth issues
 */

const BASE_URL = 'https://demo.investwell.io/api';
const AUTH_NAME = 'demoapi';
const PASSWORD = 'API@1001';

export async function testInvestwellAuth() {
  console.group('🔐 Testing InvestWell Authentication');
  
  try {
    console.log('📤 Auth request to:', `${BASE_URL}/aggregator/auth/getAuthorizationToken`);
    
    const response = await fetch(`${BASE_URL}/aggregator/auth/getAuthorizationToken`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ authName: AUTH_NAME, password: PASSWORD }),
    });
    
    console.log('📥 Status:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error:', errorText);
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Response:', data);
    
    if (data.status === 0 && data.result?.token) {
      const token = data.result.token;
      console.log('✅ Token obtained:', token.substring(0, 30) + '...');
      await testTokenWithAPI(token);
      return token;
    } else {
      console.error('❌ Auth failed:', data.message);
      throw new Error(data.message || 'Authentication failed');
    }
  } catch (error) {
    console.error('❌ Exception:', error);
    throw error;
  } finally {
    console.groupEnd();
  }
}

async function testTokenWithAPI(token: string) {
  console.group('🧪 Testing token with API');
  
  try {
    const endDate = new Date().toISOString().split('T')[0];
    const testPAN = 'CGXPK2379F';
    const filters = JSON.stringify([{ endDate }, { pan: testPAN }]);
    const url = `${BASE_URL}/aggregator/reports/getPortfolioReturns?filters=${encodeURIComponent(filters)}&group=schid&token=${encodeURIComponent(token)}`;
    
    console.log('📤 Test API call...');
    const response = await fetch(url);
    console.log('📥 Status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error:', errorText.substring(0, 200));
      
      if (response.status === 401) {
        console.error('💡 Token invalid or expired. Tokens valid ~15 min.');
      }
    } else {
      const data = await response.json();
      console.log('✅ Success! Records:', data.result?.data?.length || 0);
    }
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    console.groupEnd();
  }
}
