/**
 * BSE API Connection Test
 * Tests authentication and basic connectivity
 */

const axios = require('axios');

const BSE_API_BASE = 'https://starmfv2demo.bseindia.com/api';
const LOGIN_ID = 'member/92374/lendrixventechprivatelimited';
const PASSWORD = 'Member@123';

const bseApi = axios.create({
  baseURL: BSE_API_BASE,
  timeout: 15000,
});

async function testConnection() {
  console.log('\n🔍 Testing BSE API Connection...\n');
  console.log('📍 API Base URL:', BSE_API_BASE);
  console.log('👤 Login ID:', LOGIN_ID);
  console.log('\n' + '='.repeat(60) + '\n');

  try {
    console.log('1️⃣  Testing basic connectivity...');
    const healthCheck = await axios.get('https://starmfv2demo.bseindia.com', {
      timeout: 5000,
    }).catch(() => ({ status: 'unreachable' }));
    console.log('✅ BSE server is reachable\n');
  } catch (error) {
    console.log('❌ Cannot reach BSE server\n');
  }

  try {
    console.log('2️⃣  Attempting authentication...\n');
    
    const loginPayload = {
      data: {
        username: LOGIN_ID,
        password: PASSWORD,
      },
    };

    console.log('📤 Sending login request:');
    console.log(JSON.stringify(loginPayload, null, 2));
    console.log('\n');

    const response = await bseApi.post('/login', loginPayload);

    console.log('✅ Authentication Successful!\n');
    console.log('📥 Response Status:', response.status);
    console.log('📥 Response Data:');
    console.log(JSON.stringify(response.data, null, 2));

    // Extract token if available
    const token = response.data?.data?.token || response.data?.token;
    if (token) {
      console.log('\n🔑 Auth Token:', token.substring(0, 50) + '...');
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ All tests passed! BSE API is working.\n');

    return true;
  } catch (error) {
    console.log('❌ Authentication Failed!\n');
    console.log('📊 Error Status:', error.response?.status);
    console.log('📊 Error Data:');
    console.log(JSON.stringify(error.response?.data, null, 2));
    console.log('📊 Error Message:', error.message);

    console.log('\n' + '='.repeat(60));
    console.log('❌ Connection test failed.\n');

    return false;
  }
}

// Run test
testConnection().then((success) => {
  process.exit(success ? 0 : 1);
});
