import React, { useState, useContext } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import AuthModal from '../../components/AuthModal';
import './PlaceDetail.css';

const HunzaPage = () => {
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
    <div className="place-page">
      <div className="place-banner" style={{ backgroundImage: "url('/hunzaimg.jpg')" }}>
        <div style={{ textAlign: 'center', zIndex: 2 }}>
          <h1>Hunza Valley</h1>
          <Button 
            className="mt-3 px-4 py-2 btn-auth-primary"
            onClick={handleBookNow}
          >
            Book This Trip
          </Button>
        </div>
      </div>
      <div className="place-content">
        <p>
          Hunza is a mountainous valley in the Gilgit-Baltistan region of Pakistan. Known for its breathtaking scenery, rich culture, and longevity of its people, Hunza is often referred to as heaven on earth.
        </p>
        <img src="/hunzaimg.jpg" alt="Hunza" className="place-image" />
        <div className="map-container">
          <h2>Location</h2>
          <iframe
            title="Hunza Valley Location"
            width="100%"
            height="400"
            frameBorder="0"
            style={{ border: 0 }}
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d18000!2d74.6500!3d36.3167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38afeb9d8c5c5c5d%3A0x1234567890abcdef!2sHunza%20Valley!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
            allowFullScreen
          >
          </iframe>
        </div>  
        <section className="info-section">
          <h2>Highlights</h2>
          <ul>
            <li>Karimabad</li>
            <li>Altit and Baltit Forts</li>
            <li>Attabad Lake</li>
            <li>Passu Cones</li>
          </ul>
        </section>
      </div>
      <AuthModal show={showAuthModal} handleClose={() => setShowAuthModal(false)} />
    </div>
  );
};

export default HunzaPage;