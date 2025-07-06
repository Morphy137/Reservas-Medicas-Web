// src/components/TestimonialSection.tsx
import { Container, Carousel } from 'react-bootstrap';

const testimonials = [
  { name: 'María González', text: 'Muy sencillo reservar y el recordatorio me ayudó un montón.' },
  { name: 'Dr. Pérez', text: 'Me encanta la gestión de mi calendario; ha optimizado mi consulta.' }
];

const TestimonialSection = () => (
  <section className="testimonial-section">
    <Container>
      <h2 className="text-center mb-5">Lo que dicen nuestros usuarios</h2>
      <Carousel indicators={false}>
        {testimonials.map((t, i) => (
          <Carousel.Item key={i}>
            <blockquote className="text-center">
              <p className="mb-4">"{t.text}"</p>
              <footer>— {t.name}</footer>
            </blockquote>
          </Carousel.Item>
        ))}
      </Carousel>
    </Container>
  </section>
);

export default TestimonialSection;