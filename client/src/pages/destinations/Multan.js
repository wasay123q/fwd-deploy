import React, { useState, useContext } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import AuthModal from '../../components/AuthModal';
import './PlaceDetail.css';

const multanPlaces = [
  {
    name: "Shrine of Bahauddin Zakariya",
    description: "A 13th-century mausoleum and one of the most revered Sufi shrines in South Asia. It's a major spiritual and architectural landmark.",
    image: "/zakariya1.jpg"
  },
  {
    name: "Multan Fort",
    description: "An ancient fort with historic walls and gates, offering a panoramic view of the city and a glimpse into its rich past.",
    image: "/fort1.jpg"
  },
  {
    name: "Ghanta Ghar",
    description: "A colonial-era clock tower in the heart of Multan, surrounded by vibrant bazaars and local culture.",
    image: "/gg1.jpg"
  },
  {
    name: "Hussain Agahi Bazaar",
    description: "One of the oldest markets in South Asia, famous for handicrafts, blue pottery, and traditional clothing.",
    image: "/bazaar1.jpg"
  }
];

function Multan() {
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
      <div className="city-hero-banner" style={{ backgroundImage: "url('/multanimg.jpg')" }}>
        <div className="city-hero-overlay">
          <h1 className="city-hero-title">Multan</h1>
          <p className="city-hero-subtitle">The City of Saints</p>
          <Button 
            className="mt-4 px-5 py-3 btn-auth-primary" 
            style={{ fontSize: "1.1rem", borderRadius: "30px" }}
            onClick={handleBookNow}
          >
            Book Your Trip to Multan
          </Button>
        </div>
      </div>
      
      <Container className="city-content-wrapper">
        <div className="city-intro">
          <p className="city-description">
            Multan, known as the City of Saints, is rich in cultural heritage, stunning architecture, and Sufi history. Discover the spiritual and historical treasures of this ancient city.
          </p>
        </div>

        <h2 className="section-heading">Popular Attractions</h2>
        <Row className="city-places-grid">
          {multanPlaces.map((place, idx) => (
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

export default Multan;