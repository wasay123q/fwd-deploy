const axios = require("axios");

const API_URL = "http://localhost:5000/api";

async function verifyBackend() {
  console.log("🔍 Starting Backend Verification...");

  try {
    // 1. Test GET /destinations
    console.log("\n1️⃣ Testing GET /destinations...");
    const destRes = await axios.get(`${API_URL}/destinations`);
    if (destRes.status === 200 && Array.isArray(destRes.data)) {
      console.log("✅ GET /destinations Passed");
      console.log(`   Found ${destRes.data.length} destinations`);
    } else {
      console.error("❌ GET /destinations Failed");
    }

    // 2. Test POST /payments (Create Booking)
    console.log("\n2️⃣ Testing POST /payments...");
    const newBooking = {
      name: "Test User",
      username: "test@example.com",
      destination: "Hunza",
      startDate: "2023-12-01",
      endDate: "2023-12-05",
      people: 2,
      pricePerPerson: 5000,
      totalAmount: 10000,
    };
    const postRes = await axios.post(`${API_URL}/payments`, newBooking);
    if (postRes.status === 201 && postRes.data._id) {
      console.log("✅ POST /payments Passed");
      console.log(`   Created booking ID: ${postRes.data._id}`);

      // 3. Test GET /payments (Verify creation)
      console.log("\n3️⃣ Testing GET /payments...");
      const getRes = await axios.get(`${API_URL}/payments`);
      const createdBooking = getRes.data.find(
        (b) => b._id === postRes.data._id
      );
      if (createdBooking) {
        console.log("✅ GET /payments Passed (Found created booking)");
      } else {
        console.error(
          "❌ GET /payments Failed (Could not find created booking)"
        );
      }

      // 4. Test DELETE /payments/:id (Cleanup)
      console.log("\n4️⃣ Testing DELETE /payments/:id...");
      const delRes = await axios.delete(
        `${API_URL}/payments/${postRes.data._id}`
      );
      if (delRes.status === 200) {
        console.log("✅ DELETE /payments/:id Passed");
      } else {
        console.error("❌ DELETE /payments/:id Failed");
      }
    } else {
      console.error("❌ POST /payments Failed");
    }
  } catch (error) {
    console.error("❌ Verification Failed:", error.message);
    if (error.response) {
      console.error("   Status:", error.response.status);
      console.error("   Data:", error.response.data);
    }
  }
}

verifyBackend();
