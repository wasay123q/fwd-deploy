import React from 'react';
import { Container, Card, Form, Button } from 'react-bootstrap';

function ContactUs() {
  return (
    <Container className="my-5">
      <Card className="shadow-lg border-0 p-4">
        <h2 className="text-center mb-4">Contact Us</h2>
        <Form>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Full Name</Form.Label>
            <Form.Control type="text" placeholder="Enter your full name" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter your email" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="message">
            <Form.Label>Message</Form.Label>
            <Form.Control as="textarea" rows={4} placeholder="Your message..." />
          </Form.Group>

          <div className="text-center">
            <Button variant="primary" type="submit">
              Send Message
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
}

export default ContactUs;
