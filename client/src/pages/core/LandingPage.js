import React from "react";
import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./LandingPage.css";

const LandingPage = () => {
  return (
    <div className="landing-page">
      <div className="landing-overlay">
        <Container className="text-center text-white">
          <h1 className="display-2 fw-bold mb-4 fade-in-text">
            Welcome to Tourist Web App
          </h1>
          <p className="lead mb-5 fade-in-text delay-1">
            Discover the beauty of Pakistan. Join us to explore breathtaking
            destinations and plan your perfect trip.
          </p>
          <div className="d-flex justify-content-center gap-3 fade-in-text delay-2">
            <Link to="/login">
              <Button variant="primary" size="lg" className="px-5 rounded-pill">
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button
                variant="outline-light"
                size="lg"
                className="px-5 rounded-pill"
              >
                Sign Up
              </Button>
            </Link>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default LandingPage;
