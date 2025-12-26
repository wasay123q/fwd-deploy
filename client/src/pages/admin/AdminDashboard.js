import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Table,
  Button,
  Tab,
  Tabs,
  Form,
  Modal,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthContext from "../../context/AuthContext";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showScreenshotModal, setShowScreenshotModal] = useState(false);
  const [currentScreenshot, setCurrentScreenshot] = useState(null);
  const [currentDest, setCurrentDest] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      console.log("🔄 Admin fetching data...");
      
      const bookingsRes = await axios.get(
        "https://fwd-deploy.onrender.com/api/payments",
        config
      );
      console.log("✅ Bookings fetched:", bookingsRes.data.length);
      
      const destinationsRes = await axios.get(
        "https://fwd-deploy.onrender.com/api/destinations"
      );
      console.log("✅ Destinations fetched:", destinationsRes.data.length);
      
      const usersRes = await axios.get(
        "https://fwd-deploy.onrender.com/api/users",
        config
      );
      console.log("✅ Users fetched:", usersRes.data.length);

      setBookings(bookingsRes.data);
      setDestinations(destinationsRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.error("❌ Error fetching admin data:", error);
      console.error("Error details:", error.response?.data);
      alert("Failed to fetch data: " + (error.response?.data?.message || error.message));
    }
  };

  const deleteBooking = async (id) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`https://fwd-deploy.onrender.com/api/payments/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(bookings.filter((b) => b._id !== id));
      } catch (error) {
        alert("Failed to delete booking");
      }
    }
  };

  const handleVerifyPayment = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `https://fwd-deploy.onrender.com/api/payments/${id}/verify`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        // Update local state immediately
        setBookings(bookings.map(b => 
          b._id === id ? { ...b, verificationStatus: status, verifiedAt: new Date() } : b
        ));
        alert("Payment verified successfully!");
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      alert("Failed to verify payment: " + (error.response?.data?.message || error.message));
    }
  };

  const handleRejectPayment = async (id) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `https://fwd-deploy.onrender.com/api/payments/${id}/verify`,
        { status: "rejected", rejectionReason: reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        // Update local state immediately
        setBookings(bookings.map(b => 
          b._id === id ? { ...b, verificationStatus: 'rejected', rejectionReason: reason, verifiedAt: new Date() } : b
        ));
        alert("Payment rejected!");
      }
    } catch (error) {
      console.error("Error rejecting payment:", error);
      alert("Failed to reject payment: " + (error.response?.data?.message || error.message));
    }
  };

  const handleSuspendPayment = async (id) => {
    const reason = prompt("Enter suspension reason (optional):");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `https://fwd-deploy.onrender.com/api/payments/${id}/verify`,
        { status: "suspended", suspensionReason: reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        // Update local state immediately
        setBookings(bookings.map(b => 
          b._id === id ? { ...b, verificationStatus: 'suspended', suspensionReason: reason, verifiedAt: new Date() } : b
        ));
        alert("Payment suspended!");
      }
    } catch (error) {
      console.error("Error suspending payment:", error);
      alert("Failed to suspend payment: " + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteDest = async (id) => {
    if (window.confirm("Are you sure you want to delete this destination?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`https://fwd-deploy.onrender.com/api/destinations/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDestinations(destinations.filter((d) => d._id !== id));
      } catch (error) {
        alert("Failed to delete destination");
      }
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`https://fwd-deploy.onrender.com/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(users.filter((u) => u._id !== id));
      } catch (error) {
        alert("Failed to delete user");
      }
    }
  };

  const handleSuspendUser = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://fwd-deploy.onrender.com/api/users/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchData(); // Refresh data
    } catch (error) {
      alert("Failed to update user status");
    }
  };

  const handleSaveDest = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (currentDest) {
        // Update
        const res = await axios.put(
          `https://fwd-deploy.onrender.com/api/destinations/${currentDest._id}`,
          formData,
          config
        );
        setDestinations(
          destinations.map((d) => (d._id === currentDest._id ? res.data : d))
        );
      } else {
        // Create
        const res = await axios.post(
          "https://fwd-deploy.onrender.com/api/destinations",
          formData,
          config
        );
        setDestinations([...destinations, res.data]);
      }
      setShowModal(false);
      setFormData({ name: "", description: "", price: "", image: "" });
      setCurrentDest(null);
    } catch (error) {
      alert("Failed to save destination");
    }
  };

  const openModal = (dest = null) => {
    if (dest) {
      setCurrentDest(dest);
      setFormData({
        name: dest.name,
        description: dest.description,
        price: dest.price,
        image: dest.image,
      });
    } else {
      setCurrentDest(null);
      setFormData({ name: "", description: "", price: "", image: "" });
    }
    setShowModal(true);
  };

  return (
    <Container className="py-5">
      <div className="admin-header-section">
        <h2 className="text-center mb-4">Admin Dashboard</h2>
        <Button
          variant="outline-danger"
          className="logout-btn"
          onClick={() => {
            logout(); // PHASE 5: Use logout from AuthContext
            navigate('/login'); // PHASE 5: Navigate with React Router
          }}
        >
          Logout
        </Button>
      </div>
      <Tabs defaultActiveKey="bookings" className="mb-3">
        <Tab eventKey="bookings" title="Bookings">
          <h3 className="section-title">Bookings</h3>
          {bookings.some(b => b.verificationStatus === "refunded") && (
            <div className="alert alert-info mb-3">
              <strong>🔔 Refund Alert:</strong> Some bookings have been marked as <strong>refunded</strong>. Please process these refunds and return the money to the respective users.
            </div>
          )}
          <div className="table-responsive shadow-sm rounded">
            <Table hover className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th>Booking ID</th>
                  <th>User</th>
                  <th>Destination</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Screenshot</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id}>
                    <td><small className="text-muted">{booking.bookingReference || 'N/A'}</small></td>
                    <td>{booking.username}</td>
                    <td>{booking.destination}</td>
                    <td>{booking.startDate}</td>
                    <td>Rs. {booking.totalAmount}</td>
                    <td>
                      {booking.paymentScreenshot ? (
                        <Button
                          size="sm"
                          variant="outline-info"
                          onClick={() => {
                            setCurrentScreenshot(booking.paymentScreenshot);
                            setShowScreenshotModal(true);
                          }}
                        >
                          View
                        </Button>
                      ) : (
                        <span className="text-muted">No screenshot</span>
                      )}
                    </td>
                    <td>
                      {booking.verificationStatus === "verified" && (
                        <span className="badge bg-success">Verified</span>
                      )}
                      {booking.verificationStatus === "rejected" && (
                        <span className="badge bg-danger">Rejected</span>
                      )}
                      {booking.verificationStatus === "suspended" && (
                        <span className="badge bg-secondary">Suspended</span>
                      )}
                      {booking.verificationStatus === "refunded" && (
                        <span className="badge bg-info">Refunded</span>
                      )}
                      {booking.verificationStatus === "pending" && (
                        <span className="badge bg-warning text-dark">Pending</span>
                      )}
                    </td>
                    <td>
                      {booking.verificationStatus === "pending" && (
                        <>
                          <Button
                            variant="success"
                            size="sm"
                            className="me-1"
                            onClick={() => handleVerifyPayment(booking._id, "verified")}
                          >
                            Verify
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            className="me-1"
                            onClick={() => handleSuspendPayment(booking._id)}
                          >
                            Suspend
                          </Button>
                          <Button
                            variant="warning"
                            size="sm"
                            className="me-1"
                            onClick={() => handleRejectPayment(booking._id)}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      {booking.verificationStatus === "suspended" && (
                        <>
                          <Button
                            variant="success"
                            size="sm"
                            className="me-1"
                            onClick={() => handleVerifyPayment(booking._id, "verified")}
                          >
                            Verify
                          </Button>
                          <Button
                            variant="warning"
                            size="sm"
                            className="me-1"
                            onClick={() => handleRejectPayment(booking._id)}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      {booking.verificationStatus === "refunded" && (
                        <span className="text-info small">
                          <strong>⚠️ Refund Requested:</strong> Process refund to user
                        </span>
                      )}
                      {booking.verificationStatus !== "refunded" && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => deleteBooking(booking._id)}
                        >
                          Delete
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Tab>
        <Tab eventKey="destinations" title="Destinations">
          <h3 className="section-title">Destinations</h3>
          <div className="d-flex justify-content-end mb-3">
            <Button variant="success" onClick={() => openModal()}>
              Add New Destination
            </Button>
          </div>
          <div className="table-responsive shadow-sm rounded">
            <Table hover className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {destinations.map((dest) => (
                  <tr key={dest._id}>
                    <td>{dest.name}</td>
                    <td>Rs. {dest.price}</td>
                    <td>{dest.description}</td>
                    <td>
                      <Button
                        variant="primary"
                        size="sm"
                        className="me-2"
                        onClick={() => openModal(dest)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteDest(dest._id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Tab>
        <Tab eventKey="users" title="Users">
          <h3 className="section-title">Users</h3>
          <div className="table-responsive shadow-sm rounded">
            <Table hover className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      {user.isSuspended ? (
                        <span className="text-danger">Suspended</span>
                      ) : (
                        <span className="text-success">Active</span>
                      )}
                    </td>
                    <td>
                      <Button
                        variant={user.isSuspended ? "success" : "warning"}
                        size="sm"
                        className="me-2"
                        onClick={() => handleSuspendUser(user._id)}
                        disabled={user.role === "admin"}
                      >
                        {user.isSuspended ? "Activate" : "Suspend"}
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteUser(user._id)}
                        disabled={user.role === "admin"}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Tab>
      </Tabs>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {currentDest ? "Edit Destination" : "Add Destination"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image Filename</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g., mulimg.jpg"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveDest}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

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
    </Container>
  );
};

export default AdminDashboard;
