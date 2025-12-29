import React, { useState, useEffect, useContext, useCallback } from "react";
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
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  const BASE_URL = process.env.REACT_APP_API_URL || "https://fwd-deploy.onrender.com/api";

  // Show notification helper
  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 5000);
  };

  // Validate destination form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name || !formData.name.trim()) {
      errors.name = "Destination name is required";
    }
    
    if (!formData.description || !formData.description.trim()) {
      errors.description = "Description is required";
    }
    
    if (!formData.price || formData.price <= 0) {
      errors.price = "Price must be a positive number";
    }
    
    if (!formData.image || !formData.image.trim()) {
      errors.image = "Image filename is required";
    } else if (!formData.image.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      errors.image = "Please enter a valid image filename (e.g., image.jpg)";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ✅ FIX: Wrapped in useCallback
  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      console.log("🔄 Admin fetching data...");
      
      const bookingsRes = await axios.get(`${BASE_URL}/payments`, config);
      const destinationsRes = await axios.get(`${BASE_URL}/destinations`);
      const usersRes = await axios.get(`${BASE_URL}/users`, config);

      console.log("✅ Data fetched successfully");

      setBookings(bookingsRes.data);
      setDestinations(destinationsRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.error("❌ Error fetching admin data:", error);
      alert("Failed to fetch data: " + (error.response?.data?.message || error.message));
    }
  }, [BASE_URL]); // Dependency ensures it updates if URL changes

  // ✅ FIX: Added fetchData to dependency array
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const deleteBooking = async (id) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${BASE_URL}/payments/${id}`, {
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
        `${BASE_URL}/payments/${id}/verify`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setBookings(bookings.map(b => 
          b._id === id ? { ...b, verificationStatus: status, verifiedAt: new Date() } : b
        ));
        alert("Payment verified successfully!");
      }
    } catch (error) {
      alert("Failed to verify payment: " + (error.response?.data?.message || error.message));
    }
  };

  const handleRejectPayment = async (id) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${BASE_URL}/payments/${id}/verify`,
        { status: "rejected", rejectionReason: reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setBookings(bookings.map(b => 
          b._id === id ? { ...b, verificationStatus: 'rejected', rejectionReason: reason, verifiedAt: new Date() } : b
        ));
        alert("Payment rejected!");
      }
    } catch (error) {
      alert("Failed to reject payment: " + (error.response?.data?.message || error.message));
    }
  };

  const handleSuspendPayment = async (id) => {
    const reason = prompt("Enter suspension reason (optional):");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${BASE_URL}/payments/${id}/verify`,
        { status: "suspended", suspensionReason: reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setBookings(bookings.map(b => 
          b._id === id ? { ...b, verificationStatus: 'suspended', suspensionReason: reason, verifiedAt: new Date() } : b
        ));
        alert("Payment suspended!");
      }
    } catch (error) {
      alert("Failed to suspend payment: " + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteDest = async (id) => {
    const dest = destinations.find(d => d._id === id);
    if (window.confirm(`Are you sure you want to delete '${dest?.name || 'this destination'}'?`)) {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.delete(`${BASE_URL}/destinations/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDestinations(destinations.filter((d) => d._id !== id));
        showNotification(
          response.data.deletedDestination 
            ? `Destination '${response.data.deletedDestination}' deleted successfully` 
            : "Destination deleted successfully", 
          "success"
        );
      } catch (error) {
        const errorMsg = error.response?.data?.message || "Failed to delete destination";
        showNotification(errorMsg, "danger");
      }
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${BASE_URL}/users/${id}`, {
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
        `${BASE_URL}/users/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchData();
    } catch (error) {
      alert("Failed to update user status");
    }
  };

  const handleSaveDest = async () => {
    // Validate form
    if (!validateForm()) {
      showNotification("Please fill in all required fields correctly", "danger");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // Trim all string fields
      const trimmedData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        image: formData.image.trim(),
      };

      if (currentDest) {
        const res = await axios.put(
          `${BASE_URL}/destinations/${currentDest._id}`,
          trimmedData,
          config
        );
        setDestinations(
          destinations.map((d) => (d._id === currentDest._id ? res.data : d))
        );
        showNotification(`Destination '${res.data.name}' updated successfully`, "success");
      } else {
        const res = await axios.post(
          `${BASE_URL}/destinations`,
          trimmedData,
          config
        );
        setDestinations([...destinations, res.data]);
        showNotification(`Destination '${res.data.name}' created successfully`, "success");
      }
      setShowModal(false);
      setFormData({ name: "", description: "", price: "", image: "" });
      setFormErrors({});
      setCurrentDest(null);
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to save destination";
      showNotification(errorMsg, "danger");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (dest = null) => {
    setFormErrors({});
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
      {notification.show && (
        <div className={`alert alert-${notification.type} alert-dismissible fade show`} role="alert">
          <strong>{notification.type === "success" ? "Success!" : "Error!"}</strong> {notification.message}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setNotification({ show: false, message: "", type: "" })}
            aria-label="Close"
          ></button>
        </div>
      )}
      <div className="admin-header-section">
        <h2 className="text-center mb-4">Admin Dashboard</h2>
        <Button
          variant="outline-danger"
          className="logout-btn"
          onClick={() => {
            logout();
            navigate('/login');
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
              <strong>🔔 Refund Alert:</strong> Some bookings have been marked as <strong>refunded</strong>. Please process these refunds.
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
                      <span className={`badge ${
                        booking.verificationStatus === "verified" ? "bg-success" :
                        booking.verificationStatus === "rejected" ? "bg-danger" :
                        booking.verificationStatus === "suspended" ? "bg-secondary" :
                        booking.verificationStatus === "refunded" ? "bg-info" :
                        "bg-warning text-dark"
                      }`}>
                        {booking.verificationStatus || 'pending'}
                      </span>
                    </td>
                    <td>
                      {booking.verificationStatus === "pending" && (
                        <>
                          <Button variant="success" size="sm" className="me-1" onClick={() => handleVerifyPayment(booking._id, "verified")}>Verify</Button>
                          <Button variant="secondary" size="sm" className="me-1" onClick={() => handleSuspendPayment(booking._id)}>Suspend</Button>
                          <Button variant="warning" size="sm" className="me-1" onClick={() => handleRejectPayment(booking._id)}>Reject</Button>
                        </>
                      )}
                      {booking.verificationStatus === "suspended" && (
                        <>
                          <Button variant="success" size="sm" className="me-1" onClick={() => handleVerifyPayment(booking._id, "verified")}>Verify</Button>
                          <Button variant="warning" size="sm" className="me-1" onClick={() => handleRejectPayment(booking._id)}>Reject</Button>
                        </>
                      )}
                      {booking.verificationStatus !== "refunded" && (
                        <Button variant="danger" size="sm" onClick={() => deleteBooking(booking._id)}>Delete</Button>
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
                      <Button variant="primary" size="sm" className="me-2" onClick={() => openModal(dest)}>Edit</Button>
                      <Button variant="danger" size="sm" onClick={() => handleDeleteDest(dest._id)}>Delete</Button>
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
                    <td>{user.isSuspended ? <span className="text-danger">Suspended</span> : <span className="text-success">Active</span>}</td>
                    <td>
                      <Button variant={user.isSuspended ? "success" : "warning"} size="sm" className="me-2" onClick={() => handleSuspendUser(user._id)} disabled={user.role === "admin"}>
                        {user.isSuspended ? "Activate" : "Suspend"}
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDeleteUser(user._id)} disabled={user.role === "admin"}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Tab>
      </Tabs>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton><Modal.Title>{currentDest ? "Edit Destination" : "Add Destination"}</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name <span className="text-danger">*</span></Form.Label>
              <Form.Control 
                type="text" 
                value={formData.name} 
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                isInvalid={!!formErrors.name}
                placeholder="e.g., Multan"
              />
              <Form.Control.Feedback type="invalid">{formErrors.name}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description <span className="text-danger">*</span></Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                value={formData.description} 
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                isInvalid={!!formErrors.description}
                placeholder="Enter destination description"
              />
              <Form.Control.Feedback type="invalid">{formErrors.description}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price (Rs.) <span className="text-danger">*</span></Form.Label>
              <Form.Control 
                type="number" 
                value={formData.price} 
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                isInvalid={!!formErrors.price}
                placeholder="e.g., 1500"
                min="1"
              />
              <Form.Control.Feedback type="invalid">{formErrors.price}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image Filename <span className="text-danger">*</span></Form.Label>
              <Form.Control 
                type="text" 
                placeholder="e.g., mulimg.jpg" 
                value={formData.image} 
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                isInvalid={!!formErrors.image}
              />
              <Form.Control.Feedback type="invalid">{formErrors.image}</Form.Control.Feedback>
              <Form.Text className="text-muted">Supported formats: jpg, jpeg, png, gif, webp</Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)} disabled={loading}>Close</Button>
          <Button variant="primary" onClick={handleSaveDest} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showScreenshotModal} onHide={() => setShowScreenshotModal(false)} size="lg" centered>
        <Modal.Header closeButton><Modal.Title>Payment Screenshot</Modal.Title></Modal.Header>
        <Modal.Body className="text-center">
          {currentScreenshot ? (
            <img src={currentScreenshot} alt="Payment Screenshot" style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain' }} />
          ) : (
            <p>No screenshot available</p>
          )}
        </Modal.Body>
        <Modal.Footer><Button variant="secondary" onClick={() => setShowScreenshotModal(false)}>Close</Button></Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminDashboard;