import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Spinner, Alert, Button, Modal, Form, Toast, ToastContainer } from 'react-bootstrap';
import { FaCalendarAlt, FaClock, FaUser, FaPhone, FaStethoscope, FaCheckCircle, FaExclamationTriangle, FaEdit, FaTimes, FaBell, FaCheck } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import { apiService, type Appointment } from '../services/api';

// Extender la interfaz Appointment para incluir información adicional
interface ExtendedAppointment extends Appointment {
  pendingReason?: 'doctor_reschedule' | 'patient_request';
}

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<ExtendedAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para gestión de citas
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<ExtendedAppointment | null>(null);
  const [modalAction, setModalAction] = useState<'reschedule' | 'cancel'>('reschedule');
  const [newDateTime, setNewDateTime] = useState({ date: '', time: '' });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  // Generar días de la semana actual dinámicamente
  const getCurrentWeekDays = () => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = domingo, 1 = lunes, etc.
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay; // Calcular cuántos días restar para llegar al lunes
    
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);
    
    const weekDays = [];
    const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(monday);
      currentDate.setDate(monday.getDate() + i);
      
      weekDays.push({
        key: dayKeys[i],
        name: dayNames[i],
        date: currentDate.toISOString().split('T')[0] // Formato YYYY-MM-DD
      });
    }
    
    return weekDays;
  };

  const weekDays = getCurrentWeekDays();

  // Función para obtener el color del día
  const getDayHeaderStyle = (dayKey: string) => {
    const gradients = {
      monday: 'linear-gradient(135deg, #4a5568 0%, #2d3748 100%)',    // Gris azulado profesional
      tuesday: 'linear-gradient(135deg, #2b6cb8 0%, #1a4480 100%)',   // Azul corporativo
      wednesday: 'linear-gradient(135deg, #38a169 0%, #2f855a 100%)', // Verde médico suave
      thursday: 'linear-gradient(135deg, #319795 0%, #2c7a7b 100%)',  // Teal profesional
      friday: 'linear-gradient(135deg, #553c9a 0%, #44337a 100%)',    // Púrpura discreto
      saturday: 'linear-gradient(135deg, #718096 0%, #4a5568 100%)',  // Gris neutro
      sunday: 'linear-gradient(135deg, #805ad5 0%, #6b46c1 100%)'     // Púrpura suave
    };
    return {
      background: gradients[dayKey as keyof typeof gradients] || gradients.monday,
      border: 'none'
    };
  };

  // Cargar reservas al montar el componente
  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiService.getAppointments();
      
      if (response.success && response.data) {
        setAppointments(response.data);
      } else {
        setError(response.message || 'Error al cargar las reservas');
      }
    } catch (error) {
      console.error('Error cargando reservas:', error);
      setError('Error de conexión al cargar las reservas');
    } finally {
      setIsLoading(false);
    }
  };

  // Funciones para gestión de citas
  const handleConfirm = (appointment: ExtendedAppointment) => {
    try {
      // Confirmar cita directamente
      const updatedAppointments = appointments.map(apt => 
        apt.id === appointment.id 
          ? { ...apt, status: 'confirmed' as const }
          : apt
      );
      setAppointments(updatedAppointments);
      
      // Simular notificación al paciente
      setToastMessage(`Cita confirmada. Se ha notificado a ${appointment.patientName} por correo electrónico`);
      setToastType('success');
      setShowToast(true);
    } catch {
      setToastMessage('Error al confirmar la cita');
      setToastType('error');
      setShowToast(true);
    }
  };

  const handleReschedule = (appointment: ExtendedAppointment) => {
    setSelectedAppointment(appointment);
    setModalAction('reschedule');
    setNewDateTime({ date: appointment.date, time: appointment.time });
    setShowModal(true);
  };

  const handleCancel = (appointment: ExtendedAppointment) => {
    setSelectedAppointment(appointment);
    setModalAction('cancel');
    setShowModal(true);
  };

  const confirmAction = async () => {
    if (!selectedAppointment) return;

    try {
      if (modalAction === 'cancel') {
        // Simular cancelación
        const updatedAppointments = appointments.map(apt => 
          apt.id === selectedAppointment.id 
            ? { ...apt, status: 'cancelled' as const }
            : apt
        );
        setAppointments(updatedAppointments);
        
        // Simular notificación al paciente
        setToastMessage(`Cita cancelada. Se ha notificado a ${selectedAppointment.patientName}`);
        setToastType('success');
        setShowToast(true);
        
      } else if (modalAction === 'reschedule') {
        // Simular reagendamiento - la cita reagendada queda pendiente de confirmación del paciente
        const updatedAppointments = appointments.map(apt => 
          apt.id === selectedAppointment.id 
            ? { 
                ...apt, 
                date: newDateTime.date, 
                time: newDateTime.time, 
                status: 'pending' as const,
                // Marcar que está pendiente por modificación del doctor
                pendingReason: 'doctor_reschedule' as const
              } as ExtendedAppointment
            : apt
        );
        setAppointments(updatedAppointments);
        
        // Simular notificación al paciente
        setToastMessage(`Cita reagendada para ${newDateTime.date} a las ${newDateTime.time}. Se ha enviado notificación a ${selectedAppointment.patientName} para que confirme el nuevo horario por correo electrónico`);
        setToastType('success');
        setShowToast(true);
      }
      
      setShowModal(false);
      setSelectedAppointment(null);
      
    } catch {
      setToastMessage('Error al procesar la acción');
      setToastType('error');
      setShowToast(true);
    }
  };

  // Obtener reservas para un día específico
  const getAppointmentsForDay = (date: string) => {
    return appointments
      .filter(apt => apt.date === date)
      .sort((a, b) => a.time.localeCompare(b.time));
  };

  // Obtener citas fuera de la semana actual
  const getOutOfWeekAppointments = () => {
    const weekDatesSet = new Set(weekDays.map(day => day.date));
    return appointments
      .filter(apt => !weekDatesSet.has(apt.date))
      .sort((a, b) => {
        const dateComparison = a.date.localeCompare(b.date);
        return dateComparison !== 0 ? dateComparison : a.time.localeCompare(b.time);
      });
  };

  // Obtener badge de estado
  const getStatusBadge = (status: string, appointment?: ExtendedAppointment) => {
    switch (status) {
      case 'confirmed':
        return <Badge bg="success" className="d-flex align-items-center gap-1">
          <FaCheckCircle size={12} /> Confirmada
        </Badge>;
      case 'pending':
        // Distinguir entre pendiente normal y pendiente por reagendamiento del doctor
        if (appointment?.pendingReason === 'doctor_reschedule') {
          return <Badge bg="info" className="d-flex align-items-center gap-1">
            <FaExclamationTriangle size={12} /> Esperando confirmación del paciente
          </Badge>;
        }
        return <Badge bg="warning" className="d-flex align-items-center gap-1">
          <FaExclamationTriangle size={12} /> Pendiente
        </Badge>;
      case 'cancelled':
        return <Badge bg="danger">Cancelada</Badge>;
      default:
        return <Badge bg="secondary">Desconocido</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" className="text-primary" />
        <p className="mt-3">Cargando horario...</p>
      </Container>
    );
  }

  return (
    <div className="doctor-dashboard">
      {/* Barra de estadísticas compacta - Fixed en la esquina */}
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

      <Container className="py-5">
        {/* Header del Dashboard */}
        <div className="dashboard-header text-center mb-5">
          <div className="hero-content glass-card p-4 rounded-4">
            <h1 className="display-6 fw-bold mb-3">
              <FaStethoscope className="text-primary me-3" />
              Dashboard Médico
            </h1>
            <p className="lead mb-0">
              Bienvenido, <strong>{user?.name}</strong>
            </p>
            <p className="text-muted">
              Gestiona tu agenda y consulta tus próximas citas médicas
            </p>
          </div>
        </div>

        {/* Mostrar errores si los hay */}
        {error && (
          <Alert variant="danger" className="mb-4">
            <FaExclamationTriangle className="me-2" />
            {error}
          </Alert>
        )}

        {/* Horario Semanal */}
        <Row className="g-4">
          {weekDays.map((day) => {
            const dayAppointments = getAppointmentsForDay(day.date);
            
            return (
              <Col key={day.key} lg={6} xl={4} className="mb-4">
                <Card className="h-100 shadow-lg border-0 glass-card">
                  <Card.Header 
                    className="text-white text-center py-3" 
                    style={getDayHeaderStyle(day.key)}
                  >
                    <h5 className="mb-0 fw-bold">
                      <FaCalendarAlt className="me-2" />
                      {day.name}
                    </h5>
                    <small className="opacity-75">{day.date}</small>
                  </Card.Header>
                  
                  <Card.Body className="p-3">
                    {dayAppointments.length === 0 ? (
                      <div className="text-center text-muted py-4">
                        <FaCalendarAlt size={32} className="mb-2 opacity-50" />
                        <p className="mb-0">Sin reservas</p>
                      </div>
                    ) : (
                      <div className="appointments-list">
                        {dayAppointments.map((appointment) => (
                          <div key={appointment.id} className="appointment-card mb-3 p-3 rounded-3 border border-light">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <div className="appointment-time">
                                <h6 className="mb-1 text-primary fw-bold">
                                  <FaClock className="me-1" />
                                  {appointment.time}
                                </h6>
                                <small className="text-muted">
                                  {appointment.duration} min
                                </small>
                              </div>
                              {getStatusBadge(appointment.status, appointment)}
                            </div>
                            
                            <div className="appointment-details">
                              <div className="patient-info mb-2">
                                <p className="mb-1 fw-semibold">
                                  <FaUser className="me-2 text-primary" />
                                  {appointment.patientName}
                                </p>
                                <p className="mb-1 small text-muted">
                                  <FaPhone className="me-2" />
                                  {appointment.patientPhone}
                                </p>
                              </div>
                              
                              <div className="d-flex justify-content-between align-items-center">
                                <Badge bg="light" text="dark" className="px-2 py-1">
                                  {appointment.type}
                                </Badge>
                                
                                {appointment.status !== 'cancelled' && (
                                  <div className="appointment-actions d-flex gap-2">
                                    {/* Botón de confirmar solo para citas pendientes normales */}
                                    {appointment.status === 'pending' && !appointment.pendingReason && (
                                      <Button
                                        size="sm"
                                        variant="outline-success"
                                        onClick={() => handleConfirm(appointment)}
                                        title="Confirmar cita"
                                        className="action-btn"
                                      >
                                        <FaCheck />
                                      </Button>
                                    )}
                                    <Button
                                      size="sm"
                                      variant="outline-primary"
                                      onClick={() => handleReschedule(appointment)}
                                      title="Reagendar"
                                      className="action-btn"
                                    >
                                      <FaEdit />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline-danger"
                                      onClick={() => handleCancel(appointment)}
                                      title="Cancelar"
                                      className="action-btn"
                                    >
                                      <FaTimes />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>

        {/* Citas fuera de la semana actual */}
        {(() => {
          const outOfWeekAppointments = getOutOfWeekAppointments();
          if (outOfWeekAppointments.length > 0) {
            return (
              <div className="mt-5">
                <h4 className="text-center mb-4 text-white">
                  <FaCalendarAlt className="me-2" />
                  Citas Programadas (Otras Fechas)
                </h4>
                <Row className="g-4">
                  <Col xs={12}>
                    <Card className="shadow-lg border-0 glass-card">
                      <Card.Header 
                        className="text-white text-center py-3"
                        style={{
                          background: 'linear-gradient(135deg, #4a5568 0%, #2d3748 100%)',
                          border: 'none'
                        }}
                      >
                        <h5 className="mb-0 fw-bold">
                          <FaCalendarAlt className="me-2" />
                          Próximas Citas
                        </h5>
                      </Card.Header>
                      <Card.Body className="p-3">
                        <div className="appointments-list">
                          {outOfWeekAppointments.map((appointment) => (
                            <div key={appointment.id} className="appointment-card mb-3 p-3 rounded-3 border border-light">
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <div className="appointment-time">
                                  <h6 className="mb-1 text-primary fw-bold">
                                    <FaClock className="me-1" />
                                    {appointment.date} - {appointment.time}
                                  </h6>
                                  <small className="text-muted">
                                    {appointment.duration} min
                                  </small>
                                </div>
                                {getStatusBadge(appointment.status, appointment)}
                              </div>
                              
                              <div className="appointment-details">
                                <div className="patient-info mb-2">
                                  <p className="mb-1 fw-semibold">
                                    <FaUser className="me-2 text-primary" />
                                    {appointment.patientName}
                                  </p>
                                  <p className="mb-1 small text-muted">
                                    <FaPhone className="me-2" />
                                    {appointment.patientPhone}
                                  </p>
                                </div>
                                
                                <div className="d-flex justify-content-between align-items-center">
                                  <Badge bg="light" text="dark" className="px-2 py-1">
                                    {appointment.type}
                                  </Badge>
                                  
                                  {appointment.status !== 'cancelled' && (
                                    <div className="appointment-actions d-flex gap-2">
                                      {/* Botón de confirmar solo para citas pendientes normales */}
                                      {appointment.status === 'pending' && !appointment.pendingReason && (
                                        <Button
                                          size="sm"
                                          variant="outline-success"
                                          onClick={() => handleConfirm(appointment)}
                                          title="Confirmar cita"
                                          className="action-btn"
                                        >
                                          <FaCheck />
                                        </Button>
                                      )}
                                      <Button
                                        size="sm"
                                        variant="outline-primary"
                                        onClick={() => handleReschedule(appointment)}
                                        title="Reagendar"
                                        className="action-btn"
                                      >
                                        <FaEdit />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline-danger"
                                        onClick={() => handleCancel(appointment)}
                                        title="Cancelar"
                                        className="action-btn"
                                      >
                                        <FaTimes />
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </div>
            );
          }
          return null;
        })()}

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
                  <strong>Paciente:</strong> {selectedAppointment.patientName}
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
                  </div>
                ) : (
                  <Alert variant="warning">
                    <FaExclamationTriangle className="me-2" />
                    ¿Está seguro de que desea cancelar esta cita? Se notificará automáticamente al paciente.
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

        {/* Toast para notificaciones */}
        <ToastContainer 
          position="top-end" 
          className="p-3 toast-container" 
          style={{ 
            zIndex: 1070,
            position: 'fixed',
            top: '80px', // Debajo del navbar fijo
            right: '20px'
          }}
        >
          <Toast 
            show={showToast} 
            onClose={() => setShowToast(false)} 
            delay={5000} 
            autohide
            bg={toastType === 'success' ? 'success' : 'danger'}
            className="shadow-lg"
          >
            <Toast.Header closeButton={true}>
              <FaBell className="me-2" />
              <strong className="me-auto">Notificación del Sistema</strong>
            </Toast.Header>
            <Toast.Body className="text-white">
              <div className="d-flex align-items-center">
                <div>
                  {toastMessage}
                </div>
              </div>
            </Toast.Body>
          </Toast>
        </ToastContainer>
      </Container>
    </div>
  );
};

export default DoctorDashboard;