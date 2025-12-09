import { Row, Col, Dropdown } from 'react-bootstrap';

const Dropdowns = () => (
  <Row className="text-center mt-48" id="dropdown">
    <Col sm={{ span: 6, offset: 3 }}>
      <h2 className="text-decoration-underline">Dropdowns</h2>
      <Dropdown className="mb-8" data-bs-theme="dark">
        <Dropdown.Toggle id="dropdown-button-dark-example1" variant="primary">
          Dropdown Button
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item href="" active>
            Action
          </Dropdown.Item>
          <Dropdown.Item href="">Another action</Dropdown.Item>
          <Dropdown.Item href="">Something else</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item href="">Separated link</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <Dropdown className="mb-8">
        <Dropdown.Toggle id="dropdown-autoclose-true">
          Default Dropdown
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item href="">Menu Item</Dropdown.Item>
          <Dropdown.Item href="">Menu Item</Dropdown.Item>
          <Dropdown.Item href="">Menu Item</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <>
        <Dropdown className="mb-8" autoClose="inside">
          <Dropdown.Toggle id="dropdown-autoclose-inside">
            Clickable Outside
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item href="">Menu Item</Dropdown.Item>
            <Dropdown.Item href="">Menu Item</Dropdown.Item>
            <Dropdown.Item href="">Menu Item</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown className="mb-8" autoClose="outside">
          <Dropdown.Toggle id="dropdown-autoclose-outside">
            Clickable Inside
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item href="">Menu Item</Dropdown.Item>
            <Dropdown.Item href="">Menu Item</Dropdown.Item>
            <Dropdown.Item href="">Menu Item</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown className="mb-8" autoClose={false}>
          <Dropdown.Toggle id="dropdown-autoclose-false">
            Manual Close
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item href="">Menu Item</Dropdown.Item>
            <Dropdown.Item href="">Menu Item</Dropdown.Item>
            <Dropdown.Item href="">Menu Item</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </>
    </Col>
  </Row>
);

export default Dropdowns;
