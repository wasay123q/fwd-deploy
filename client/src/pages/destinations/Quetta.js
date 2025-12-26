import React, { useState, useContext } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import AuthModal from '../../components/AuthModal';
import './PlaceDetail.css';

const quettaPlaces = [
  {
    name: "Hanna Lake",
    description: "Hanna Lake is a serene reservoir surrounded by mountains, offering a peaceful retreat for boating and picnicking.",
    image: "/hanna1.jpg"
  },
  {
    name: "Ziarat Residency",
    description: "The historic Ziarat Residency is where Quaid-e-Azam Muhammad Ali Jinnah spent his last days, now a national monument.",
    image: "/ziarat1.jpg"
  },
  {
    name: "Hazarganji Chiltan National Park",
    description: "Home to rare wildlife including the Chiltan ibex, this park is perfect for nature lovers and adventure seekers.",
    image: "/hazarganji1.jpg"
  },
  {
    name: "Quetta Bazaar",
    description: "A colorful and vibrant marketplace offering traditional handicrafts, dried fruits, and regional textiles.",
    image: "/bazaarquetta1.jpg"
  }
];

function Quetta() {
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
      <div className="city-hero-banner" style={{ backgroundImage: "url('/quettaimg.jpg')" }}>
        <div className="city-hero-overlay">
          <h1 className="city-hero-title">Quetta</h1>
          <p className="city-hero-subtitle">Fruit Garden of Pakistan</p>
          <Button 
            className="mt-4 px-5 py-3 btn-auth-primary" 
            style={{ fontSize: "1.1rem", borderRadius: "30px" }}
            onClick={handleBookNow}
          >
            Book Your Trip to Quetta
          </Button>
        </div>
      </div>
      
      <Container className="city-content-wrapper">
        <div className="city-intro">
          <p className="city-description">
            Quetta, the provincial capital of Balochistan, is known for its mountainous terrain, historic sites, and cultural richness. Discover the natural beauty and heritage of this mountain city.
          </p>
        </div>

        <h2 className="section-heading">Popular Attractions</h2>
        <Row className="city-places-grid">
          {quettaPlaces.map((place, idx) => (
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

export default Quetta;