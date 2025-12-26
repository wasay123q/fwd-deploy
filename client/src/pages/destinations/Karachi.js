import React, { useState, useContext } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import AuthModal from '../../components/AuthModal';
import './PlaceDetail.css';

const karachiPlaces = [
  {
    name: "Clifton Beach",
    description: "A popular seaside destination in Karachi, Clifton Beach is known for its lively atmosphere, camel rides, and sunset views.",
    image: "/clifton1.jpg"
  },
  {
    name: "Quaid-e-Azam's Mausoleum",
    description: "A national monument and the final resting place of Muhammad Ali Jinnah, the founder of Pakistan.",
    image: "/mausoleum1.jpg"
  },
  {
    name: "Frere Hall",
    description: "A historic building dating back to the British colonial era, now used as a library and exhibition space.",
    image: "/frere1.jpg"
  },
  {
    name: "Pakistan Maritime Museum",
    description: "A naval-themed museum featuring retired submarines, aircraft, and exhibits on Pakistan's maritime history.",
    image: "/maritime1.jpg"
  }
];

function Karachi() {
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
      <div className="city-hero-banner" style={{ backgroundImage: "url('/karachiimg.jpg')" }}>
        <div className="city-hero-overlay">
          <h1 className="city-hero-title">Karachi</h1>
          <p className="city-hero-subtitle">City of Lights</p>
          <Button 
            className="mt-4 px-5 py-3 btn-auth-primary" 
            style={{ fontSize: "1.1rem", borderRadius: "30px" }}
            onClick={handleBookNow}
          >
            Book Your Trip to Karachi
          </Button>
        </div>
      </div>
      
      <Container className="city-content-wrapper">
        <div className="city-intro">
          <p className="city-description">
            Karachi, Pakistan's largest city and economic hub, offers a vibrant blend of history, culture, and coastal charm. Experience the dynamic energy of this bustling metropolis.
          </p>
        </div>

        <h2 className="section-heading">Popular Attractions</h2>
        <Row className="city-places-grid">
          {karachiPlaces.map((place, idx) => (
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

export default Karachi;