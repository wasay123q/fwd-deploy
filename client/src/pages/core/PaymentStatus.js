import React, { useState, useEffect, useContext } from "react";
import { Container, Card, Table, Badge, Spinner, Alert, Modal, Button } from "react-bootstrap";
import axios from "axios";
import AuthContext from "../../context/AuthContext";
import "./PaymentStatus.css";

function PaymentStatus() {
  const { user, authError } = useContext(AuthContext); // PHASE 4: Get authError
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showScreenshotModal, setShowScreenshotModal] = useState(false);
  const [currentScreenshot, setCurrentScreenshot] = useState(null);
  const [refundLoading, setRefundLoading] = useState({});
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundPaymentId, setRefundPaymentId] = useState(null);

  // ✅ FIX: Define BASE_URL
  const BASE_URL = process.env.REACT_APP_API_URL || "https://fwd-deploy.onrender.com/api";

  useEffect(() => {
    // PHASE 4: Clear local error when user successfully authenticates
    if (user && authError === null) {
      setError(null);
    }
    
    // Only fetch if user is loaded and authenticated
    if (user) {
      console.log('👤 User loaded, fetching payments for:', user.email);
      fetchPaymentStatus();
      
      // Auto-refresh every 10 seconds to catch updates
      const interval = setInterval(() => {
        console.log('🔄 Auto-refreshing payment status...');
        fetchPaymentStatus();
      }, 10000); // 10 seconds
      
      return () => clearInterval(interval);
    } else if (!user && !authError) {
      // User not loaded yet but no auth error - still loading
      console.log('⏳ Waiting for user to load...');
      setLoading(false);
    } else {
      // No user and there's an auth error
      setLoading(false);
    }
  }, [user, authError]); // PHASE 4: Depend on both user and authError

  const fetchPaymentStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login to view payment status");
        setLoading(false);
        return;
      }

      console.log("🔄 Fetching payment status...");
      const config = { 
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000 // 5 second timeout
      };
      
      // ✅ FIX: Use BASE_URL
      const response = await axios.get(
        `${BASE_URL}/payments/user/status`,
        config
      );
      
      console.log("✅ Payment status fetched:", response.data.length, "payments");
      console.log("📊 Payment data:", response.data);
      
      // Force update by creating new array
      setPayments([...response.data]);
      setError(null); // Clear any previous errors
      setLoading(false);
    } catch (err) {
      console.error("❌ Error fetching payment status:", err);
      
      if (err.code === 'ECONNABORTED') {
        setError("Request timeout. Please check if server is running.");
      } else if (err.code === 'ERR_NETWORK') {
        setError("Network error. Server may have crashed. Please restart it.");
      } else if (err.response?.status === 401) {
        // PHASE 4: Don't set error here - let AuthContext handle it
        console.log('⚠️ 401 error - AuthContext will handle re-authentication');
        // Token will be cleared by AuthContext's verifyToken function
      } else {
        setError("Failed to fetch payment status: " + (err.response?.data?.message || err.message));
      }
      
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "verified":
        return <Badge bg="success">Verified</Badge>;
      case "rejected":
        return <Badge bg="danger">Rejected</Badge>;
      case "suspended":
        return <Badge bg="secondary">Under Review</Badge>;
      case "refunded":
        return <Badge bg="info">Refunded</Badge>;
      case "pending":
      default:
        return <Badge bg="warning" text="dark">Pending</Badge>;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleRefundRequest = async (paymentId) => {
    setShowRefundModal(false);
    setRefundLoading({ ...refundLoading, [paymentId]: true });
    
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      // ✅ FIX: Use BASE_URL
      const response = await axios.put(
        `${BASE_URL}/payments/${paymentId}/refund`,
        { reason: 'User cancelled booking' },
        config
      );
      
      if (response.data.success) {
        alert('✅ Refund requested successfully! Admin will process your refund.');
        // Refresh payment list
        fetchPaymentStatus();
      }
    } catch (err) {
      console.error('❌ Error requesting refund:', err);
      alert('Failed to request refund: ' + (err.response?.data?.message || err.message));
    } finally {
      setRefundLoading({ ...refundLoading, [paymentId]: false });
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status" />
        <p className="mt-3">Loading payment status...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="payment-status-container mt-5 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Payment Status</h2>
        <Button 
          variant="primary" 
          onClick={() => {
            setLoading(true);
            fetchPaymentStatus();
          }}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "🔄 Refresh"}
        </Button>
      </div>

      {payments.length === 0 ? (
        <Alert variant="info" className="text-center">
          <h5>No Payments Found</h5>
          <p>Make a booking to see your payment status here.</p>
        </Alert>
      ) : (
        <>
          <Alert variant="info" className="mb-3">
            <strong>💡 Payment Status Guide:</strong>
            <ul className="mb-0 mt-2">
              <li><Badge bg="warning" text="dark">Pending</Badge> - Your payment is awaiting admin verification</li>
              <li><Badge bg="secondary">Under Review</Badge> - Payment is being reviewed, may require additional verification</li>
              <li><Badge bg="success">Verified</Badge> - Payment confirmed! Your booking is complete</li>
              <li><Badge bg="danger">Rejected</Badge> - Payment not accepted, check the reason column</li>
              <li><Badge bg="info">Refunded</Badge> - Booking cancelled, admin will process refund</li>
            </ul>
          </Alert>
        <Card className="shadow-lg">
          <Card.Body>
            <Table responsive hover className="mb-0">
              <thead className="table-dark">
                <tr>
                  <th>Booking ID</th>
                  <th>Destination</th>
                  <th>Date</th>
                  <th>People</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Screenshot</th>
                  <th>Verified At</th>
                  <th>Reason</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment, index) => (
                  <tr key={payment._id}>
                    <td>
                      <strong className="text-primary">{payment.bookingReference || `#${index + 1}`}</strong>
                    </td>
                    <td>
                      <strong>{payment.destination}</strong>
                      <br />
                      <small className="text-muted">
                        {payment.startDate} to {payment.endDate}
                      </small>
                    </td>
                    <td>
                      <small>{formatDate(payment.timestamp)}</small>
                    </td>
                    <td>{payment.people}</td>
                    <td>
                      <strong>Rs. {payment.totalAmount?.toLocaleString()}</strong>
                    </td>
                    <td>{getStatusBadge(payment.verificationStatus)}</td>
                    <td>
                      {payment.paymentScreenshot ? (
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() => {
                            setCurrentScreenshot(payment.paymentScreenshot);
                            setShowScreenshotModal(true);
                          }}
                        >
                          View
                        </Button>
                      ) : (
                        <small className="text-muted">Not uploaded</small>
                      )}
                    </td>
                    <td>
                      {payment.verifiedAt ? (
                        <small>{formatDate(payment.verifiedAt)}</small>
                      ) : (
                        <small className="text-muted">-</small>
                      )}
                    </td>
                    <td>
                      {payment.verificationStatus === "rejected" &&
                      payment.rejectionReason ? (
                        <small className="text-danger">
                          {payment.rejectionReason}
                        </small>
                      ) : payment.verificationStatus === "suspended" &&
                        payment.suspensionReason ? (
                        <small className="text-warning">
                          {payment.suspensionReason}
                        </small>
                      ) : payment.verificationStatus === "refunded" &&
                        payment.refundReason ? (
                        <small className="text-info">
                          {payment.refundReason}
                        </small>
                      ) : (
                        <small className="text-muted">-</small>
                      )}
                    </td>
                    <td>
                      {payment.verificationStatus === "pending" && (
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => {
                            setRefundPaymentId(payment._id);
                            setShowRefundModal(true);
                          }}
                          disabled={refundLoading[payment._id]}
                        >
                          {refundLoading[payment._id] ? (
                            <>
                              <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                              />
                              {' '}Processing...
                            </>
                          ) : (
                            '🔄 Request Refund'
                          )}
                        </Button>
                      )}
                      {payment.verificationStatus === "refunded" && (
                        <small className="text-muted">Refund Requested</small>
                      )}
                      {(payment.verificationStatus === "verified" || 
                        payment.verificationStatus === "rejected" ||
                        payment.verificationStatus === "suspended") && (
                        <small className="text-muted">-</small>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
        </>
      )}

      {/* Screenshot Viewer Modal */}
      <Modal 
        show={showScreenshotModal} 
        onHide={() => setShowScreenshotModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Payment Screenshot</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {currentScreenshot ? (
            <img 
              src={currentScreenshot} 
              alt="Payment Screenshot" 
              style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain' }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="red">Image failed to load</text></svg>';
              }}
            />
          ) : (
            <p>No screenshot available</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowScreenshotModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Refund Confirmation Modal */}
      <Modal 
        show={showRefundModal} 
        onHide={() => setShowRefundModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Refund Request</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to cancel this booking and request a refund?</p>
          <Alert variant="warning">
            <strong>⚠️ Important:</strong>
            <ul className="mb-0 mt-2">
              <li>Your booking will be cancelled immediately</li>
              <li>The admin will be notified to process your refund</li>
              <li>You will receive your money back according to the refund policy</li>
              <li>This action cannot be undone</li>
            </ul>
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRefundModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={() => handleRefundRequest(refundPaymentId)}
          >
            Yes, Request Refund
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default PaymentStatus;