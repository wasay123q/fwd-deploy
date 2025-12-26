import React from "react";
import { Modal, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../pages/auth/Auth.css"; // Reuse your Auth styles

const AuthModal = ({ show, handleClose }) => {
  return (
    <Modal show={show} onHide={handleClose} centered className="auth-modal">
      <div className="auth-background" style={{ position: "absolute", zIndex: -1, borderRadius: "0.5rem" }}></div>
      <Modal.Body className="p-4 text-center" style={{ background: "rgba(255, 255, 255, 0.95)", borderRadius: "10px" }}>
        <h2 className="gradient-text mb-3">Join Us!</h2>
        <p className="text-secondary mb-4">
          You need to be logged in to book a trip to this beautiful destination.
        </p>

        <div className="d-grid gap-3">
          <Link to="/login" onClick={handleClose} style={{ textDecoration: 'none' }}>
            <Button className="btn-auth-primary w-100">
              Log In to Continue
            </Button>
          </Link>
          
          <div className="d-flex align-items-center justify-content-center">
            <span className="text-muted small">Don't have an account?</span>
            <Link to="/signup" onClick={handleClose} className="auth-link-primary ms-2">
              Sign Up
            </Link>
          </div>
        </div>
        
        <Button variant="link" onClick={handleClose} className="mt-3 text-secondary text-decoration-none small">
          Continue Browsing
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default AuthModal;