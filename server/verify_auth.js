const axios = require("axios");

const API_URL = "http://localhost:5000/api/auth";

async function verifyAuth() {
  console.log("🔍 Starting Auth Verification...");

  try {
    // 1. Register User
    console.log("\n1️⃣ Testing Registration...");
    const user = {
      username: `testuser_${Date.now()}`,
      email: `test_${Date.now()}@example.com`,
      password: "password123",
    };
    const regRes = await axios.post(`${API_URL}/register`, user);
    if (regRes.status === 201 && regRes.data.token) {
      console.log("✅ Registration Passed");
      console.log(`   User ID: ${regRes.data._id}`);

      const token = regRes.data.token;

      // 2. Login User
      console.log("\n2️⃣ Testing Login...");
      const loginRes = await axios.post(`${API_URL}/login`, {
        email: user.email,
        password: user.password,
      });
      if (loginRes.status === 200 && loginRes.data.token) {
        console.log("✅ Login Passed");
      } else {
        console.error("❌ Login Failed");
      }

      // 3. Access Protected Route
      console.log("\n3️⃣ Testing Protected Route (/me)...");
      const meRes = await axios.get(`${API_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (meRes.status === 200 && meRes.data.email === user.email) {
        console.log("✅ Protected Route Passed");
      } else {
        console.error("❌ Protected Route Failed");
      }
    } else {
      console.error("❌ Registration Failed");
    }
  } catch (error) {
    console.error("❌ Verification Failed:", error.message);
    if (error.response) {
      console.error("   Status:", error.response.status);
      console.error("   Data:", error.response.data);
    }
  }
}

verifyAuth();
