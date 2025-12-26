import React, { useState, useContext } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import AuthModal from '../../components/AuthModal';
import './PlaceDetail.css';

const peshawarPlaces = [
  {
    name: "Bala Hisar Fort",
    description: "An ancient fort with a commanding view of Peshawar, Bala Hisar has served as a key military stronghold since the Mughal era.",
    image: "/balahisar1.jpg"
  },
  {
    name: "Peshawar Museum",
    description: "Home to one of the largest collections of Gandhara art, the Peshawar Museum is a hub for those interested in ancient Buddhist heritage.",
    image: "/museum1.jpg"
  },
  {
    name: "Sethi House",
    description: "A beautifully preserved 19th-century mansion showcasing exquisite wooden architecture and intricate carvings of the Sethi family.",
    image: "/sethi1.jpg"
  },
  {
    name: "Qissa Khwani Bazaar",
    description: "Known as the 'Bazaar of Storytellers', this historic market is full of vibrant culture, traditional food, and ancient tales.",
    image: "/qbazaar1.jpg"
  }
];

function Peshawar() {
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
      <div className="city-hero-banner" style={{ backgroundImage: "url('/peshawarimg.jpg')" }}>
        <div className="city-hero-overlay">
          <h1 className="city-hero-title">Peshawar</h1>
          <p className="city-hero-subtitle">City of Flowers</p>
          <Button 
            className="mt-4 px-5 py-3 btn-auth-primary" 
            style={{ fontSize: "1.1rem", borderRadius: "30px" }}
            onClick={handleBookNow}
          >
            Book Your Trip to Peshawar
          </Button>
        </div>
      </div>
      
      <Container className="city-content-wrapper">
        <div className="city-intro">
          <p className="city-description">
            Peshawar, one of the oldest cities in South Asia, is renowned for its rich cultural heritage, ancient architecture, and historic trade routes. Explore the ancient Silk Road city.
          </p>
        </div>

        <h2 className="section-heading">Popular Attractions</h2>
        <Row className="city-places-grid">
          {peshawarPlaces.map((place, idx) => (
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

export default Peshawar;