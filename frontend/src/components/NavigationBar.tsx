import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

const NavigationBar = () => {
    return (
        <Navbar className="custom-navbar" expand="lg" variant="dark" fixed="top">
            <Container fluid>
                <Navbar.Brand as={Link} to="/">Reserva Médica</Navbar.Brand>
                <Navbar.Toggle aria-controls="main-navbar" />
                <Navbar.Collapse id="main-navbar">
                    <Nav className="ms-auto">
                        <Nav.Link as={Link} to="/">Inicio</Nav.Link>
                        <Nav.Link as={Link} to="/doctors">Médicos</Nav.Link>
                        <Nav.Link as={Link} to="/dashboard">Panel Doctor</Nav.Link>
                        <Nav.Link as={Link} to="/book/:doctorId">Reservar</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavigationBar;