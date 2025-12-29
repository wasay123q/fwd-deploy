import React, { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import AuthContext from "../context/AuthContext";
import "./Navigation.css";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, loading } = useContext(AuthContext);

  const hideNavbarPaths = ["/login", "/signup", "/forgotpassword", "/admin"];
  if (
    hideNavbarPaths.includes(location.pathname) ||
    location.pathname.startsWith("/resetpassword")
  ) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Navbar 
      bg="white" 
      variant="light" 
      expand="lg" 
      className="shadow-sm py-3 sticky-top"
      collapseOnSelect
    >
      <Container>
        <Navbar.Brand as={Link} to="/">
          Tourist Web App
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-content" />

        <Navbar.Collapse id="navbar-content">
          <Nav className="ms-auto align-items-lg-center gap-3">
            <Nav.Link as={Link} to="/" eventKey="1">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/destinations" eventKey="2">
              Destinations
            </Nav.Link>

            {user && (
              <>
                <Nav.Link as={Link} to="/booking" eventKey="3">
                  Booking
                </Nav.Link>
                <Nav.Link as={Link} to="/payment-status" eventKey="4">
                  My Payments
                </Nav.Link>
              </>
            )}

            <div className="d-flex flex-column flex-lg-row gap-2 mt-3 mt-lg-0">
              {loading ? (
                <span className="text-muted">Loading...</span>
              ) : user ? (
                <Button 
                  variant="outline-primary"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              ) : (
                <>
                  <Button 
                    as={Link} 
                    to="/login" 
                    variant="outline-primary"
                    eventKey="6"
                  >
                    Login
                  </Button>
                  <Button 
                    as={Link} 
                    to="/signup" 
                    variant="primary"
                    eventKey="7"
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;