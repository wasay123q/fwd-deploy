import React, { useState, useContext } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import AuthModal from '../../components/AuthModal';
import './PlaceDetail.css';

const SkarduPage = () => {
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
      <div className="place-banner" style={{ backgroundImage: "url('/skarduimg.jpg')" }}>
        <div style={{ textAlign: 'center', zIndex: 2 }}>
          <h1>Skardu Valley</h1>
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
          Skardu is a stunning valley in Gilgit-Baltistan, Pakistan. It serves as the gateway to some of the world’s highest peaks including K2. Known for its crystal-clear lakes, ancient forts, and majestic mountains, it offers unmatched natural beauty and adventure.
        </p>

        <img src="/skarduimg.jpg" alt="Skardu" className="place-image" />

        <div className="map-container">
          <h2>Location</h2>
          <iframe
            title="Skardu Valley Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1747159.4145149746!2d74.20000682367205!3d35.32728093382786!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38e602c07ae2b53f%3A0xe498f9dc94337b58!2sSkardu!5e0!3m2!1sen!2s!4v1628795027167!5m2!1sen!2s"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>

        <section className="info-section">
          <h2>Highlights</h2>
          <ul>
            <li>Shangrila Resort</li>
            <li>Upper Kachura Lake</li>
            <li>Skardu Fort</li>
            <li>Deosai National Park</li>
          </ul>
        </section>
      </div>
      <AuthModal show={showAuthModal} handleClose={() => setShowAuthModal(false)} />
    </div>
  );
};

export default SkarduPage;