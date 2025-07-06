// src/pages/AdminDashboard.tsx
import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Badge, Alert, Tab, Tabs, Table, Toast, ToastContainer } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';
import { FaUserMd, FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaCalendarCheck, FaEye, FaEnvelope } from 'react-icons/fa';

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  experience: string;
  rating: number;
  image: string;
  availableDays: string[];
  timeSlots: string[];
  isActive: boolean;
  createdAt: string;
}

interface Appointment {
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
  adminNotes?: string;
}

// Función para validar cambios de estado según reglas de negocio
const canChangeAppointmentStatus = (currentStatus: string, newStatus: string): { allowed: boolean, reason?: string } => {
  // Regla 1: Una vez confirmada, no se puede cancelar
  if (currentStatus === 'confirmed' && newStatus === 'cancelled') {
    return { 
      allowed: false, 
      reason: 'Una cita confirmada no puede ser cancelada. Esta restricción mantiene un registro claro del historial clínico.' 
    };
  }
  
  // Regla 2: Una vez cancelada, no se puede confirmar
  if (currentStatus === 'cancelled' && newStatus === 'confirmed') {
    return { 
      allowed: false, 
      reason: 'Una cita cancelada no puede ser reconfirmada. Debe crear una nueva reserva.' 
    };
  }
  
  // Regla 3: Una vez cancelada, no se puede volver a cancelar
  if (currentStatus === 'cancelled' && newStatus === 'cancelled') {
    return { 
      allowed: false, 
      reason: 'Esta cita ya está cancelada.' 
    };
  }
  
  // Regla 4: Una vez confirmada, no se puede volver a confirmar
  if (currentStatus === 'confirmed' && newStatus === 'confirmed') {
    return { 
      allowed: false, 
      reason: 'Esta cita ya está confirmada.' 
    };
  }

  // Cambios permitidos: pending → confirmed, pending → cancelled
  return { allowed: true };
};

