import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  Button,
  Spinner,
  Alert,
  ListGroup,
  Form,
} from "react-bootstrap";
import axios from "axios";

function PaymentGateway() {
  const location = useLocation();
  const navigate = useNavigate();
  const initialBooking = location.state?.booking;

  const [booking, setBooking] = useState(initialBooking);
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(null);
  const [bookingCancelled, setBookingCancelled] = useState(false);
  const [price, setPrice] = useState(initialBooking?.price || null);
  const [screenshot, setScreenshot] = useState(null);
  const [bookingReference, setBookingReference] = useState(null);

  // ✅ FIX: Define BASE_URL
  const BASE_URL = process.env.REACT_APP_API_URL || "https://fwd-deploy.onrender.com/api";

  // Fetch latest booking if not provided in state (Persistence)
  React.useEffect(() => {
    const fetchLatestBooking = async () => {
      if (!booking) {
        try {
          const token = localStorage.getItem("token");
          if (!token) return;

          const config = { headers: { Authorization: `Bearer ${token}` } };
          
          // ✅ FIX: Use BASE_URL
          const userRes = await axios.get(
            `${BASE_URL}/auth/me`,
            config
          );
          const userEmail = userRes.data.email;

          // ✅ FIX: Use BASE_URL
          const res = await axios.get(
            `${BASE_URL}/payments`,
            config
          );
          const userBookings = res.data.filter((b) => b.username === userEmail);

          if (userBookings.length > 0) {
            setBooking(userBookings[0]);
          }
        } catch (err) {
          console.error("Error fetching latest booking:", err);
        }
      }
    };
    fetchLatestBooking();
  }, [booking, BASE_URL]); // Added BASE_URL dependency

  // Fetch price if not provided
  React.useEffect(() => {
    if (booking?.destination && !price) {
      // ✅ FIX: Use BASE_URL
      axios
        .get(`${BASE_URL}/destination/${booking.destination}`)
        .then((res) => setPrice(res.data.price))
        .catch((err) => console.error("Error fetching price:", err));
    }
  }, [booking, price, BASE_URL]); // Added BASE_URL dependency

  if (!booking) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status" />
        <p className="mt-3">Loading booking details...</p>
      </Container>
    );
  }

  const calculateDuration = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diff = endDate - startDate;
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const duration = calculateDuration(booking.startDate, booking.endDate);
  const pricePerPersonPerDay = price;

  const totalAmount =
    pricePerPersonPerDay && booking.people
      ? pricePerPersonPerDay * booking.people * duration
      : 0;

  const handleFakePayment = async () => {
    // Validate screenshot is uploaded
    if (!screenshot) {
      alert("Please upload a payment screenshot or receipt before proceeding.");
      return;
    }

    // Validate file size (5MB max)
    if (screenshot.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB. Please upload a smaller file.");
      return;
    }

    setLoading(true);
    setPaymentSuccess(null);

    setTimeout(async () => {
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        // Convert screenshot to base64 if provided
        let screenshotBase64 = null;
        if (screenshot) {
          const reader = new FileReader();
          screenshotBase64 = await new Promise((resolve) => {
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(screenshot);
          });
        }

        // ✅ FIX: Use BASE_URL
        const response = await axios.post(
          `${BASE_URL}/payments`,
          {
            ...booking,
            duration,
            totalAmount,
            timestamp: new Date(),
            paymentScreenshot: screenshotBase64,
            verificationStatus: "pending",
          },
          config
        );

        // Store updated booking with ID in state
        setBooking((prev) => ({
          ...prev,
          _id: response.data._id,
        }));
        
        setBookingReference(response.data.bookingReference);
        setPaymentSuccess(true);
        
        // Auto-redirect to payment status after 3 seconds
        setTimeout(() => {
          navigate('/payment-status');
        }, 3000);
      } catch (error) {
        console.error("Error saving payment to MongoDB:", error);
        console.error("Error details:", error.response?.data);
        alert("Payment submission failed: " + (error.response?.data?.message || error.message));
        setPaymentSuccess(false);
      }

      setLoading(false);
    }, 2000);
  };

  const handleCancelBooking = async () => {
    if (!booking._id) return alert("Booking ID missing! Cannot cancel.");

    try {
      // ✅ FIX: Use BASE_URL
      await axios.delete(`${BASE_URL}/payments/${booking._id}`);
      setBookingCancelled(true);
      setPaymentSuccess(false);
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert("Cancellation failed. Try again.");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh", paddingTop: "2rem", paddingBottom: "2rem" }}>
      <Card className="p-4 shadow" style={{ width: "100%", maxWidth: "600px", margin: "2rem 0" }}>
        <h3 className="text-center mb-4 text-primary">Payment Gateway</h3>

        <ListGroup variant="flush">
          <ListGroup.Item>
            <strong>Name:</strong> {booking.name}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Email:</strong> {booking.username}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Destination:</strong> {booking.destination}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>From:</strong> {booking.startDate}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>To:</strong> {booking.endDate}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Duration:</strong> {duration} day(s)
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>People:</strong> {booking.people}
          </ListGroup.Item>
          <ListGroup.Item className={pricePerPersonPerDay ? "" : "text-danger"}>
            <strong>Price per Person per Day:</strong>{" "}
            {pricePerPersonPerDay
              ? `Rs. ${pricePerPersonPerDay}`
              : "Not Provided"}
          </ListGroup.Item>
          <ListGroup.Item className="text-success">
            <strong>Total Amount:</strong> Rs. {totalAmount}
          </ListGroup.Item>
        </ListGroup>

        {paymentSuccess === false && !bookingCancelled && (
          <Alert variant="danger" className="text-center mt-3">
            Payment failed. Please try again.
          </Alert>
        )}

        {paymentSuccess === true && (
          <Alert variant="success" className="text-center mt-3">
            <strong>✓ Payment Submitted Successfully!</strong>
            <br />
            {bookingReference && (
              <>
                <div className="mt-2 mb-2">
                  <strong>Your Booking Reference: {bookingReference}</strong>
                </div>
              </>
            )}
            Your payment is currently under verification by admin.
            <br />
            <small>Redirecting to "My Payments" page in 3 seconds...</small>
            <br />
            <Button 
              variant="link" 
              size="sm" 
              onClick={() => navigate('/payment-status')}
              className="mt-2"
            >
              Go to My Payments Now →
            </Button>
          </Alert>
        )}

        {bookingCancelled && (
          <Alert variant="warning" className="text-center mt-3">
            Booking has been cancelled and payment refunded.
          </Alert>
        )}

        {/* Payment Instructions */}
        {!paymentSuccess && (
          <Alert variant="info" className="mt-4">
            <Alert.Heading>📱 Payment Instructions</Alert.Heading>
            <hr />
            <p><strong>Please transfer Rs. {totalAmount} to any of the following accounts:</strong></p>
            <ul className="mb-0">
              <li><strong>EasyPaisa:</strong> 03XX-XXXXXXX</li>
              <li><strong>JazzCash:</strong> 03XX-XXXXXXX</li>
              <li><strong>Bank Account:</strong> XXXX-XXXX-XXXX-XXXX (Bank Name)</li>
            </ul>
            <hr />
            <p className="mb-0"><small>After making the payment, upload a screenshot of the receipt below.</small></p>
          </Alert>
        )}

        <div className="mt-4">
          <Form.Group className="mb-3">
            <Form.Label>
              <strong>Upload Payment Screenshot / Receipt <span className="text-danger">*</span></strong>
            </Form.Label>
            <Form.Control
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => setScreenshot(e.target.files[0])}
              disabled={paymentSuccess === true}
              required
            />
            <Form.Text className="text-danger d-block mb-2">
              ⚠️ Screenshot is required. Payment cannot be processed without proof.
            </Form.Text>
            <Form.Text className="text-muted">
              Upload a screenshot or PDF of your payment confirmation. Max size: 5MB
            </Form.Text>
            {screenshot && (
              <div className="mt-2">
                <small className="text-success">✓ File selected: {screenshot.name}</small>
              </div>
            )}
            {!screenshot && paymentSuccess === false && (
              <div className="mt-2">
                <small className="text-danger">✗ No file selected</small>
              </div>
            )}
          </Form.Group>
        </div>

        <div className="text-center mt-4">
          {!bookingCancelled && (
            <Button
              variant="success"
              onClick={handleFakePayment}
              disabled={loading || paymentSuccess === true}
              className="w-100 mb-2"
            >
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />{" "}
                  Processing...
                </>
              ) : paymentSuccess === true ? (
                "Paid"
              ) : (
                "Pay Now"
              )}
            </Button>
          )}

          {paymentSuccess === true && !bookingCancelled && (
            <Button
              variant="danger"
              onClick={handleCancelBooking}
              className="w-100"
            >
              Cancel Booking & Refund
            </Button>
          )}
        </div>
      </Card>
    </Container>
  );
}

export default PaymentGateway;