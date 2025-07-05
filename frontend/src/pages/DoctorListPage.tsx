// src/pages/DoctorListPage.tsx
import { useState, useMemo } from 'react';
import { Container, Row, Col, Card, Button, Modal, Badge, Alert, Form, InputGroup, Toast, ToastContainer } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  experience: string;
  rating: number;
  image: string;
  availableDays: string[];
}

interface TimeSlot {
  time: string;
  available: boolean;
  patientName?: string;
}

// Datos de ejemplo de doctores (fuera del componente para evitar re-renders)
const doctorsData: Doctor[] = [
  {
    id: 1,
    name: "Dr. María González",
    specialty: "Cardiología",
    experience: "10 años de experiencia",
    rating: 4.8,
    image: "https://placehold.co/300x250/FF6B6B/FFFFFF?text=❤️+Cardiología",
    availableDays: ["2025-07-07", "2025-07-08", "2025-07-09"]
  },
  {
    id: 2,
    name: "Dr. Carlos Rodríguez",
    specialty: "Neurología",
    experience: "15 años de experiencia",
    rating: 4.9,
    image: "https://placehold.co/300x250/4ECDC4/FFFFFF?text=🧠+Neurología",
    availableDays: ["2025-07-07", "2025-07-10", "2025-07-11"]
  },
  {
    id: 3,
    name: "Dra. Ana Martínez",
    specialty: "Pediatría",
    experience: "8 años de experiencia",
    rating: 4.7,
    image: "https://placehold.co/300x250/FFD93D/FFFFFF?text=🧸+Pediatría",
    availableDays: ["2025-07-08", "2025-07-09", "2025-07-12"]
  },
  {
    id: 4,
    name: "Dr. Luis Fernández",
    specialty: "Dermatología",
    experience: "12 años de experiencia",
    rating: 4.6,
    image: "https://placehold.co/300x250/A8E6CF/FFFFFF?text=✨+Dermatología",
    availableDays: ["2025-07-07", "2025-07-09", "2025-07-11"]
  },
  {
    id: 5,
    name: "Dra. Carmen Silva",
    specialty: "Ginecología",
    experience: "18 años de experiencia",
    rating: 4.9,
    image: "https://placehold.co/300x250/FF8B94/FFFFFF?text=🌸+Ginecología",
    availableDays: ["2025-07-08", "2025-07-10", "2025-07-12"]
  },
  {
    id: 6,
    name: "Dr. Roberto Mendoza",
    specialty: "Traumatología",
    experience: "14 años de experiencia",
    rating: 4.5,
    image: "https://placehold.co/300x250/6C5CE7/FFFFFF?text=🦴+Traumatología",
    availableDays: ["2025-07-07", "2025-07-08", "2025-07-10"]
  },
  {
    id: 7,
    name: "Dra. Patricia López",
    specialty: "Oftalmología",
    experience: "9 años de experiencia",
    rating: 4.7,
    image: "https://placehold.co/300x250/74B9FF/FFFFFF?text=�️+Oftalmología",
    availableDays: ["2025-07-09", "2025-07-11", "2025-07-12"]
  },
  {
    id: 8,
    name: "Dr. Miguel Torres",
    specialty: "Psiquiatría",
    experience: "20 años de experiencia",
    rating: 4.8,
    image: "https://placehold.co/300x250/A29BFE/FFFFFF?text=🧘+Psiquiatría",
    availableDays: ["2025-07-07", "2025-07-10", "2025-07-11"]
  },
  {
    id: 9,
    name: "Dra. Elena Vargas",
    specialty: "Endocrinología",
    experience: "11 años de experiencia",
    rating: 4.6,
    image: "https://placehold.co/300x250/FD79A8/FFFFFF?text=⚖️+Endocrinología",
    availableDays: ["2025-07-08", "2025-07-09", "2025-07-12"]
  },
  {
    id: 10,
    name: "Dr. Fernando Castro",
    specialty: "Urología",
    experience: "16 años de experiencia",
    rating: 4.7,
    image: "https://placehold.co/300x250/00CEC9/FFFFFF?text=�+Urología",
    availableDays: ["2025-07-07", "2025-07-09", "2025-07-10"]
  },
  {
    id: 11,
    name: "Dra. Sofía Herrera",
    specialty: "Cardiología",
    experience: "13 años de experiencia",
    rating: 4.8,
    image: "https://placehold.co/300x250/E17055/FFFFFF?text=�+Cardiología",
    availableDays: ["2025-07-08", "2025-07-11", "2025-07-12"]
  },
  {
    id: 12,
    name: "Dr. Andrés Morales",
    specialty: "Gastroenterología",
    experience: "7 años de experiencia",
    rating: 4.4,
    image: "https://placehold.co/300x250/55A3FF/FFFFFF?text=🫃+Gastroenterología",
    availableDays: ["2025-07-07", "2025-07-08", "2025-07-09"]
  }
];

