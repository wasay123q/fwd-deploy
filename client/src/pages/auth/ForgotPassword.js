import React, { useState, useContext } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import "./Login.css"; // We can reuse the login styles

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { forgotPassword } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      await forgotPassword(email);
      setMessage("Check your email for a password reset link.");
    } catch (err) {
      setError(err.response?.data?.message || "Could not send reset email.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-background"></div>
      <Container className="auth-content">
        <div className="glass-card auth-card fade-in">
          <div className="auth-header">
            <h1 className="gradient-text">Forgot Password?</h1>
            <p className="text-secondary">
              Enter your email to reset your password
            </p>
          </div>

          <Form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="alert alert-danger slide-in-left">{error}</div>}
            {message && <div className="alert alert-success slide-in-left">{message}</div>}

            <Form.Group className="mb-4">
              <Form.Label className="modern-label">Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="modern-input"
                required
              />
            </Form.Group>

            <div className="d-flex justify-content-center mt-4">
              <Button
                type="submit"
                className="btn-auth-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </div>
          </Form>

          <div className="auth-footer">
            <p className="text-secondary text-center mt-4">
              Remembered your password?{" "}
              <Link to="/login" className="auth-link-primary">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default ForgotPassword;