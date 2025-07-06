// src/pages/BookingPage.tsx
import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Alert, Modal, Form, Toast, ToastContainer } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaUserMd, FaEdit, FaTimes, FaCheckCircle, FaExclamationTriangle, FaBell, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';

interface PatientAppointment {
  id: number;
  doctorName: string;
  doctorSpecialty: string;
  patientName: string;
  patientEmail: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  type: string;
  createdAt: string;
}

// Función para validar si un paciente puede cancelar una cita
const canPatientCancelAppointment = (status: string): { allowed: boolean, reason?: string } => {
  // Regla: Una vez confirmada, el paciente no puede cancelarla
  if (status === 'confirmed') {
    return { 
      allowed: false, 
      reason: 'No puedes cancelar una cita ya confirmada. Si no puedes asistir, contacta directamente al médico o centro médico.' 
    };
  }
  
  // Regla: Una cita ya cancelada no se puede volver a cancelar
  if (status === 'cancelled') {
    return { 
      allowed: false, 
      reason: 'Esta cita ya está cancelada.' 
    };
  }

  // Solo se puede cancelar si está pendiente
  return { allowed: true };
};

// Función para validar si un paciente puede reagendar una cita
const canPatientRescheduleAppointment = (status: string): { allowed: boolean, reason?: string } => {
  // Regla: Una vez confirmada, el paciente no puede reagendarla
  if (status === 'confirmed') {
    return { 
      allowed: false, 
      reason: 'No puedes reagendar una cita ya confirmada. Si necesitas cambiar la fecha, contacta directamente al médico o centro médico.' 
    };
  }
  
  // Regla: Una cita cancelada no se puede reagendar
  if (status === 'cancelled') {
    return { 
      allowed: false, 
      reason: 'Una cita cancelada no puede ser reagendada. Debes crear una nueva reserva.' 
    };
  }

  // Solo se puede reagendar si está pendiente
  return { allowed: true };
};

const BookingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<PatientAppointment[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<PatientAppointment | null>(null);
  const [modalAction, setModalAction] = useState<'cancel' | 'reschedule'>('cancel');
  const [newDateTime, setNewDateTime] = useState({ date: '', time: '' });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');
  const [showHelpCard, setShowHelpCard] = useState(true);

  // Función para mostrar notificaciones
  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  // Cargar reservas del localStorage
  useEffect(() => {
    const loadPatientAppointments = () => {
      try {
        const storedAppointments = JSON.parse(localStorage.getItem('patientAppointments') || '[]');
        // Filtrar solo las reservas del usuario actual
        const userAppointments = storedAppointments.filter(
          (apt: PatientAppointment) => apt.patientEmail === user?.email
        );
        setAppointments(userAppointments);
      } catch (error) {
        console.error('Error loading appointments:', error);
        setAppointments([]);
      }
    };

    if (user) {
      loadPatientAppointments();
    }
  }, [user]);

  const loadPatientAppointments = () => {
    try {
      const storedAppointments = JSON.parse(localStorage.getItem('patientAppointments') || '[]');
      // Filtrar solo las reservas del usuario actual
      const userAppointments = storedAppointments.filter(
        (apt: PatientAppointment) => apt.patientEmail === user?.email
      );
      setAppointments(userAppointments);
    } catch (error) {
      console.error('Error loading appointments:', error);
      setAppointments([]);
    }
  };

  // Obtener badge de estado
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge bg="success"><FaCheckCircle className="me-1" />Confirmada</Badge>;
      case 'pending':
        return <Badge bg="warning" text="dark"><FaExclamationTriangle className="me-1" />Pendiente</Badge>;
      case 'cancelled':
        return <Badge bg="danger"><FaTimes className="me-1" />Cancelada</Badge>;
      default:
        return <Badge bg="secondary">Desconocido</Badge>;
    }
  };

  // Manejar cancelación
  const handleCancel = (appointment: PatientAppointment) => {
    const validation = canPatientCancelAppointment(appointment.status);
    if (!validation.allowed) {
      showNotification(validation.reason || 'No se puede cancelar esta cita', 'error');
      return;
    }
    setSelectedAppointment(appointment);
    setModalAction('cancel');
    setShowModal(true);
  };

  // Manejar reagendamiento
  const handleReschedule = (appointment: PatientAppointment) => {
    const validation = canPatientRescheduleAppointment(appointment.status);
    if (!validation.allowed) {
      showNotification(validation.reason || 'No se puede reagendar esta cita', 'error');
      return;
    }
    setSelectedAppointment(appointment);
    setModalAction('reschedule');
    setNewDateTime({ date: appointment.date, time: appointment.time });
    setShowModal(true);
  };

  // Confirmar acción del modal
  const confirmAction = () => {
    if (!selectedAppointment) return;

    const storedAppointments = JSON.parse(localStorage.getItem('patientAppointments') || '[]');
    
    if (modalAction === 'cancel') {
      // Validar antes de cancelar
      const validation = canPatientCancelAppointment(selectedAppointment.status);
      if (!validation.allowed) {
        showNotification(validation.reason || 'No se puede cancelar esta cita', 'error');
        return;
      }
      
      // Cancelar cita
      const updatedAppointments = storedAppointments.map((apt: PatientAppointment) => 
        apt.id === selectedAppointment.id 
          ? { ...apt, status: 'cancelled' as const }
          : apt
      );
      localStorage.setItem('patientAppointments', JSON.stringify(updatedAppointments));
      showNotification('Cita cancelada exitosamente', 'info');
      
    } else if (modalAction === 'reschedule') {
      // Validar antes de reagendar
      const validation = canPatientRescheduleAppointment(selectedAppointment.status);
      if (!validation.allowed) {
        showNotification(validation.reason || 'No se puede reagendar esta cita', 'error');
        return;
      }
      
      // Verificar si ya hay una cita en el nuevo horario (excluyendo la cita actual)
      const conflictingAppointment = storedAppointments.find((apt: PatientAppointment) => 
        apt.patientEmail === user?.email && 
        apt.date === newDateTime.date && 
        apt.time === newDateTime.time &&
        apt.status !== 'cancelled' &&
        apt.id !== selectedAppointment.id // Excluir la cita actual
      );

      if (conflictingAppointment) {
        showNotification(`Ya tienes una cita reservada para el ${new Date(newDateTime.date).toLocaleDateString('es-ES')} a las ${newDateTime.time}. No puedes tener más de una cita en el mismo horario.`, 'error');
        return;
      }

      // Reagendar cita
      const updatedAppointments = storedAppointments.map((apt: PatientAppointment) => 
        apt.id === selectedAppointment.id 
          ? { ...apt, date: newDateTime.date, time: newDateTime.time, status: 'pending' as const }
          : apt
      );
      localStorage.setItem('patientAppointments', JSON.stringify(updatedAppointments));
      showNotification('Cita reagendada exitosamente. Pendiente de confirmación por el doctor.', 'success');
    }

    loadPatientAppointments(); // Recargar las citas
    setShowModal(false);
    setSelectedAppointment(null);
  };

  // Separar citas por estado
  const upcomingAppointments = appointments.filter(apt => 
    apt.status !== 'cancelled' && new Date(`${apt.date} ${apt.time}`) >= new Date()
  );
  const pastAppointments = appointments.filter(apt => 
    new Date(`${apt.date} ${apt.time}`) < new Date()
  );
  const cancelledAppointments = appointments.filter(apt => apt.status === 'cancelled');

  if (!user) {
    return (
      <div style={{ 
        background: 'linear-gradient(135deg, #415a77 0%, #778da9 50%, #e0e1dd 100%)',
        minHeight: '100vh',
        paddingTop: '80px',
        width: '100vw',
        margin: '0',
        padding: '0',
        position: 'relative',
        left: '50%',
        right: '50%',
        marginLeft: '-50vw',
        marginRight: '-50vw'
      }}>
        <Container className="py-5">
          <Alert variant="warning">
            <FaExclamationTriangle className="me-2" />
            Debes iniciar sesión para ver tus reservas.
          </Alert>
        </Container>
      </div>
    );
  }

  return (
    <div 
      style={{ 
        background: 'linear-gradient(135deg, #415a77 0%, #778da9 50%, #e0e1dd 100%)',
        minHeight: '100vh',
        paddingTop: '80px',
        width: '100vw',
        margin: '0',
        padding: '0',
        position: 'relative',
        left: '50%',
        right: '50%',
        marginLeft: '-50vw',
        marginRight: '-50vw'
      }}
    >
      <Container fluid className="px-3 py-4">
        <div className="text-center mb-4">
          <h1 className="display-4 fw-bold text-white mb-3">
            <FaCalendarAlt className="me-3" />
            Mis Reservas Médicas
          </h1>
          <p className="lead text-white opacity-75">
            Gestiona tus citas médicas de forma fácil y rápida
          </p>
        </div>

        <Row className="g-4">
          {/* Contenido principal */}
          <Col lg={9}>
            {/* Próximas Citas */}
            {upcomingAppointments.length > 0 && (
              <div className="mb-4">
                <h3 className="text-white mb-3">
                  <FaCalendarAlt className="me-2" />
                  Próximas Citas
                </h3>
                <Row className="g-3">
                  {upcomingAppointments.map((appointment) => (
                    <Col key={appointment.id} xl={6} lg={12} md={6}>
                      <Card className="h-100 border-0 shadow-sm appointment-card">
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <div>
                              <h5 className="text-primary fw-bold mb-1">
                                <FaUserMd className="me-2" />
                                {appointment.doctorName}
                              </h5>
                              <p className="text-muted mb-2">{appointment.doctorSpecialty}</p>
                            </div>
                            {getStatusBadge(appointment.status)}
                          </div>
                          
                          <div className="appointment-details mb-3">
                            <p className="mb-1">
                              <FaCalendarAlt className="me-2 text-primary" />
                              <strong>Fecha:</strong> {new Date(appointment.date).toLocaleDateString('es-ES', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </p>
                            <p className="mb-1">
                              <FaClock className="me-2 text-primary" />
                              <strong>Hora:</strong> {appointment.time}
                            </p>
                            <Badge bg="light" text="dark" className="px-2 py-1">
                              {appointment.type}
                            </Badge>
                          </div>

                          {appointment.status !== 'cancelled' && (
                            <div className="d-flex gap-2">
                              <Button
                                size="sm"
                                variant="outline-primary"
                                onClick={() => handleReschedule(appointment)}
                                className="flex-fill"
                                disabled={!canPatientRescheduleAppointment(appointment.status).allowed}
                                title={
                                  !canPatientRescheduleAppointment(appointment.status).allowed 
                                    ? canPatientRescheduleAppointment(appointment.status).reason 
                                    : 'Reagendar cita'
                                }
                              >
                                <FaEdit className="me-1" />
                                Reagendar
                              </Button>
                              <Button
                                size="sm"
                                variant="outline-danger"
                                onClick={() => handleCancel(appointment)}
                                className="flex-fill"
                                disabled={!canPatientCancelAppointment(appointment.status).allowed}
                                title={
                                  !canPatientCancelAppointment(appointment.status).allowed 
                                    ? canPatientCancelAppointment(appointment.status).reason 
                                    : 'Cancelar cita'
                                }
                              >
                                <FaTimes className="me-1" />
                                Cancelar
                              </Button>
                            </div>
                          )}
                          {appointment.status === 'confirmed' && (
                            <Alert variant="info" className="mt-2 mb-0 small">
                              <strong>ℹ️ Cita confirmada:</strong> Para modificaciones, contacta directamente al centro médico
                            </Alert>
                          )}
                          {appointment.status === 'cancelled' && (
                            <Alert variant="warning" className="mt-2 mb-0 small">
                              <strong>⚠️ Cita cancelada:</strong> Para una nueva cita, ve a la sección de médicos
                            </Alert>
                          )}
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            )}

            {/* Historial de Citas */}
            {(pastAppointments.length > 0 || cancelledAppointments.length > 0) && (
              <div className="mb-4">
                <h3 className="text-white mb-3">
                  <FaClock className="me-2" />
                  Historial de Citas
                </h3>
                <Row className="g-3">
                  {[...pastAppointments, ...cancelledAppointments].map((appointment) => (
                    <Col key={appointment.id} xl={6} lg={12} md={6}>
                      <Card className="h-100 border-0 shadow-sm appointment-card opacity-75">
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <div>
                              <h6 className="text-muted fw-bold mb-1">
                                <FaUserMd className="me-2" />
                                {appointment.doctorName}
                              </h6>
                              <p className="text-muted small mb-2">{appointment.doctorSpecialty}</p>
                            </div>
                            {getStatusBadge(appointment.status)}
                          </div>
                          
                          <div className="appointment-details">
                            <p className="mb-1 small text-muted">
                              <FaCalendarAlt className="me-2" />
                              {new Date(appointment.date).toLocaleDateString('es-ES')} - {appointment.time}
                            </p>
                            <Badge bg="secondary" className="px-2 py-1 small">
                              {appointment.type}
                            </Badge>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            )}

            {/* Mensaje cuando no hay citas */}
            {appointments.length === 0 && (
              <div className="text-center py-5">
                <div className="mb-4">
                  <FaCalendarAlt className="display-1 text-white opacity-50" />
                </div>
                <h4 className="text-white mb-3">No tienes reservas médicas</h4>
                <p className="text-white opacity-75 mb-4">
                  Ve a la sección de médicos para reservar tu primera cita
                </p>
                <Button 
                  variant="light" 
                  size="lg" 
                  className="rounded-pill"
                  onClick={() => navigate('/doctors')}
                >
                  <FaUserMd className="me-2" />
                  Ver Médicos Disponibles
                </Button>
              </div>
            )}
          </Col>

          {/* Barra lateral con estadísticas - como el doctor */}
          <Col lg={3}>
            <div className="position-sticky" style={{ top: '100px' }}>
              {/* Estadísticas con stats-card */}
              <div className="stats-sidebar">
                <div className="stats-card mb-2">
                  <FaCheckCircle className="stats-icon text-success" />
                  <div className="stats-number">{appointments.filter(apt => apt.status === 'confirmed').length}</div>
                  <div className="stats-label">Confirmadas</div>
                </div>
                <div className="stats-card mb-2">
                  <FaExclamationTriangle className="stats-icon text-warning" />
                  <div className="stats-number">{appointments.filter(apt => apt.status === 'pending').length}</div>
                  <div className="stats-label">Pendientes</div>
                </div>
                <div className="stats-card">
                  <FaCalendarAlt className="stats-icon text-primary" />
                  <div className="stats-number">{appointments.length}</div>
                  <div className="stats-label">Total</div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Carta de ayuda flotante */}
      <div 
        className={`floating-help-card ${showHelpCard ? 'show' : 'hide'}`}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1000,
          transition: 'transform 0.3s ease, opacity 0.3s ease'
        }}
      >
        <Card className="border-0 shadow-lg" style={{
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(12px)',
          borderRadius: '16px',
          minWidth: '280px',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)'
        }}>
          <Card.Body className="p-3">
            <div className="d-flex align-items-center mb-2">
              <Button
                variant="link"
                size="sm"
                className="text-secondary p-1 me-2 d-flex align-items-center justify-content-center"
                onClick={() => setShowHelpCard(!showHelpCard)}
                style={{ 
                  textDecoration: 'none', 
                  fontSize: '14px',
                  minWidth: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  transition: 'all 0.2s ease'
                }}
              >
                {showHelpCard ? <FaChevronRight /> : <FaChevronLeft />}
              </Button>
              <h6 className="fw-bold text-secondary mb-0">¿Necesitas ayuda?</h6>
            </div>
            {showHelpCard && (
              <>
                <p className="small text-muted mb-3">
                  Puedes reagendar o cancelar tus citas desde esta página
                </p>
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  className="w-100"
                  onClick={() => navigate('/doctors')}
                >
                  Reservar Nueva Cita
                </Button>
              </>
            )}
          </Card.Body>
        </Card>
      </div>

      {/* Modal para gestión de citas */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalAction === 'reschedule' ? 'Reagendar Cita' : 'Cancelar Cita'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAppointment && (
            <div>
              <div className="mb-3">
                <strong>Doctor:</strong> {selectedAppointment.doctorName}
              </div>
              <div className="mb-3">
                <strong>Cita actual:</strong> {selectedAppointment.date} a las {selectedAppointment.time}
              </div>
              
              {modalAction === 'reschedule' ? (
                <div>
                  <Form.Group className="mb-3">
                    <Form.Label>Nueva fecha</Form.Label>
                    <Form.Control
                      type="date"
                      value={newDateTime.date}
                      onChange={(e) => setNewDateTime(prev => ({ ...prev, date: e.target.value }))}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Nueva hora</Form.Label>
                    <Form.Control
                      type="time"
                      value={newDateTime.time}
                      onChange={(e) => setNewDateTime(prev => ({ ...prev, time: e.target.value }))}
                    />
                  </Form.Group>
                  <Alert variant="info">
                    <FaExclamationTriangle className="me-2" />
                    Tu cita reagendada quedará pendiente de confirmación por el doctor.
                  </Alert>
                </div>
              ) : (
                <Alert variant="warning">
                  <FaExclamationTriangle className="me-2" />
                  ¿Está seguro de que desea cancelar esta cita?
                </Alert>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button 
            variant={modalAction === 'reschedule' ? 'primary' : 'danger'} 
            onClick={confirmAction}
          >
            {modalAction === 'reschedule' ? 'Reagendar' : 'Confirmar Cancelación'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Notificaciones Toast */}
      <ToastContainer position="top-end" className="p-3" style={{ position: 'fixed', zIndex: 9999 }}>
        <Toast 
          show={showToast} 
          onClose={() => setShowToast(false)} 
          delay={4000} 
          autohide
          bg={toastType === 'success' ? 'success' : toastType === 'error' ? 'danger' : 'info'}
        >
          <Toast.Header>
            <FaBell className="me-2" />
            <strong className="me-auto">
              {toastType === 'success' ? 'Éxito' : toastType === 'error' ? 'Error' : 'Información'}
            </strong>
          </Toast.Header>
          <Toast.Body className="text-white">
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>

      <style>
        {`
          .appointment-card {
            transition: all 0.3s ease;
            background: linear-gradient(145deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.95) 100%) !important;
            backdrop-filter: blur(12px);
            border-radius: 16px !important;
            border: 1px solid rgba(255,255,255,0.3) !important;
            box-shadow: 0 8px 32px rgba(13,27,42,0.08), 0 2px 8px rgba(65,90,119,0.1);
          }
          
          .appointment-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 16px 48px rgba(13,27,42,0.12), 0 4px 16px rgba(65,90,119,0.15) !important;
            background: linear-gradient(145deg, rgba(255,255,255,1) 0%, rgba(248,250,252,1) 100%) !important;
          }

          .floating-help-card.hide {
            transform: translateX(calc(100% - 45px));
            opacity: 0.7;
          }

          .floating-help-card.show {
            transform: translateX(0);
            opacity: 0.92;
          }

          .floating-help-card .card {
            transition: all 0.3s ease;
            background: rgba(255, 255, 255, 0.98) !important;
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.4) !important;
            box-shadow: 0 4px 20px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04) !important;
          }

          .floating-help-card .card:hover {
            transform: scale(1.01);
            opacity: 1;
            background: rgba(255, 255, 255, 1) !important;
            box-shadow: 0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.06) !important;
          }

          .floating-help-card .btn-link:hover {
            background-color: rgba(0,123,255,0.1) !important;
            color: #007bff !important;
            transform: scale(1.1);
          }
        `}
      </style>
    </div>
  );
};

export default BookingPage;