const DoctorListPage = () => {
  const { user } = useAuth();
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  
  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedDay, setSelectedDay] = useState('');

  // Estados para notificaciones
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  // Obtener especialidades únicas
  const specialties = [...new Set(doctorsData.map(doctor => doctor.specialty))].sort();
  
  // Obtener días únicos de la semana
  const weekDays = [
    { value: '1', label: 'Lunes' },
    { value: '2', label: 'Martes' },
    { value: '3', label: 'Miércoles' },
    { value: '4', label: 'Jueves' },
    { value: '5', label: 'Viernes' },
    { value: '6', label: 'Sábado' },
    { value: '0', label: 'Domingo' }
  ];

  // Filtrar doctores
  const filteredDoctors = useMemo(() => {
    return doctorsData.filter(doctor => {
      // Filtro por nombre
      const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filtro por especialidad
      const matchesSpecialty = selectedSpecialty === '' || doctor.specialty === selectedSpecialty;
      
      // Filtro por día de la semana
      const matchesDay = selectedDay === '' || 
                        doctor.availableDays.some(date => 
                          new Date(date).getDay().toString() === selectedDay
                        );
      
      return matchesSearch && matchesSpecialty && matchesDay;
    });
  }, [searchTerm, selectedSpecialty, selectedDay]);

  // Limpiar filtros
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSpecialty('');
    setSelectedDay('');
  };

  // Horarios fijos para cada doctor
  const getTimeSlots = (doctorId: number): TimeSlot[] => {
    const baseSlots = [
      "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
      "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
    ];

    // Horarios ocupados predefinidos para cada doctor
    const occupiedSlots: { [key: number]: string[] } = {
      1: ["09:30", "11:00", "15:00"], // Dr. María González
      2: ["10:00", "14:30", "16:00"], // Dr. Carlos Rodríguez
      3: ["09:00", "10:30", "15:30"], // Dra. Ana Martínez
      4: ["11:30", "14:00", "16:30"], // Dr. Luis Fernández
      5: ["09:30", "15:00", "17:00"], // Dra. Carmen Silva
      6: ["10:00", "11:00", "14:30"], // Dr. Roberto Mendoza
      7: ["09:00", "15:30", "16:00"], // Dra. Patricia López
      8: ["10:30", "14:00", "16:30"], // Dr. Miguel Torres
      9: ["09:30", "11:30", "15:00"], // Dra. Elena Vargas
      10: ["10:00", "14:30", "17:00"], // Dr. Fernando Castro
      11: ["09:00", "11:00", "16:00"], // Dra. Sofía Herrera
      12: ["10:30", "15:30", "16:30"]  // Dr. Andrés Morales
    };

    const doctorOccupiedSlots = occupiedSlots[doctorId] || [];

    return baseSlots.map(time => {
      const isOccupied = doctorOccupiedSlots.includes(time);
      return {
        time,
        available: !isOccupied,
        patientName: isOccupied ? "Paciente Reservado" : undefined
      };
    });
  };

  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setSelectedDate(doctor.availableDays[0]); // Selecciona el primer día disponible
    setShowModal(true);
  };

  const handleBookAppointment = (time: string) => {
    if (!selectedDoctor || !user) {
      setToastMessage('Error: Usuario no autenticado');
      setToastType('error');
      setShowToast(true);
      return;
    }

    try {
      // Verificar si el usuario ya tiene una cita a la misma hora y fecha
      const existingAppointments = JSON.parse(localStorage.getItem('patientAppointments') || '[]');
      const conflictingAppointment = existingAppointments.find((apt: {
        patientEmail: string;
        date: string;
        time: string;
        status: string;
      }) => 
        apt.patientEmail === user.email && 
        apt.date === selectedDate && 
        apt.time === time &&
        apt.status !== 'cancelled' // Solo considerar citas no canceladas
      );

      if (conflictingAppointment) {
        setToastMessage(
          `Ya tienes una cita reservada para el ${new Date(selectedDate).toLocaleDateString('es-ES')} a las ${time}.\n\nNo puedes tener más de una cita en el mismo horario.`
        );
        setToastType('error');
        setShowToast(true);
        return;
      }

      // Crear objeto de reserva
      const newAppointment = {
        id: Date.now(), // ID temporal único
        doctorName: selectedDoctor.name,
        doctorSpecialty: selectedDoctor.specialty,
        patientName: user.name,
        patientEmail: user.email,
        date: selectedDate,
        time: time,
        status: 'pending', // Nueva reserva queda pendiente de confirmación
        type: 'Consulta General',
        createdAt: new Date().toISOString()
      };

      // Guardar en localStorage (simulando base de datos)
      existingAppointments.push(newAppointment);
      localStorage.setItem('patientAppointments', JSON.stringify(existingAppointments));

      // Mostrar notificación de éxito
      setToastMessage(
        `¡Reserva confirmada! \nCita con ${selectedDoctor.name} \nel ${new Date(selectedDate).toLocaleDateString('es-ES', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })} a las ${time}. \n\nEstado: Pendiente de confirmación por el doctor.`
      );
      setToastType('success');
      setShowToast(true);
      
      setShowModal(false);
    } catch {
      setToastMessage('Error al procesar la reserva. Inténtalo de nuevo.');
      setToastType('error');
      setShowToast(true);
    }
  };

  const renderStars = (rating: number) => {
    return "★".repeat(Math.floor(rating)) + "☆".repeat(5 - Math.floor(rating));
  };

  return (
    <Container className="py-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-primary">Nuestros Especialistas</h1>
        <p className="lead text-muted">Encuentra al profesional médico ideal para tu consulta</p>
      </div>

      {/* Panel de Filtros */}
      <Card className="mb-4 shadow-sm border-0">
        <Card.Header className="bg-light">
          <div className="d-flex justify-content-between align-items-center">
            <h6 className="mb-0 fw-bold text-secondary">
              <i className="bi bi-funnel me-2"></i>Filtros de Búsqueda
            </h6>
            <Button 
              variant="outline-secondary" 
              size="sm" 
              onClick={clearFilters}
              className="rounded-pill"
            >
              <i className="bi bi-arrow-clockwise me-1"></i>Limpiar
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          <Row className="g-3">
            {/* Búsqueda por nombre */}
            <Col md={6} lg={4}>
              <Form.Label className="small fw-semibold text-muted">Buscar por nombre</Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <i className="bi bi-search"></i>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Nombre del doctor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>

            {/* Filtro por especialidad */}
            <Col md={6} lg={4}>
              <Form.Label className="small fw-semibold text-muted">Especialidad</Form.Label>
              <Form.Select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
              >
                <option value="">Todas las especialidades</option>
                {specialties.map(specialty => (
                  <option key={specialty} value={specialty}>{specialty}</option>
                ))}
              </Form.Select>
            </Col>

            {/* Filtro por día */}
            <Col md={6} lg={4}>
              <Form.Label className="small fw-semibold text-muted">Día disponible</Form.Label>
              <Form.Select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
              >
                <option value="">Cualquier día</option>
                {weekDays.map(day => (
                  <option key={day.value} value={day.value}>{day.label}</option>
                ))}
              </Form.Select>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Resultados */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="text-muted mb-0">
          Mostrando {filteredDoctors.length} de {doctorsData.length} especialistas
        </h5>
        {filteredDoctors.length === 0 && (
          <Badge bg="warning" className="rounded-pill">
            No se encontraron resultados
          </Badge>
        )}
      </div>

      <Row className="g-4">
        {filteredDoctors.map((doctor) => (
          <Col key={doctor.id} lg={6} xl={4}>
            <Card className="h-100 shadow-sm border-0 doctor-card" style={{ transition: 'transform 0.2s' }}>
              <div className="position-relative">
                <Card.Img 
                  variant="top" 
                  src={doctor.image} 
                  style={{ 
                    height: '250px', 
                    objectFit: 'cover',
                    backgroundColor: '#f8f9fa'
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x250/95A5A6/FFFFFF?text=👨‍⚕️+Doctor';
                  }}
                  loading="lazy"
                />
                <Badge 
                  bg="primary" 
                  className="position-absolute top-0 end-0 m-3"
                  style={{ fontSize: '0.8rem' }}
                >
                  {doctor.rating} {renderStars(doctor.rating)}
                </Badge>
              </div>
              
              <Card.Body className="d-flex flex-column">
                <Card.Title className="text-primary fw-bold">{doctor.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-success fw-semibold">
                  {doctor.specialty}
                </Card.Subtitle>
                <Card.Text className="text-muted mb-3 flex-grow-1">
                  {doctor.experience}
                </Card.Text>
                
                <div className="mb-3">
                  <small className="text-muted d-block mb-1">Próximas fechas disponibles:</small>
                  <div className="d-flex flex-wrap gap-1">
                    {doctor.availableDays.slice(0, 3).map((day, index) => (
                      <Badge key={index} bg="outline-secondary" text="dark" className="border">
                        {new Date(day).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Button 
                  variant="primary" 
                  className="w-100 fw-semibold"
                  onClick={() => handleDoctorSelect(doctor)}
                >
                  Ver Horarios Disponibles
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Mensaje cuando no hay resultados */}
      {filteredDoctors.length === 0 && (
        <div className="text-center py-5">
          <div className="mb-4">
            <i className="bi bi-search display-1 text-muted"></i>
          </div>
          <h4 className="text-muted mb-3">No se encontraron especialistas</h4>
          <p className="text-muted mb-4">
            Intenta ajustar los filtros o buscar con términos diferentes
          </p>
          <Button variant="primary" onClick={clearFilters} className="rounded-pill">
            <i className="bi bi-arrow-clockwise me-2"></i>Limpiar todos los filtros
          </Button>
        </div>
      )}

      {/* Modal para mostrar horarios */}
      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)} 
        size="lg" 
        centered
        backdrop="static"
      >
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>
            <div className="d-flex align-items-center">
              <div>
                <h5 className="mb-0">{selectedDoctor?.name}</h5>
                <small className="opacity-75">{selectedDoctor?.specialty}</small>
              </div>
            </div>
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body className="p-4">
          {selectedDoctor && (
            <>
              {/* Selector de fecha */}
              <div className="mb-4">
                <h6 className="fw-bold text-secondary mb-3">Selecciona una fecha:</h6>
                <div className="d-flex gap-2 flex-wrap">
                  {selectedDoctor.availableDays.map((day) => (
                    <Button
                      key={day}
                      variant={selectedDate === day ? "primary" : "outline-primary"}
                      size="sm"
                      onClick={() => setSelectedDate(day)}
                      className="rounded-pill"
                    >
                      {new Date(day).toLocaleDateString('es-ES', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Horarios disponibles */}
              {selectedDate && (
                <div>
                  <h6 className="fw-bold text-secondary mb-3">
                    Horarios para {new Date(selectedDate).toLocaleDateString('es-ES', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}:
                  </h6>
                  
                  <Alert variant="info" className="small mb-3">
                    <i className="bi bi-info-circle me-2"></i>
                    Los horarios en gris ya están reservados por otros pacientes
                  </Alert>

                  <Row className="g-2">
                    {getTimeSlots(selectedDoctor.id).map((slot, index) => (
                      <Col xs={6} md={4} key={index}>
                        <Button
                          variant={slot.available ? "outline-success" : "outline-secondary"}
                          className={`w-100 time-slot ${!slot.available ? 'text-decoration-line-through' : ''}`}
                          disabled={!slot.available}
                          onClick={() => slot.available && handleBookAppointment(slot.time)}
                          style={{ 
                            position: 'relative',
                            opacity: slot.available ? 1 : 0.6
                          }}
                        >
                          <div className="d-flex flex-column align-items-center">
                            <span className="fw-bold">{slot.time}</span>
                            {!slot.available && (
                              <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                                Ocupado
                              </small>
                            )}
                          </div>
                        </Button>
                      </Col>
                    ))}
                  </Row>
                </div>
              )}
            </>
          )}
        </Modal.Body>
        
        <Modal.Footer className="border-0 pt-0">
          <Button variant="outline-secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      <style>
        {`
          .doctor-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
          }
          
          .time-slot:hover:not(:disabled) {
            transform: scale(1.05);
            transition: transform 0.1s ease;
          }
          
          .time-slot:disabled {
            cursor: not-allowed;
          }
        `}
      </style>

      {/* Toast para notificaciones */}
      <ToastContainer 
        position="top-end" 
        className="p-3 toast-container" 
        style={{ 
          zIndex: 1070,
          position: 'fixed',
          top: '80px',
          right: '20px'
        }}
      >
        <Toast 
          show={showToast} 
          onClose={() => setShowToast(false)} 
          delay={6000}
          autohide
          bg={toastType === 'success' ? 'success' : 'danger'}
          className="text-white"
        >
          <Toast.Header>
            <strong className="me-auto">
              {toastType === 'success' ? '✅ Reserva Exitosa' : '❌ Error'}
            </strong>
          </Toast.Header>
          <Toast.Body style={{ whiteSpace: 'pre-line' }}>
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default DoctorListPage;