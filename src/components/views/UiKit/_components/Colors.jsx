import { Row, Col, Card } from 'react-bootstrap';

const colors = [
  { name: 'primary', hex: '#3A82F5' },
  { name: 'secondary', hex: '#111827' },
  { name: 'success', hex: '#6DD09D' },
  { name: 'danger', hex: '#DB524C' },
  { name: 'warning', hex: '#e7d94a' },
  { name: 'info', hex: '#3270f7' },
  { name: 'light', hex: '#f0f4f6' },
  { name: 'dark', hex: '#373636' },
  { name: 'dark-300', hex: '#777676' },
  { name: 'grey', hex: '#E5E6E9' },
];

const Colors = () => (
  <Row className="text-center d-flex justify-content-center mt-48" id="colors">
    <h1 className="text-decoration-underline mb-24">Colors</h1>
    {colors.map((color) => (
      <Col key={color.name} xs={6} md={3}>
        <Card className="mb-4">
          <Card.Body className="p-4">
            <div className="rounded" style={{ backgroundColor: color.hex, height: '100px' }} />
            <p className="mt-3 mb-0">{color.name}</p>
            <p className="text-muted">{color.hex}</p>
          </Card.Body>
        </Card>
      </Col>
    ))}
  </Row>
);

export default Colors;
