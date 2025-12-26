import React, { useState, useContext } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import AuthModal from '../../components/AuthModal';
import './PlaceDetail.css';

const islamabadPlaces = [
  {
    name: "Faisal Mosque",
    description: "The largest mosque in Pakistan, known for its unique contemporary design and stunning location at the foothills of Margalla Hills.",
    image: "/faisal1.jpg"
  },
  {
    name: "Daman-e-Koh",
    description: "A scenic viewpoint that provides panoramic views of Islamabad and is a popular spot for both locals and tourists.",
    image: "/daman1.jpg"
  },
  {
    name: "Pakistan Monument",
    description: "A national monument representing the four provinces and three territories, symbolizing unity and patriotism.",
    image: "/monument1.jpg"
  },
  {
    name: "Rawal Lake",
    description: "A picturesque artificial lake offering boating, picnicking, and a serene environment surrounded by lush greenery.",
    image: "/rawal1.jpg"
  }
];

function Islamabad() {
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
      <div className="city-hero-banner" style={{ backgroundImage: "url('/islamabadimg.jpg')" }}>
        <div className="city-hero-overlay">
          <h1 className="city-hero-title">Islamabad</h1>
          <p className="city-hero-subtitle">The Capital City</p>
          <Button 
            className="mt-4 px-5 py-3 btn-auth-primary" 
            style={{ fontSize: "1.1rem", borderRadius: "30px" }}
            onClick={handleBookNow}
          >
            Book Your Trip to Islamabad
          </Button>
        </div>
      </div>
      
      <Container className="city-content-wrapper">
        <div className="city-intro">
          <p className="city-description">
            Islamabad, the capital of Pakistan, is renowned for its scenic beauty, modern architecture, and serene environment. Experience the perfect blend of nature and urban development.
          </p>
        </div>

        <h2 className="section-heading">Popular Attractions</h2>
        <Row className="city-places-grid">
          {islamabadPlaces.map((place, idx) => (
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

export default Islamabad;