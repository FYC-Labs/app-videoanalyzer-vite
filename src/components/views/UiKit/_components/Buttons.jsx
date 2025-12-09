import { Row, Col, Button } from 'react-bootstrap';

const colors = ['primary', 'primary-900', 'secondary', 'success', 'info', 'warning', 'danger'];

const btnTypes = [
  { name: 'active', variant: '', size: '' },
  { name: 'outline', variant: 'outline-', size: '' },
  { name: 'large', variant: '', size: 'lg' },
];

const Buttons = () => (
  <Row className="text-center mt-48" id="buttons">
    <Col sm={{ span: 6, offset: 3 }}>
      <h2 className="text-decoration-underline">Buttons</h2>
      {btnTypes.map(type => (
        <div key={type.name} className="mb-24">
          <h6 className="text-start">{type.name} (active/disabled)</h6>
          <div className="border rounded-2 p-16">
            <div className="d-flex justify-content-between mb-24">
              {colors.map(color => (
                <Button
                  key={`${type.name}-${color}`}
                  variant={`${type.variant}${color}`}
                  size={type.size}
                >
                  {color}
                </Button>
              ))}
            </div>
            <div className="d-flex justify-content-between">
              {colors.map(color => (
                <Button
                  key={`${type.name}-disabled-${color}`}
                  variant={`${type.variant}${color}`}
                  size={type.size}
                  disabled
                  className="rounded-25"
                >
                  {color}
                </Button>
              ))}
            </div>
          </div>
        </div>
      ))}
    </Col>
  </Row>
);

export default Buttons;
