import { Row, Col, Card } from 'react-bootstrap';

const headers = {
  reg: [
    { type: 'h1', size: 48, fw: 400 },
    { type: 'h2', size: 40, fw: 400 },
    { type: 'h3', size: 36, fw: 400 },
    { type: 'h4', size: 32, fw: 400 },
    { type: 'h5', size: 24, fw: 400 },
    { type: 'h6', size: 24, fw: 400 },
    { type: 'lead', size: 20, fw: 400 },
    { type: 'body', size: 14, fw: 400 },
    { type: 'small', size: 12, fw: 400 },
  ],
  med: [
    { type: 'h1', size: 48, fw: 500 },
    { type: 'h2', size: 40, fw: 500 },
    { type: 'h3', size: 36, fw: 500 },
    { type: 'h4', size: 32, fw: 500 },
    { type: 'h5', size: 24, fw: 500 },
    { type: 'h6', size: 24, fw: 500 },
    { type: 'lead', size: 20, fw: 500 },
    { type: 'body', size: 14, fw: 500 },
    { type: 'small', size: 12, fw: 500 },
  ],
  bold: [
    { type: 'h1', size: 48, fw: 700 },
    { type: 'h2', size: 40, fw: 700 },
    { type: 'h3', size: 36, fw: 700 },
    { type: 'h4', size: 32, fw: 700 },
    { type: 'h5', size: 24, fw: 700 },
    { type: 'h6', size: 24, fw: 700 },
    { type: 'lead', size: 20, fw: 700 },
    { type: 'body', size: 14, fw: 700 },
    { type: 'small', size: 12, fw: 700 },
  ],
};

const Headers = () => (
  <>
    <h1 className="text-center text-decoration-underline mt-48" id="header">Headings & Typography</h1>
    <h4>Regular</h4>
    <Row className="text-center d-flex justify-content-center">
      {headers.reg.map((header) => (
        <Col key={`${header.type}-${header.size}-${header.fw}`} xs={6} md={3}>
          <Card className="mb-4">
            <Card.Body className="p-4">
              <div className={`${header.type} fw-${header.fw}`}>{`<${header.type} />`}</div>
              <p className="mt-3 mb-0">size: {header.size}</p>
              <p className="text-muted">font weight: {header.fw}</p>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
    <h4 className="fw-500">Medium</h4>
    <Row className="text-center d-flex justify-content-center">
      {headers.med.map((header) => (
        <Col key={`${header.type}-${header.size}-${header.fw}`} xs={6} md={3}>
          <Card className="mb-4">
            <Card.Body className="p-4">
              <div className={`${header.type} fw-${header.fw}`}>{`<${header.type} />`}</div>
              <p className="mt-3 mb-0">size: {header.size}</p>
              <p className="text-muted">font weight: {header.fw}</p>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
    <h4 className="fw-700">Bold</h4>
    <Row className="text-center d-flex justify-content-center">
      {headers.bold.map((header) => (
        <Col key={`${header.type}-${header.size}-${header.fw}`} xs={6} md={3}>
          <Card className="mb-4">
            <Card.Body className="p-4">
              <div className={`${header.type} fw-${header.fw}`}>{`<${header.type} />`}</div>
              <p className="mt-3 mb-0">size: {header.size}</p>
              <p className="text-muted">font weight: {header.fw}</p>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  </>
);

export default Headers;
