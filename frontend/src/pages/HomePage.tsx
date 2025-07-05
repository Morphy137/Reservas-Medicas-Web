// src/pages/HomePage.tsx
import HeroBanner from '../components/HeroBanner';
import FeatureSection from '../components/FeatureSection';
import TestimonialSection from '../components/TestimonialSection';
import Footer from '../components/Footer';

const HomePage = () => (
  <div>
    <HeroBanner />
    <section className="features-testimonials-section">
      <div className="features-testimonials-inner">
        <FeatureSection />
        <TestimonialSection />
      </div>
    </section>
    <Footer />
  </div>
);

export default HomePage;
