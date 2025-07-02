// src/components/FeatureSection.tsx
import { Container, Row, Col, Card } from 'react-bootstrap';
import NotificationIcon from '../assets/notifications.svg?react';

const features = [
	{
		title: 'Fácil de usar',
		icon: '🖱️',
		desc: 'Interfaz intuitiva para pacientes y doctores.'
	},
	{
		title: 'Recordatorios Automáticos',
		icon: <NotificationIcon style={{ width: 40, height: 40 }} />,
		desc: 'Recibe notificaciones antes de tu cita.'
	},
	{
		title: 'Historial Seguro',
		icon: '🔒',
		desc: 'Tus datos y citas protegidos con JWT y cifrado.'
	}
];

const FeatureSection = () => (
	<section className="feature-section" id="feature-section">
		<Container>
			<h2 className="text-center mb-5">¿Por qué elegirnos?</h2>
			<Row>
				{features.map((f, i) => (
					<Col key={i} md={4} className="mb-4">
						<Card className="h-100 border-0 shadow-sm">
							<Card.Body className="text-center">
								<div className="feature-icon" style={{ fontSize: '2.5rem' }}>
									{f.icon}
								</div>
								<Card.Title className="mt-3 feature-card-title">{f.title}</Card.Title>
								<Card.Text>{f.desc}</Card.Text>
							</Card.Body>
						</Card>
					</Col>
				))}
			</Row>
		</Container>
	</section>
);

export default FeatureSection;