import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Alert,
  Form,
  InputGroup,
  Button,
  Badge,
} from "react-bootstrap";
import { FaSearch, FaMapMarkerAlt } from "react-icons/fa";
import AuthContext from "../../context/AuthContext"; 
import "./Destinations.css";

function Destinations() {
  const [destinations, setDestinations] = useState([]);
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://fwd-deploy.onrender.com/api/destinations")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch destinations.");
        return res.json();
      })
      .then((data) => {
        setDestinations(data);
        setFilteredDestinations(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const filtered = destinations.filter((dest) =>
      dest.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredDestinations(filtered);
  }, [search, destinations]);

  const handleCardClick = (dest) => {
    const pageName = dest.name.toLowerCase();
    navigate(`/${pageName}`);
  };

  // --- UPDATED LOGIC ---
  const handleBookClick = (e, dest) => {
    e.stopPropagation(); 
    
    if (user) {
      navigate("/booking", {
        state: { destination: dest.name },
      });
    } else {
      // Send them to Login, but give them the "Map" to get back to booking
      navigate("/login", {
        state: { 
          alertMessage: "Please log in or create an account to continue booking your trip.",
          redirectTo: "/booking",        // Where to go after login
          destination: dest.name         // The data needed for that page
        }
      });
    }
  };

  return (
    <div className="destinations-page">
      <div className="destinations-hero">
        <Container>
          <div className="hero-content fade-in">
            <h1 className="gradient-text">Explore Top Destinations</h1>
            <p className="hero-subtitle">
              Discover amazing places and create unforgettable memories
            </p>
          </div>
        </Container>
      </div>

      <Container className="destinations-container">
        <div className="search-section slide-up">
          <InputGroup className="search-bar glass-card">
            <InputGroup.Text className="search-icon">
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search destinations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </InputGroup>
        </div>

        {loading && (
          <div className="loading-container">
            <div className="spinner-wrapper">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3 text-secondary">Loading destinations...</p>
            </div>
          </div>
        )}

        {error && (
          <Alert variant="danger" className="modern-alert slide-in-left">
            <strong>Error:</strong> {error}
          </Alert>
        )}

        {!loading && filteredDestinations.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🏝️</div>
            <h3>No destinations found</h3>
            <p className="text-secondary">Try adjusting your search criteria</p>
          </div>
        )}

        <Row className="destinations-grid">
          {filteredDestinations.map((dest, index) => (
            <Col key={dest.id} md={6} lg={4} className="mb-4">
              <Card
                className={`destination-card card-hover fade-in`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className="card-image-wrapper image-zoom"
                  onClick={() => handleCardClick(dest)}
                >
                  <Card.Img
                    variant="top"
                    src={`/${dest.image || "default.jpg"}`}
                    alt={dest.name}
                    className="destination-image"
                  />
                  <div className="image-overlay">
                    <div className="overlay-content">
                      <FaMapMarkerAlt className="location-icon" />
                      <span>View Details</span>
                    </div>
                  </div>
                </div>

                <Card.Body className="card-content">
                  <div className="card-header-section">
                    <Card.Title className="destination-title">
                      {dest.name}
                    </Card.Title>
                    <Badge className="price-badge bg-gradient-hero">
                      Rs. {dest.price}
                    </Badge>
                  </div>

                  <Card.Text className="destination-description">
                    {dest.description}
                  </Card.Text>
                </Card.Body>

                <Card.Footer className="card-footer">
                  <Button
                    className="btn-primary w-100 btn-ripple"
                    onClick={(e) => handleBookClick(e, dest)} 
                  >
                    Book Now
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default Destinations;