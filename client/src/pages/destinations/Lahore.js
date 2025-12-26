import React, { useState, useContext } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import AuthModal from '../../components/AuthModal';
import './PlaceDetail.css';

const lahorePlaces = [
  {
    name: "Badshahi Mosque",
    description: "One of the largest mosques in the world, Badshahi Mosque is a masterpiece of Mughal architecture and a symbol of Lahore's rich history.",
    image: "/badshahi1.jpg"
  },
  {
    name: "Lahore Fort",
    description: "A UNESCO World Heritage Site, the Lahore Fort is an iconic citadel that has stood since the Mughal era with majestic gates and palaces.",
    image: "/lahorefort1.jpg"
  },
  {
    name: "Shalimar Gardens",
    description: "Built by Emperor Shah Jahan, these Mughal gardens feature stunning terraces, fountains, and floral layouts — a haven of tranquility.",
    image: "/shalimar1.jpg"
  },
  {
    name: "Minar-e-Pakistan",
    description: "An important national monument commemorating the Lahore Resolution of 1940, it symbolizes Pakistan's struggle for independence.",
    image: "/minar1.jpg"
  }
];

function Lahore() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleBookNow = () => {
    if (user) {
      navigate('/booking');
    } else {
      setShowAuthModal(true);
    }
  };

  return (
    <div className="city-destination-page">
      <div className="city-hero-banner" style={{ backgroundImage: "url('/lahoreimg.jpg')" }}>
        <div className="city-hero-overlay">
          <h1 className="city-hero-title">Lahore</h1>
          <p className="city-hero-subtitle">The Heart of Pakistan</p>
          <Button 
            className="mt-4 px-5 py-3 btn-auth-primary" 
            style={{ fontSize: "1.1rem", borderRadius: "30px" }}
            onClick={handleBookNow}
          >
            Book Your Trip to Lahore
          </Button>
        </div>
      </div>
      
      <Container className="city-content-wrapper">
        <div className="city-intro">
          <p className="city-description">
            Lahore, the cultural capital of Pakistan, is known for its vibrant history, grand architecture, and timeless heritage. Explore the magnificent Mughal-era landmarks and rich traditions.
          </p>
        </div>

        <h2 className="section-heading">Popular Attractions</h2>
        <Row className="city-places-grid">
          {lahorePlaces.map((place, idx) => (
            <Col key={idx} md={6} lg={6} className="city-place-col">
              <Card className="city-place-card">
                <div className="city-place-image-wrapper">
                  <img src={place.image} alt={place.name} className="city-place-image" />
                </div>
                <Card.Body className="city-place-body">
                  <h3 className="city-place-title">{place.name}</h3>
                  <p className="city-place-description">{place.description}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
      <AuthModal show={showAuthModal} handleClose={() => setShowAuthModal(false)} />
    </div>
  );
}

export default Lahore;