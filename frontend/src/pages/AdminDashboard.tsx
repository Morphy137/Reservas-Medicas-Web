// src/pages/AdminDashboard.tsx
import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Badge, Alert, Tab, Tabs, Table, Toast, ToastContainer } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';
import { FaUserMd, FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';

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

const AdminDashboard = () => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  // Estados del formulario
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

  const saveDoctors = (updatedDoctors: Doctor[]) => {
    try {
      localStorage.setItem('adminDoctors', JSON.stringify(updatedDoctors));
      setDoctors(updatedDoctors);
    } catch (error) {
      console.error('Error saving doctors:', error);
      showNotification('Error al guardar los cambios', 'error');
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
    if (window.confirm('¿Estás seguro de que quieres eliminar este médico?')) {
      const updatedDoctors = doctors.filter(doctor => doctor.id !== doctorId);
      saveDoctors(updatedDoctors);
      showNotification('Médico eliminado correctamente', 'success');
    }
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
