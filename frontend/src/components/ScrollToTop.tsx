import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Componente que fuerza el scroll hacia arriba cuando cambia la ruta.
 * Debe ser colocado dentro del Router para tener acceso a useLocation.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Hacer scroll suave hacia arriba cuando cambie la ruta
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [pathname]);

  return null; // Este componente no renderiza nada
}
