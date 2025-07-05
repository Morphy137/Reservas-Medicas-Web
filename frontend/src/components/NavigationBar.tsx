import { Navbar, Nav, Container, Dropdown } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const NavigationBar = () => {
    const location = useLocation();
    const { user, isAuthenticated, logout } = useAuth();
    
    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

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
                        
                        {isAuthenticated && (
                            <>
                                <Nav.Link 
                                    as={Link} 
                                    to="/doctors" 
                                    className={`nav-link-modern ${location.pathname === '/doctors' ? 'active' : ''}`}
                                >
                                    <i className="bi bi-person-badge me-1"></i>
                                    Médicos
                                </Nav.Link>
                                
                                {user?.role !== 'doctor' && (
                                    <Nav.Link 
                                        as={Link} 
                                        to="/book" 
                                        className={`nav-link-modern ${location.pathname.includes('/book') ? 'active' : ''}`}
                                    >
                                        <i className="bi bi-calendar-plus me-1"></i>
                                        Reservas
                                    </Nav.Link>
                                )}
                                
                                {user?.role === 'doctor' && (
                                    <Nav.Link 
                                        as={Link} 
                                        to="/dashboard" 
                                        className={`nav-link-modern ${location.pathname === '/dashboard' ? 'active' : ''}`}
                                    >
                                        <i className="bi bi-speedometer2 me-1"></i>
                                        Dashboard
                                    </Nav.Link>
                                )}
                                
                                {user?.role === 'admin' && (
                                    <Nav.Link 
                                        as={Link} 
                                        to="/admin" 
                                        className={`nav-link-modern ${location.pathname === '/admin' ? 'active' : ''}`}
                                    >
                                        <i className="bi bi-gear me-1"></i>
                                        Administración
                                    </Nav.Link>
                                )}
                            </>
                        )}
                        
                        {isAuthenticated && (
                            <>
                                {/* Barra separadora */}
                                <div className="navbar-divider"></div>
                                
                                <Dropdown align="end">
                                    <Dropdown.Toggle 
                                        as={Nav.Link}
                                        className="nav-link-modern user-dropdown-toggle d-flex align-items-center"
                                        style={{ border: 'none', background: 'none' }}
                                    >
                                        <i className="bi bi-person-circle me-2"></i>
                                        {user?.name || user?.email}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu className="dropdown-menu-dark">
                                        <Dropdown.ItemText>
                                            <small className="text-muted">
                                                {user?.role} - {user?.email}
                                            </small>
                                        </Dropdown.ItemText>
                                        <Dropdown.Divider />
                                        <Dropdown.Item 
                                            as={Link} 
                                            to="/profile"
                                        >
                                            <i className="bi bi-person me-2"></i>
                                            Mi Perfil
                                        </Dropdown.Item>
                                        <Dropdown.Item 
                                            onClick={handleLogout}
                                            className="text-danger"
                                        >
                                            <i className="bi bi-box-arrow-right me-2"></i>
                                            Cerrar Sesión
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </>
                        )}
                        
                        {!isAuthenticated && (
                            <Nav.Link 
                                as={Link} 
                                to="/login" 
                                className={`nav-link-modern ${location.pathname === '/login' ? 'active' : ''}`}
                            >
                                <i className="bi bi-box-arrow-in-right me-1"></i>
                                Iniciar Sesión
                            </Nav.Link>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavigationBar;