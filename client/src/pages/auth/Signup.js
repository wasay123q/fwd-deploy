import React, { useState, useContext } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import "./Auth.css";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const calculatePasswordStrength = (pass) => {
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) strength++;
    if (/\d/.test(pass)) strength++;
    if (/[^a-zA-Z\d]/.test(pass)) strength++;
    return strength;
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(calculatePasswordStrength(newPassword));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (passwordStrength < 2) {
      setError(
        "Password is too weak. Use a mix of letters, numbers, and symbols."
      );
      return;
    }

    setIsLoading(true);

    try {
      await register(username, email, password);
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength === 0) return "#ef4444";
    if (passwordStrength === 1) return "#f59e0b";
    if (passwordStrength === 2) return "#eab308";
    if (passwordStrength === 3) return "#10b981";
    return "#059669";
  };

  const getStrengthText = () => {
    if (passwordStrength === 0) return "Very Weak";
    if (passwordStrength === 1) return "Weak";
    if (passwordStrength === 2) return "Fair";
    if (passwordStrength === 3) return "Good";
    return "Strong";
  };

  return (
    <div className="auth-container">
      <div className="auth-background"></div>
      <Container className="auth-content">
        <div className="glass-card auth-card fade-in">
          <div className="auth-header">
            <h1 className="gradient-text">Create Account</h1>
            <p className="text-secondary">Start your travel journey today</p>
          </div>

          <Form onSubmit={handleSignup} className="auth-form">
            {error && (
              <div className="alert alert-danger slide-in-left" role="alert">
                {error}
              </div>
            )}

            <Form.Group className="mb-3">
              <Form.Label className="modern-label">Username</Form.Label>
              <Form.Control
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
                className="modern-input"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="modern-label">Email Address</Form.Label>
              <Form.Control
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="modern-input"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="modern-label">Password</Form.Label>
              <Form.Control
                type="password"
                required
                value={password}
                onChange={handlePasswordChange}
                placeholder="Create a strong password"
                className="modern-input"
              />
              {password && (
                <div className="password-strength mt-2">
                  <div className="strength-bar-container">
                    <div
                      className="strength-bar"
                      style={{
                        width: `${(passwordStrength / 4) * 100}%`,
                        backgroundColor: getStrengthColor(),
                      }}
                    ></div>
                  </div>
                  <small style={{ color: getStrengthColor() }}>
                    {getStrengthText()}
                  </small>
                </div>
              )}
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="modern-label">Confirm Password</Form.Label>
              <Form.Control
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="modern-input"
              />
            </Form.Group>

            <Button
              type="submit"
              className="btn-primary w-100 btn-ripple"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </Form>

          <div className="auth-footer">
            <p className="text-secondary text-center mt-4">
              Already have an account?{" "}
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

export default Signup;
