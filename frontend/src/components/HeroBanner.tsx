// src/components/HeroBanner.tsx
import React from 'react';
import { Container, Button } from 'react-bootstrap';

const HeroBanner = () => {
  const handleScroll = () => {
    const nextSection = document.getElementById('feature-section');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero-banner">
      <Container className="text-center">
        <h1 style={{ fontFamily: 'var(--font-head)', fontSize: '3rem' }}>
          Reserva tu cita médica en un clic
        </h1>
        <p className="lead" style={{ maxWidth: '600px', margin: '1.5rem auto' }}>
          Conecta con profesionales de la salud de manera rápida, segura y confiable.
        </p>
        <Button className="btn" as="a" href="/doctors" size="lg">
          Ver Médicos Disponibles
        </Button>
      </Container>
      <button
        className="scroll-down-arrow"
        onClick={handleScroll}
        aria-label="Bajar a la siguiente sección"
      >
        ↓
      </button>
    </section>
  );
};

export default HeroBanner;