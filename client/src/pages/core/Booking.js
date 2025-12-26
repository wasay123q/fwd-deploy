import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  Form,
  Button,
  Card,
  Alert,
  Table,
  Badge,
} from "react-bootstrap";
import {
  FaCalendarAlt,
  FaUsers,
  FaMapMarkerAlt,
  FaTrash,
} from "react-icons/fa";
import "./Booking.css";

function Booking() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({
    name: "",
    username: "",
    destination: "",
    startDate: "",
    endDate: "",
    people: "",
  });

  useEffect(() => {
    if (location.state?.destination) {
      setForm((prev) => ({ ...prev, destination: location.state.destination }));
    }
  }, [location.state]);

  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [dateError, setDateError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchBookings();
    
    // Auto-refresh bookings every 15 seconds
    const interval = setInterval(() => {
      const token = localStorage.getItem("token");
      if (token) {
        console.log('🔄 Auto-refreshing bookings...');
        fetchBookings();
      }
    }, 15000); // 15 seconds
    
    return () => clearInterval(interval);
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("ℹ️ No token, skipping fetch");
        setBookings([]);
        return;
      }

      console.log("🔄 Fetching verified bookings...");
      const headers = { Authorization: `Bearer ${token}` };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const res = await fetch("http://localhost:5000/api/payments", {
        headers,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (res.ok) {
        const data = await res.json();
        // Only show verified bookings in the booking list
        const verifiedBookings = data.filter(b => b.verificationStatus === 'verified');
        setBookings(verifiedBookings);
        console.log(`✅ Fetched ${verifiedBookings.length} verified bookings`);
      } else if (res.status === 401) {
        console.error("❌ Unauthorized - token may be invalid");
        setBookings([]);
      } else {
        console.error("❌ Failed to fetch bookings:", res.status);
        setBookings([]);
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.error("❌ Request timeout - server may have crashed");
      } else {
        console.error("❌ Error fetching bookings:", error.message);
      }
      setBookings([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "username") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setEmailError(emailRegex.test(value) ? "" : "Invalid email format");
    }

    // Date validation
    if (name === "startDate" || name === "endDate") {
      const startDate = name === "startDate" ? value : form.startDate;
      const endDate = name === "endDate" ? value : form.endDate;

      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        if (end < start) {
          setDateError("End date cannot be before start date");
        } else {
          setDateError("");
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (emailError || dateError) {
      setMessage("Please fix the errors before submitting");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setMessage(data.message || "Booking successful");
      if (data.success || !("success" in data)) {
        navigate("/paymentgateway", { state: { booking: form } });
      }
    } catch {
      setMessage("Booking failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking?"))
      return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/payments/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMessage(data.message || "Booking deleted.");
      fetchBookings();
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  return (
    <div className="booking-page">
      <Container className="booking-container">
        <div className="booking-header fade-in">
          <h1 className="gradient-text">Book Your Trip</h1>
          <p className="text-secondary">Plan your perfect getaway</p>
        </div>

        <div className="booking-content">
          {/* Booking Form */}
          <Card className="glass-card booking-form-card slide-in-left">
            <Card.Body>
              <h3 className="mb-4">Trip Details</h3>

              {message && (
                <Alert
                  variant={message.includes("failed") ? "danger" : "success"}
                  className="mb-3"
                >
                  {message}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="modern-label">Your Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    value={form.name}
                    onChange={handleChange}
                    className="modern-input"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="modern-label">Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="username"
                    placeholder="Enter your email"
                    value={form.username}
                    onChange={handleChange}
                    className="modern-input"
                    isInvalid={!!emailError}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {emailError}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="modern-label">
                    <FaMapMarkerAlt className="me-2" />
                    Destination
                  </Form.Label>
                  <Form.Select
                    name="destination"
                    value={form.destination}
                    onChange={handleChange}
                    className="modern-input"
                    required
                  >
                    <option value="">Select a destination</option>
                    <option value="Islamabad">Islamabad</option>
                    <option value="Multan">Multan</option>
                    <option value="Lahore">Lahore</option>
                    <option value="Karachi">Karachi</option>
                    <option value="Peshawar">Peshawar</option>
                    <option value="Quetta">Quetta</option>
                  </Form.Select>
                </Form.Group>

                <div className="row">
                  <div className="col-md-6">
                    <Form.Group className="mb-3">
                      <Form.Label className="modern-label">
                        <FaCalendarAlt className="me-2" />
                        Start Date
                      </Form.Label>
                      <Form.Control
                        type="date"
                        name="startDate"
                        value={form.startDate}
                        onChange={handleChange}
                        className="modern-input"
                        required
                      />
                    </Form.Group>
                  </div>
                  <div className="col-md-6">
                    <Form.Group className="mb-3">
                      <Form.Label className="modern-label">
                        <FaCalendarAlt className="me-2" />
                        End Date
                      </Form.Label>
                      <Form.Control
                        type="date"
                        name="endDate"
                        value={form.endDate}
                        onChange={handleChange}
                        className="modern-input"
                        min={form.startDate}
                        isInvalid={!!dateError}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {dateError}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </div>
                </div>

                <Form.Group className="mb-4">
                  <Form.Label className="modern-label">
                    <FaUsers className="me-2" />
                    Number of People
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="people"
                    placeholder="e.g., 2"
                    value={form.people}
                    onChange={handleChange}
                    className="modern-input"
                    min="1"
                    required
                  />
                </Form.Group>

                <Button
                  type="submit"
                  className="btn-primary w-100 btn-ripple"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Processing...
                    </>
                  ) : (
                    "Continue to Payment"
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>

          {/* Existing Bookings */}
          <div className="bookings-list slide-in-right">
            <h3 className="mb-4">Your Confirmed Bookings</h3>
            {bookings.length === 0 ? (
              <div className="empty-bookings glass-card">
                <div className="empty-icon">📅</div>
                <p>No confirmed bookings yet</p>
                <small className="text-muted">Bookings will appear here after admin verification</small>
              </div>
            ) : (
              <div className="table-responsive">
                <Table className="modern-table">
                  <thead>
                    <tr>
                      <th>Destination</th>
                      <th>Date</th>
                      <th>People</th>
                      <th>Amount</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking._id}>
                        <td>
                          <strong>{booking.destination}</strong>
                        </td>
                        <td>{booking.startDate}</td>
                        <td>
                          <Badge bg="primary">{booking.people} people</Badge>
                        </td>
                        <td className="text-success fw-bold">
                          Rs. {booking.totalAmount}
                        </td>
                        <td>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(booking._id)}
                          >
                            <FaTrash />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Booking;
