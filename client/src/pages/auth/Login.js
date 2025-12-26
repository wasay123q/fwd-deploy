import React, { useState, useContext, useEffect } from "react";
import { Form, Button, Container, InputGroup } from "react-bootstrap";
import { useNavigate, Link, useLocation } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import "./Auth.css";

// Icons
const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
  </svg>
);

const EyeSlashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
    <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z" />
    <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z" />
    <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z" />
  </svg>
);

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState(""); 
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation(); 

  useEffect(() => {
    if (location.state && location.state.alertMessage) {
      setInfoMessage(location.state.alertMessage);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setInfoMessage("");
    setIsLoading(true);

    try {
      const userData = await login(email, password);
      
      // === UPDATED REDIRECT LOGIC ===
      // Check if we need to redirect to booking
      if (location.state && location.state.redirectTo) {
        navigate(location.state.redirectTo, {
          state: { destination: location.state.destination } // Pass the destination info forward
        });
      } 
      // Default behavior
      else if (userData.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/home");
      }

    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
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
            <h1 className="gradient-text">Welcome Back</h1>
            <p className="text-secondary">Sign in to continue your journey</p>
          </div>

          <Form onSubmit={handleLogin} className="auth-form">
            
            {infoMessage && (
              <div className="alert alert-info slide-in-left text-center" role="alert">
                 <i className="fas fa-info-circle me-2"></i>
                 {infoMessage}
              </div>
            )}

            {error && (
              <div className="alert alert-danger slide-in-left" role="alert">
                {error}
              </div>
            )}

            <Form.Group className="mb-4">
              <Form.Label className="modern-label">Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="modern-input"
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="modern-label">Password</Form.Label>
              <InputGroup className="modern-input-group seamless-group">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="modern-input password-input"
                  required
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle-btn"
                  type="button"
                >
                  {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                </Button>
              </InputGroup>
            </Form.Group>

            <div className="auth-links mb-4">
              <Link to="/forgotpassword" className="auth-link-center">
                Forgot Password?
              </Link>
            </div>

            <div className="d-flex justify-content-center mt-4">
              <Button
                type="submit"
                className="btn-auth-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </div>
          </Form>

          <div className="auth-footer">
            <p className="text-secondary text-center mt-4">
              Don't have an account?{" "}
              <Link to="/signup" className="auth-link-primary">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Login;