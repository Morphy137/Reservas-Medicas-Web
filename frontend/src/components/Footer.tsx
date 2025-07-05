// src/components/Footer.tsx
import { Container } from 'react-bootstrap';

const Footer = () => (
  <footer className="footer-main text-white py-4">
    <Container className="text-center">
      <small>
        © {new Date().getFullYear()} Reserva Médica. Todos los derechos reservados.
      </small>
    </Container>
  </footer>
);

export default Footer;