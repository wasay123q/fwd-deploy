// Test script to verify all endpoints are working
const axios = require('axios');

const BASE_URL = 'https://fwd-deploy.onrender.com';

async function testEndpoints() {
  console.log('\n🧪 Testing API Endpoints...\n');

  try {
    // Test 1: Root endpoint
    console.log('1️⃣ Testing root endpoint...');
    const root = await axios.get(`${BASE_URL}/`);
    console.log('✅ Root endpoint:', root.data);

    // Test 2: Destinations (public)
    console.log('\n2️⃣ Testing destinations endpoint...');
    const destinations = await axios.get(`${BASE_URL}/api/destinations`);
    console.log(`✅ Destinations: ${destinations.data.length} found`);

    // Test 3: Auth endpoints (should fail without token)
    console.log('\n3️⃣ Testing protected endpoint without token...');
    try {
      await axios.get(`${BASE_URL}/api/payments`);
      console.log('❌ Should have failed but succeeded!');
    } catch (error) {
      console.log('✅ Protected endpoint correctly blocked:', error.response?.data?.message);
    }

    console.log('\n✅ All basic tests passed!\n');
    console.log('📋 Next steps:');
    console.log('   1. Login to get a token');
    console.log('   2. Make a booking with screenshot');
    console.log('   3. Check "My Payments" page');
    console.log('   4. Admin verifies payment');
    console.log('   5. User refreshes to see verified status\n');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('💡 Make sure the server is running: node index.js');
    }
  }
}

testEndpoints();
