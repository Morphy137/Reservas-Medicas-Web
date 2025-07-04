import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

const NavigationBar = () => {
    const location = useLocation();
    
    return (
        <Navbar className="custom-navbar" expand="lg" variant="dark" fixed="top">
            <Container fluid>
                <Navbar.Brand as={Link} to="/" className="brand-modern">
                    <i className="bi bi-heart-pulse me-2"></i>
                    Reserva Médica
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="main-navbar" />
                <Navbar.Collapse id="main-navbar">
                    <Nav className="ms-auto">
                        <Nav.Link 
                            as={Link} 
                            to="/" 
                            className={`nav-link-modern ${location.pathname === '/' ? 'active' : ''}`}
                        >
                            <i className="bi bi-house me-1"></i>
                            Inicio
                        </Nav.Link>
                        <Nav.Link 
                            as={Link} 
                            to="/doctors" 
                            className={`nav-link-modern ${location.pathname === '/doctors' ? 'active' : ''}`}
                        >
                            <i className="bi bi-person-badge me-1"></i>
                            Médicos
                        </Nav.Link>
                        <Nav.Link 
                            as={Link} 
                            to="/book" 
                            className={`nav-link-modern ${location.pathname.includes('/book') ? 'active' : ''}`}
                        >
                            <i className="bi bi-calendar-plus me-1"></i>
                            Reservas
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavigationBar;