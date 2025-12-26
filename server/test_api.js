// Quick test script to verify API endpoints
const axios = require("axios");

const BASE_URL = "http://localhost:5000";

async function testAPIs() {
  console.log("🧪 Testing API Endpoints...\n");

  try {
    // Test 1: Check if server is running
    console.log("1️⃣ Testing server health...");
    const health = await axios.get(BASE_URL);
    console.log("✅ Server is running:", health.data);

    // Test 2: Get destinations (public)
    console.log("\n2️⃣ Testing GET /api/destinations...");
    const destinations = await axios.get(`${BASE_URL}/api/destinations`);
    console.log(`✅ Found ${destinations.data.length} destinations`);
    console.log("Sample:", destinations.data[0]);

    // Test 3: Login as admin
    console.log("\n3️⃣ Testing admin login...");
    const loginRes = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: "admin@example.com",
      password: "admin123",
    });
    const token = loginRes.data.token;
    console.log("✅ Admin logged in, token received");

    // Test 4: Get all payments (admin)
    console.log("\n4️⃣ Testing GET /api/payments (admin)...");
    const payments = await axios.get(`${BASE_URL}/api/payments`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(`✅ Found ${payments.data.length} payments`);

    // Test 5: Get all users (admin)
    console.log("\n5️⃣ Testing GET /api/users (admin)...");
    const users = await axios.get(`${BASE_URL}/api/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(`✅ Found ${users.data.length} users`);
    console.log("Sample:", users.data[0]);

    console.log("\n✅ All tests passed!");
  } catch (error) {
    console.error("\n❌ Test failed:");
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(
        `Message: ${error.response.data.message || error.response.data}`
      );
    } else {
      console.error(error.message);
    }
  }
}

testAPIs();