const AdminDashboard = () => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteAppointmentModal, setShowDeleteAppointmentModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [doctorToDelete, setDoctorToDelete] = useState<Doctor | null>(null);
  const [appointmentToDelete, setAppointmentToDelete] = useState<Appointment | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  // Estados del formulario de médicos
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    experience: '',
    rating: 4.5,
    image: '',
    availableDays: [] as string[],
    timeSlots: [] as string[],
    isActive: true
  });

  // Estados del formulario de citas
  const [appointmentFormData, setAppointmentFormData] = useState({
    status: 'pending' as 'pending' | 'confirmed' | 'cancelled',
    date: '',
    time: '',
    adminNotes: ''
  });

  // Especialidades predefinidas
  const specialties = [
    'Cardiología', 'Neurología', 'Pediatría', 'Dermatología', 'Ginecología',
    'Traumatología', 'Oftalmología', 'Psiquiatría', 'Endocrinología', 'Urología',
    'Gastroenterología', 'Oncología', 'Medicina General'
  ];

  // Horarios disponibles
  const availableTimeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
  ];

  // Días de la semana
  const weekDays = [
    { value: '2025-07-07', label: 'Lunes' },
    { value: '2025-07-08', label: 'Martes' },
    { value: '2025-07-09', label: 'Miércoles' },
    { value: '2025-07-10', label: 'Jueves' },
    { value: '2025-07-11', label: 'Viernes' },
    { value: '2025-07-12', label: 'Sábado' },
    { value: '2025-07-13', label: 'Domingo' }
  ];

  // Cargar médicos al inicializar
  useEffect(() => {
    loadDoctors();
    loadAppointments();
  }, []);

  const loadDoctors = () => {
    try {
      const storedDoctors = JSON.parse(localStorage.getItem('adminDoctors') || '[]');
      setDoctors(storedDoctors);
    } catch (error) {
      console.error('Error loading doctors:', error);
      setDoctors([]);
    }
  };

  const loadAppointments = () => {
    try {
      const storedAppointments = JSON.parse(localStorage.getItem('patientAppointments') || '[]');
      setAppointments(storedAppointments);
    } catch (error) {
      console.error('Error loading appointments:', error);
      setAppointments([]);
    }
  };

  const saveDoctors = (updatedDoctors: Doctor[]) => {
    try {
      localStorage.setItem('adminDoctors', JSON.stringify(updatedDoctors));
      setDoctors(updatedDoctors);
    } catch (error) {
      console.error('Error saving doctors:', error);
      showNotification('Error al guardar los cambios', 'error');
    }
  };

  const saveAppointments = (updatedAppointments: Appointment[]) => {
    try {
      localStorage.setItem('patientAppointments', JSON.stringify(updatedAppointments));
      setAppointments(updatedAppointments);
    } catch (error) {
      console.error('Error saving appointments:', error);
      showNotification('Error al guardar los cambios de la cita', 'error');
    }
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      specialty: '',
      experience: '',
      rating: 4.5,
      image: '',
      availableDays: [],
      timeSlots: [],
      isActive: true
    });
  };

  const handleAddDoctor = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleEditDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setFormData({
      name: doctor.name,
      specialty: doctor.specialty,
      experience: doctor.experience,
      rating: doctor.rating,
      image: doctor.image,
      availableDays: doctor.availableDays,
      timeSlots: doctor.timeSlots,
      isActive: doctor.isActive
    });
    setShowEditModal(true);
  };

  const handleDeleteDoctor = (doctorId: number) => {
    const doctor = doctors.find(d => d.id === doctorId);
    if (doctor) {
      setDoctorToDelete(doctor);
      setShowDeleteModal(true);
    }
  };

  const confirmDeleteDoctor = () => {
    if (doctorToDelete) {
      const updatedDoctors = doctors.filter(doctor => doctor.id !== doctorToDelete.id);
      saveDoctors(updatedDoctors);
      showNotification('Médico eliminado correctamente', 'success');
      setShowDeleteModal(false);
      setDoctorToDelete(null);
    }
  };

  const cancelDeleteDoctor = () => {
    setShowDeleteModal(false);
    setDoctorToDelete(null);
  };

  const handleSubmit = (isEdit = false) => {
    // Validaciones
    if (!formData.name.trim() || !formData.specialty || !formData.experience.trim()) {
      showNotification('Por favor completa todos los campos obligatorios', 'error');
      return;
    }

    if (formData.availableDays.length === 0) {
      showNotification('Selecciona al menos un día disponible', 'error');
      return;
    }

    if (formData.timeSlots.length === 0) {
      showNotification('Selecciona al menos un horario disponible', 'error');
      return;
    }

    try {
      const updatedDoctors = [...doctors];

      if (isEdit && selectedDoctor) {
        // Editar médico existente
        const index = updatedDoctors.findIndex(d => d.id === selectedDoctor.id);
        if (index !== -1) {
          updatedDoctors[index] = {
            ...selectedDoctor,
            ...formData,
            id: selectedDoctor.id,
            createdAt: selectedDoctor.createdAt
          };
        }
      } else {
        // Agregar nuevo médico
        const newDoctor: Doctor = {
          id: Date.now(),
          ...formData,
          createdAt: new Date().toISOString()
        };
        updatedDoctors.push(newDoctor);
      }

      saveDoctors(updatedDoctors);
      showNotification(
        isEdit ? 'Médico actualizado correctamente' : 'Médico agregado correctamente',
        'success'
      );
      
      setShowAddModal(false);
      setShowEditModal(false);
      resetForm();
      setSelectedDoctor(null);
    } catch (error) {
      console.error('Error saving doctor:', error);
      showNotification('Error al guardar el médico', 'error');
    }
  };

  const handleDayToggle = (day: string) => {
    const updatedDays = formData.availableDays.includes(day)
      ? formData.availableDays.filter(d => d !== day)
      : [...formData.availableDays, day];
    
    setFormData({ ...formData, availableDays: updatedDays });
  };

  const handleTimeSlotToggle = (time: string) => {
    const updatedSlots = formData.timeSlots.includes(time)
      ? formData.timeSlots.filter(t => t !== time)
      : [...formData.timeSlots, time];
    
    setFormData({ ...formData, timeSlots: updatedSlots });
  };

  const generateImageUrl = (specialty: string) => {
    const specialtyIcons: { [key: string]: string } = {
      'Cardiología': '❤️',
      'Neurología': '🧠',
      'Pediatría': '🧸',
      'Dermatología': '✨',
      'Ginecología': '🌸',
      'Traumatología': '🦴',
      'Oftalmología': '👁️',
      'Psiquiatría': '🧘',
      'Endocrinología': '⚖️',
      'Urología': '🩺',
      'Gastroenterología': '🫃',
      'Oncología': '🎗️',
      'Medicina General': '👨‍⚕️'
    };

    const icon = specialtyIcons[specialty] || '👨‍⚕️';
    const colors = ['4a5568', '2d3748', '2b6cb8', '38a169', '319795', '553c9a', '718096', '44337a', '2c7a7b', '1a4480', '2f855a', '6b46c1'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    return `https://placehold.co/300x250/${color}/FFFFFF?text=${encodeURIComponent(icon + '+' + specialty)}`;
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setAppointmentFormData({
      status: appointment.status,
      date: appointment.date,
      time: appointment.time,
      adminNotes: appointment.adminNotes || ''
    });
    setShowAppointmentModal(true);
  };

  const handleUpdateAppointment = () => {
    if (!selectedAppointment) return;

    try {
      const statusValidation = canChangeAppointmentStatus(selectedAppointment.status, appointmentFormData.status);
      if (!statusValidation.allowed) {
        showNotification(statusValidation.reason || 'Error desconocido', 'error');
        return;
      }

      const updatedAppointments = appointments.map(apt => 
        apt.id === selectedAppointment.id 
          ? {
              ...apt,
              status: appointmentFormData.status,
              date: appointmentFormData.date,
              time: appointmentFormData.time,
              adminNotes: appointmentFormData.adminNotes
            }
          : apt
      );

      saveAppointments(updatedAppointments);

      // Simular notificación al paciente y doctor
      const statusMessages = {
        confirmed: 'confirmada',
        cancelled: 'cancelada',
        pending: 'marcada como pendiente'
      };

      const statusMessage = statusMessages[appointmentFormData.status];
      showNotification(
        `Cita ${statusMessage} correctamente. Se ha notificado al paciente y al médico.`,
        'success'
      );

      setShowAppointmentModal(false);
      setSelectedAppointment(null);
    } catch (error) {
      console.error('Error updating appointment:', error);
      showNotification('Error al actualizar la cita', 'error');
    }
  };

  const handleDeleteAppointment = (appointmentId: number) => {
    const appointment = appointments.find(apt => apt.id === appointmentId);
    if (appointment) {
      setAppointmentToDelete(appointment);
      setShowDeleteAppointmentModal(true);
    }
  };

  const confirmDeleteAppointment = () => {
    if (appointmentToDelete) {
      const updatedAppointments = appointments.filter(apt => apt.id !== appointmentToDelete.id);
      saveAppointments(updatedAppointments);
      showNotification('Cita eliminada correctamente. Se ha notificado al paciente y al médico.', 'success');
      setShowDeleteAppointmentModal(false);
      setAppointmentToDelete(null);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'cancelled': return 'danger';
      case 'pending': return 'warning';
      default: return 'secondary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmada';
      case 'cancelled': return 'Cancelada';
      case 'pending': return 'Pendiente';
      default: return 'Desconocido';
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="admin-dashboard">
        <Container className="py-5">
          <Alert variant="danger" className="text-center">
            <h4>Acceso Denegado</h4>
            <p>Solo los administradores pueden acceder a esta sección.</p>
          </Alert>
        </Container>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <Container className="py-5">
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold" style={{ color: '#ffffff' }}>Panel de Administración</h1>
          <p className="lead" style={{ color: '#f8f9fa' }}>Gestiona los médicos y servicios del sistema</p>
        </div>

        <Tabs defaultActiveKey="doctors" className="mb-4">
          <Tab eventKey="doctors" title={<><FaUserMd className="me-2" />Gestión de Médicos</>}>
            <Card className="shadow-sm border-0">
              <Card.Header className="bg-light d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <FaUserMd className="me-2" />
                  Médicos Registrados ({doctors.length})
                </h5>
                <Button
                  variant="primary"
                  onClick={handleAddDoctor}
                  className="d-flex align-items-center"
                >
                  <FaPlus className="me-2" />Agregar Médico
                </Button>
              </Card.Header>
              <Card.Body className="p-0">
                {doctors.length === 0 ? (
                  <div className="text-center py-5">
                    <FaUserMd className="display-1 text-muted mb-3" />
                    <h4 className="text-muted">No hay médicos registrados</h4>
                    <p className="text-muted">Comienza agregando el primer médico al sistema</p>
                    <Button variant="primary" onClick={handleAddDoctor}>
                      <FaPlus className="me-2" />Agregar Primer Médico
                    </Button>
                  </div>
                ) : (
                  <Table responsive hover>
                    <thead className="bg-light">
                      <tr>
                        <th>Médico</th>
                        <th>Especialidad</th>
                        <th>Experiencia</th>
                        <th>Rating</th>
                        <th>Días Disponibles</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {doctors.map((doctor) => (
                        <tr key={doctor.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <img
                                src={doctor.image}
                                alt={doctor.name}
                                className="rounded me-3"
                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                              />
                              <div>
                                <h6 className="mb-0">{doctor.name}</h6>
                                <small className="text-muted">ID: {doctor.id}</small>
                              </div>
                            </div>
                          </td>
                          <td>
                            <Badge bg="info" className="px-2 py-1">
                              {doctor.specialty}
                            </Badge>
                          </td>
                          <td>{doctor.experience}</td>
                          <td>
                            <span className="fw-bold text-warning">
                              {doctor.rating} ⭐
                            </span>
                          </td>
                          <td>
                            <small className="text-muted">
                              {doctor.availableDays.length} días
                            </small>
                          </td>
                          <td>
                            <Badge bg={doctor.isActive ? 'success' : 'secondary'}>
                              {doctor.isActive ? 'Activo' : 'Inactivo'}
                            </Badge>
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => handleEditDoctor(doctor)}
                              >
                                <FaEdit />
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDeleteDoctor(doctor.id)}
                              >
                                <FaTrash />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>
          </Tab>
          
          <Tab eventKey="appointments" title={<><FaCalendarCheck className="me-2" />Gestión de Reservas</>}>
            <Card className="shadow-sm border-0">
              <Card.Header className="bg-light d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <FaCalendarCheck className="me-2" />
                  Reservas del Sistema ({appointments.length})
                </h5>
                <Button
                  variant="info"
                  onClick={loadAppointments}
                  className="d-flex align-items-center"
                >
                  <FaEye className="me-2" />Actualizar
                </Button>
              </Card.Header>
              <Card.Body className="p-0">
                {appointments.length === 0 ? (
                  <div className="text-center py-5">
                    <FaCalendarCheck className="display-1 text-muted mb-3" />
                    <h4 className="text-muted">No hay reservas en el sistema</h4>
                    <p className="text-muted">Las reservas aparecerán aquí cuando los pacientes hagan citas</p>
                  </div>
                ) : (
                  <Table responsive hover>
                    <thead className="bg-light">
                      <tr>
                        <th>Paciente</th>
                        <th>Médico</th>
                        <th>Fecha y Hora</th>
                        <th>Estado</th>
                        <th>Tipo</th>
                        <th>Creada</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((appointment) => (
                        <tr key={appointment.id}>
                          <td>
                            <div>
                              <h6 className="mb-0">{appointment.patientName}</h6>
                              <small className="text-muted">{appointment.patientEmail}</small>
                            </div>
                          </td>
                          <td>
                            <div>
                              <h6 className="mb-0">{appointment.doctorName}</h6>
                              <small className="text-muted">{appointment.doctorSpecialty}</small>
                            </div>
                          </td>
                          <td>
                            <div>
                              <strong>{new Date(appointment.date).toLocaleDateString('es-ES')}</strong>
                              <br />
                              <span className="text-muted">{appointment.time}</span>
                            </div>
                          </td>
                          <td>
                            <Badge bg={getStatusBadgeVariant(appointment.status)}>
                              {getStatusText(appointment.status)}
                            </Badge>
                          </td>
                          <td>{appointment.type}</td>
                          <td>
                            <small className="text-muted">
                              {new Date(appointment.createdAt).toLocaleDateString('es-ES')}
                            </small>
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => handleEditAppointment(appointment)}
                                title="Editar reserva"
                              >
                                <FaEdit />
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDeleteAppointment(appointment.id)}
                                title="Eliminar reserva"
                              >
                                <FaTrash />
                              </Button>
                              <Button
                                variant="outline-info"
                                size="sm"
                                title="Notificar cambios"
                                onClick={() => showNotification('Notificación enviada al paciente y médico', 'success')}
                              >
                                <FaEnvelope />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>
          </Tab>
        </Tabs>

        {/* Modal para Agregar Médico */}
        <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              <FaPlus className="me-2" />Agregar Nuevo Médico
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nombre Completo *</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Dr. Juan Pérez"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Especialidad *</Form.Label>
                    <Form.Select
                      value={formData.specialty}
                      onChange={(e) => {
                        const specialty = e.target.value;
                        setFormData({ 
                          ...formData, 
                          specialty,
                          image: generateImageUrl(specialty)
                        });
                      }}
                    >
                      <option value="">Selecciona una especialidad</option>
                      {specialties.map((specialty) => (
                        <option key={specialty} value={specialty}>
                          {specialty}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={8}>
                  <Form.Group className="mb-3">
                    <Form.Label>Experiencia *</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      placeholder="10 años de experiencia"
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Rating</Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      max="5"
                      step="0.1"
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Días Disponibles *</Form.Label>
                <div className="d-flex flex-wrap gap-2">
                  {weekDays.map((day) => (
                    <Form.Check
                      key={day.value}
                      type="checkbox"
                      id={`day-${day.value}`}
                      label={day.label}
                      checked={formData.availableDays.includes(day.value)}
                      onChange={() => handleDayToggle(day.value)}
                      className="me-3"
                    />
                  ))}
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Horarios Disponibles *</Form.Label>
                <div className="row g-2">
                  {availableTimeSlots.map((time) => (
                    <div key={time} className="col-3">
                      <Form.Check
                        type="checkbox"
                        id={`time-${time}`}
                        label={time}
                        checked={formData.timeSlots.includes(time)}
                        onChange={() => handleTimeSlotToggle(time)}
                      />
                    </div>
                  ))}
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  id="isActive"
                  label="Médico activo"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              <FaTimes className="me-2" />Cancelar
            </Button>
            <Button variant="primary" onClick={() => handleSubmit(false)}>
              <FaSave className="me-2" />Guardar Médico
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal para Editar Médico */}
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              <FaEdit className="me-2" />Editar Médico
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nombre Completo *</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Dr. Juan Pérez"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Especialidad *</Form.Label>
                    <Form.Select
                      value={formData.specialty}
                      onChange={(e) => {
                        const specialty = e.target.value;
                        setFormData({ 
                          ...formData, 
                          specialty,
                          image: generateImageUrl(specialty)
                        });
                      }}
                    >
                      <option value="">Selecciona una especialidad</option>
                      {specialties.map((specialty) => (
                        <option key={specialty} value={specialty}>
                          {specialty}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={8}>
                  <Form.Group className="mb-3">
                    <Form.Label>Experiencia *</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      placeholder="10 años de experiencia"
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Rating</Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      max="5"
                      step="0.1"
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Días Disponibles *</Form.Label>
                <div className="d-flex flex-wrap gap-2">
                  {weekDays.map((day) => (
                    <Form.Check
                      key={day.value}
                      type="checkbox"
                      id={`edit-day-${day.value}`}
                      label={day.label}
                      checked={formData.availableDays.includes(day.value)}
                      onChange={() => handleDayToggle(day.value)}
                      className="me-3"
                    />
                  ))}
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Horarios Disponibles *</Form.Label>
                <div className="row g-2">
                  {availableTimeSlots.map((time) => (
                    <div key={time} className="col-3">
                      <Form.Check
                        type="checkbox"
                        id={`edit-time-${time}`}
                        label={time}
                        checked={formData.timeSlots.includes(time)}
                        onChange={() => handleTimeSlotToggle(time)}
                      />
                    </div>
                  ))}
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  id="editIsActive"
                  label="Médico activo"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              <FaTimes className="me-2" />Cancelar
            </Button>
            <Button variant="primary" onClick={() => handleSubmit(true)}>
              <FaSave className="me-2" />Actualizar Médico
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal para Gestión de Citas Médicas */}
        <Modal show={showAppointmentModal} onHide={() => setShowAppointmentModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              <FaCalendarCheck className="me-2" />Gestión de Citas Médicas
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nombre del Paciente *</Form.Label>
                    <Form.Control
                      type="text"
                      value={selectedAppointment?.patientName}
                      readOnly
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email del Paciente *</Form.Label>
                    <Form.Control
                      type="email"
                      value={selectedAppointment?.patientEmail}
                      readOnly
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Médico Asignado</Form.Label>
                    <Form.Control
                      type="text"
                      value={selectedAppointment?.doctorName}
                      readOnly
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Especialidad</Form.Label>
                    <Form.Control
                      type="text"
                      value={selectedAppointment?.doctorSpecialty}
                      readOnly
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Fecha *</Form.Label>
                    <Form.Control
                      type="date"
                      value={appointmentFormData.date}
                      onChange={(e) => setAppointmentFormData({ ...appointmentFormData, date: e.target.value })}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Hora *</Form.Label>
                    <Form.Control
                      type="time"
                      value={appointmentFormData.time}
                      onChange={(e) => setAppointmentFormData({ ...appointmentFormData, time: e.target.value })}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Estado</Form.Label>
                    <Form.Select
                      value={appointmentFormData.status}
                      onChange={(e) => {
                        const newStatus = e.target.value as 'pending' | 'confirmed' | 'cancelled';
                        const validation = canChangeAppointmentStatus(selectedAppointment?.status || 'pending', newStatus);
                        if (validation.allowed) {
                          setAppointmentFormData({ ...appointmentFormData, status: newStatus });
                        } else {
                          showNotification(validation.reason || 'Cambio de estado no permitido', 'error');
                        }
                      }}
                    >
                      <option 
                        value="pending" 
                        disabled={!canChangeAppointmentStatus(selectedAppointment?.status || 'pending', 'pending').allowed}
                      >
                        Pendiente{!canChangeAppointmentStatus(selectedAppointment?.status || 'pending', 'pending').allowed ? ' (No disponible)' : ''}
                      </option>
                      <option 
                        value="confirmed" 
                        disabled={!canChangeAppointmentStatus(selectedAppointment?.status || 'pending', 'confirmed').allowed}
                      >
                        Confirmada{!canChangeAppointmentStatus(selectedAppointment?.status || 'pending', 'confirmed').allowed ? ' (No disponible)' : ''}
                      </option>
                      <option 
                        value="cancelled" 
                        disabled={!canChangeAppointmentStatus(selectedAppointment?.status || 'pending', 'cancelled').allowed}
                      >
                        Cancelada{!canChangeAppointmentStatus(selectedAppointment?.status || 'pending', 'cancelled').allowed ? ' (No disponible)' : ''}
                      </option>
                    </Form.Select>
                    {selectedAppointment && (
                      <Form.Text className="text-muted">
                        Estado actual: <strong>{getStatusText(selectedAppointment.status)}</strong>
                        {selectedAppointment.status === 'confirmed' && (
                          <><br /><small className="text-warning">⚠️ Las citas confirmadas no pueden ser canceladas</small></>
                        )}
                        {selectedAppointment.status === 'cancelled' && (
                          <><br /><small className="text-info">ℹ️ Las citas canceladas no pueden ser reconfirmadas</small></>
                        )}
                      </Form.Text>
                    )}
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Notas del Administrador</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={appointmentFormData.adminNotes}
                  onChange={(e) => setAppointmentFormData({ ...appointmentFormData, adminNotes: e.target.value })}
                  placeholder="Notas adicionales sobre la cita"
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAppointmentModal(false)}>
              <FaTimes className="me-2" />Cancelar
            </Button>
            <Button variant="primary" onClick={handleUpdateAppointment}>
              <FaSave className="me-2" />Guardar Cambios
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal de Confirmación de Eliminación */}
        <Modal show={showDeleteModal} onHide={cancelDeleteDoctor} centered>
          <Modal.Header closeButton className="bg-danger text-white">
            <Modal.Title>
              <FaTrash className="me-2" />Confirmar Eliminación
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="text-center">
              <div className="mb-3">
                <FaTrash className="display-4 text-danger" />
              </div>
              <h5 className="mb-3">¿Estás seguro de que quieres eliminar este médico?</h5>
              {doctorToDelete && (
                <div className="alert alert-warning">
                  <h6 className="mb-2">
                    <FaUserMd className="me-2" />
                    {doctorToDelete.name}
                  </h6>
                  <p className="mb-0">
                    <strong>Especialidad:</strong> {doctorToDelete.specialty}
                  </p>
                  <p className="mb-0">
                    <strong>Experiencia:</strong> {doctorToDelete.experience}
                  </p>
                </div>
              )}
              <p className="text-muted">
                Esta acción no se puede deshacer. Toda la información del médico será eliminada permanentemente.
              </p>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={cancelDeleteDoctor}>
              <FaTimes className="me-2" />Cancelar
            </Button>
            <Button variant="danger" onClick={confirmDeleteDoctor}>
              <FaTrash className="me-2" />Eliminar Médico
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal de Confirmación de Eliminación de Reservas */}
        <Modal show={showDeleteAppointmentModal} onHide={() => setShowDeleteAppointmentModal(false)} centered>
          <Modal.Header closeButton className="bg-danger text-white">
            <Modal.Title>
              <FaTrash className="me-2" />Confirmar Eliminación de Reserva
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="text-center">
              <div className="mb-3">
                <FaCalendarCheck className="display-4 text-danger" />
              </div>
              <h5 className="mb-3">¿Estás seguro de que quieres eliminar esta reserva?</h5>
              {appointmentToDelete && (
                <div className="alert alert-warning">
                  <h6 className="mb-2">
                    <FaUserMd className="me-2" />
                    {appointmentToDelete.patientName}
                  </h6>
                  <p className="mb-0">
                    <strong>Médico:</strong> {appointmentToDelete.doctorName}
                  </p>
                  <p className="mb-0">
                    <strong>Fecha:</strong> {new Date(appointmentToDelete.date).toLocaleDateString('es-ES')}
                  </p>
                  <p className="mb-0">
                    <strong>Hora:</strong> {appointmentToDelete.time}
                  </p>
                  <p className="mb-0">
                    <strong>Estado:</strong> <Badge bg={getStatusBadgeVariant(appointmentToDelete.status)}>
                      {getStatusText(appointmentToDelete.status)}
                    </Badge>
                  </p>
                </div>
              )}
              <p className="text-muted">
                Esta acción no se puede deshacer. La reserva será eliminada permanentemente y se notificará al paciente y al médico.
              </p>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteAppointmentModal(false)}>
              <FaTimes className="me-2" />Cancelar
            </Button>
            <Button variant="danger" onClick={confirmDeleteAppointment}>
              <FaTrash className="me-2" />Eliminar Reserva
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Toast para notificaciones */}
        <ToastContainer position="top-end" className="p-3">
          <Toast
            show={showToast}
            onClose={() => setShowToast(false)}
            delay={5000}
            autohide
            bg={toastType === 'success' ? 'success' : 'danger'}
            className="text-white"
          >
            <Toast.Header>
              <strong className="me-auto">
                {toastType === 'success' ? '✅ Éxito' : '❌ Error'}
              </strong>
            </Toast.Header>
            <Toast.Body>{toastMessage}</Toast.Body>
          </Toast>
        </ToastContainer>
      </Container>
    </div>
  );
};

export default AdminDashboard;
