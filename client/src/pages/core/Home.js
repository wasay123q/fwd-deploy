import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  const places = [
    {
      title: "Skardu Valley",
      img: "/skarduimg.jpg",
      route: "/place/SkarduPage",
    },
    {
      title: "Hunza Valley",
      img: "/hunzaimg.jpg",
      route: "/place/HunzaPage",
    },
    {
      title: "Badshahi Mosque",
      img: "/badshahiimg.jpg",
      route: "/place/BadshahiPage",
    },
    {
      title: "Saif-ul-Malook Lake",
      img: "/saifulmalookimg.jpg",
      route: "/place/SaifulPage",
    },
  ];

  return (
    <>
      <div className="hero-section">
        <div className="overlay">
          <div className="hero-content text-center">
            <h1 className="fade-in-text display-3 fw-bold mb-4">
              Explore the Beauty of Pakistan
            </h1>
            <p className="lead text-white mb-4">
              Discover mountains, valleys, and historic cities.
            </p>
            <button
              className="btn btn-primary btn-lg hero-btn"
              onClick={() => navigate("/destinations")}
            >
              Start Your Journey
            </button>
          </div>
        </div>
      </div>

      <Container className="my-5">
        <h2 className="text-center mb-5 section-title">Popular Destinations</h2>
        <Row>
          {places.map((place, idx) => (
            <Col md={6} lg={3} key={idx} className="mb-4">
              <Card
                className="shadow-sm h-100 card-hover border-0"
                onClick={() => navigate(place.route)}
                style={{ cursor: "pointer" }}
              >
                <div className="card-img-wrapper">
                  <Card.Img
                    variant="top"
                    src={place.img}
                    alt={place.title}
                    className="card-img-custom"
                  />
                </div>
                <Card.Body>
                  <Card.Title className="text-center fw-bold">
                    {place.title}
                  </Card.Title>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
}

export default Home;
