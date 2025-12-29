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

  // ✅ FIX: Define BASE_URL to switch between Localhost and Render automatically
  const BASE_URL = process.env.REACT_APP_API_URL || "https://fwd-deploy.onrender.com/api";

  useEffect(() => {
    const fetchDestinations = async () => {
      // Check cache first
      const cachedData = localStorage.getItem('destinations_cache');
      const cacheTimestamp = localStorage.getItem('destinations_cache_time');
      const now = Date.now();
      const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

      // If cache exists and is still valid, use it
      if (cachedData && cacheTimestamp && (now - parseInt(cacheTimestamp)) < CACHE_DURATION) {
        console.log('📦 Using cached destinations');
        const data = JSON.parse(cachedData);
        setDestinations(data);
        setFilteredDestinations(data);
        setLoading(false);
        return;
      }

      // Otherwise, fetch from API
      console.log('🌐 Fetching destinations from API');
      fetch(`${BASE_URL}/destinations`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch destinations.");
          return res.json();
        })
        .then((data) => {
          // Save to cache
          localStorage.setItem('destinations_cache', JSON.stringify(data));
          localStorage.setItem('destinations_cache_time', now.toString());
          
          setDestinations(data);
          setFilteredDestinations(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    };

    fetchDestinations();
  }, [BASE_URL]);

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
          <Row className="destinations-grid">
            {[1, 2, 3, 4, 5, 6].map((skeleton) => (
              <Col key={skeleton} md={6} lg={4} className="mb-4">
                <Card className="destination-card">
                  <div 
                    className="skeleton-image" 
                    style={{
                      height: '250px',
                      background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                      backgroundSize: '200% 100%',
                      animation: 'shimmer 1.5s infinite'
                    }}
                  />
                  <Card.Body>
                    <div 
                      className="skeleton-text mb-2" 
                      style={{
                        height: '24px',
                        width: '60%',
                        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 1.5s infinite',
                        borderRadius: '4px'
                      }}
                    />
                    <div 
                      className="skeleton-text" 
                      style={{
                        height: '16px',
                        width: '100%',
                        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 1.5s infinite',
                        borderRadius: '4px'
                      }}
                    />
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {error && (
          <div className="alert-container">
             <Alert variant="danger" className="modern-alert slide-in-left">
              <strong>Error:</strong> {error}
            </Alert>
          </div>
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
            <Col key={dest._id || index} md={6} lg={4} className="mb-4">
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
                    src={dest.image && dest.image.startsWith('data:image') ? dest.image : `/${dest.image || "default.jpg"}`}
                    alt={dest.name}
                    className="destination-image"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = "/default.jpg"; // Fallback image
                    }}
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