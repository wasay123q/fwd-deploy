import React, { useState, useContext } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import AuthModal from '../../components/AuthModal';
import './PlaceDetail.css';

const SaifulPage = () => {
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
      <div className="place-banner" style={{ backgroundImage: "url('/saifulmalookimg.jpg')" }}>
        <div style={{ textAlign: 'center', zIndex: 2 }}>
          <h1>Saiful Malook</h1>
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
          Saiful Malook is a mountainous lake located at the northern end of the Kaghan Valley, near the town of Naran. It is one of the highest lakes in Pakistan and is famous for its fairy tale folklore.
        </p>
        <img src="/saifulmalookimg.jpg" alt="Saiful Malook" className="place-image" />
        
        <div className="map-container">
          <iframe
            title="Saiful Malook Location"
            width="100%"
            height="400"
            frameBorder="0"
            style={{ border: 0 }}
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3306.152335741456!2d73.7086233152146!3d34.05018888060945!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38fd6b6c3e6d4f1f%3A0x8c1c94e792d7a3e0!2sLake%20Saiful%20Malook!5e0!3m2!1sen!2s!4v1628795027167!5m2!1sen!2s"
            allowFullScreen
          >
          </iframe>
        </div>
        
        <section className="info-section">
          <h2>Highlights</h2>
          <ul>
            <li>Crystal Clear Waters</li>
            <li>Malika Parbat View</li>
            <li>Boat Riding</li>
            <li>Snow Covered Peaks</li>
          </ul>
        </section>
      </div>
      <AuthModal show={showAuthModal} handleClose={() => setShowAuthModal(false)} />
    </div>
  );
};

export default SaifulPage;