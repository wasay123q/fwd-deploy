import React from 'react';
import { Container, Card, Carousel, Row, Col } from 'react-bootstrap';
import { FaMountain, FaMosque, FaMapMarkedAlt } from 'react-icons/fa';
import './About.css'; 

function About() {
  // Images from the public folder (directly in /public/)
  const images = [
    "/pakim1.jpg",  // Direct path to image in public folder
    "/pakim2.jpeg",
    "/pakim3.jpg"
  ];

  return (
    <Container className="my-5">
      <Card className="shadow-lg border-0 p-4 fade-in">
        <h2 className="text-center mb-4">About Us</h2>
        
        <Carousel className="mb-4" fade>
          {images.map((img, idx) => (
            <Carousel.Item key={idx} interval={3000}>
              <img
                className="d-block w-100"
                src={img}  // Uses the direct public path
                alt={`slide-${idx}`}
                style={{ height: '400px', objectFit: 'cover', borderRadius: '10px' }}
              />
            </Carousel.Item>
          ))}
        </Carousel>

        <Row className="mb-4 text-center">
          <Col md={4} className="mb-3">
            <FaMountain size={40} className="text-primary mb-2" />
            <h5>Explore</h5>
            <p>Discover breathtaking destinations across Pakistan, from valleys to peaks.</p>
          </Col>
          <Col md={4} className="mb-3">
            <FaMosque size={40} className="text-success mb-2" />
            <h5>Culture</h5>
            <p>Experience the diverse cultural heritage and history of the region.</p>
          </Col>
          <Col md={4} className="mb-3">
            <FaMapMarkedAlt size={40} className="text-warning mb-2" />
            <h5>Plan</h5>
            <p>Plan your journey with ease using our curated travel guides and tools.</p>
          </Col>
        </Row>

        <Card.Body>
          <h4 className="mb-3">Our goal</h4>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.7' }}>
            The Tourist Web App is a digital platform designed to promote tourism in Pakistan by offering a seamless and immersive travel planning experience.
            It enables users to explore top tourist destinations, learn about local culture and heritage, and book their travels—all in one place.
            Our goal is to support local tourism, simplify trip planning, and showcase the natural and cultural richness of Pakistan to both domestic and international travelers.
          </p>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.7' }}>
            Through this project, we aim to empower travel enthusiasts with tools to discover, decide, and depart confidently on their adventures,
            while fostering appreciation for the beauty and diversity of Pakistan.
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default About;