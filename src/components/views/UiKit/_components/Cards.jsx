import UniversalCard from '@src/components/global/UniversalCard';
import { Row, Col } from 'react-bootstrap';

const Cards = () => (
  <Row className="mt-48" id="cards">
    <h2 className="text-decoration-underline text-center">Cards</h2>
    <Row>
      <Col sm={6} className="text-start">
        <h5>Card 1</h5>
        <pre>
          <code>
            {`
        <UniversalCard
          headerBgColor="primary"
          headerColor="dark"
          isHeaderHidden={false}
          headerText="Card 1"
          isCollapsible
          bodyBgColor="white"
          bodyContainer="container-fluid"
          Body={<div className="py-16">This is a simple card with no Footer and a collabsable header and container-fluid</div>}
          footerActions={null}
        />
        `}
          </code>
        </pre>
      </Col>
      <Col sm={6} className="">
        <UniversalCard
          headerBgColor="primary"
          headerColor="dark"
          isHeaderHidden={false}
          headerText="Card 1"
          isCollapsible
          bodyBgColor="white"
          bodyContainer="container-fluid"
          Body={<div className="py-16">This is a simple card with no Footer and a collabsable header and container-fluid</div>}
          footerActions={null}
        />
      </Col>
      <Col sm={6} className="text-start">
        <h5>Card 2</h5>
        <pre>
          <code>
            {`
        <UniversalCard
          headerBgColor="secondary"
          headerColor="white"
          isHeaderHidden={false}
          headerText="Card 2"
          isCollapsible={false}
          bodyBgColor="white"
          bodyContainer="container"
          Body={<div className="py-16">This is a simple card with disabled collabsable header and 2 footer buttons with a container padding on the body</div>}
          footerActions={[
            {
              text: 'Here is my button text',
              onClick: () => console.info('button clicked'),
            },
            {
              text: 'Add a task',
              onClick: () => console.info('button clicked'),
            },
          ]}
        />
        `}
          </code>
        </pre>
      </Col>
      <Col sm={6} className="">
        <UniversalCard
          headerBgColor="secondary"
          headerColor="white"
          isHeaderHidden={false}
          headerText="Card 2"
          isCollapsible={false}
          bodyBgColor="white"
          bodyContainer="container"
          Body={<div className="py-16">This is a simple card with disabled collabsable header and 2 footer buttons with a container padding on the body</div>}
          footerActions={[
            {
              text: 'Here is my button text',
              onClick: () => console.info('button clicked'),
            },
            {
              text: 'Add a task',
              onClick: () => console.info('button clicked'),
            },
          ]}
        />
      </Col>
      <Col sm={6} className="text-start">
        <h5>Card 3</h5>
        <pre>
          <code>
            {`
        <UniversalCard
          isHeaderHidden
          bodyBgColor="dark"
          bodyContainer="container"
          Body={<div className="py-16 text-primary">this is a simple card with no header, and a single button of the footer with container instead of container-fluid</div>}
          footerActions={[
            {
              text: 'my only button',
              onClick: () => console.info('button clicked'),
            },
          ]}
        />
        `}
          </code>
        </pre>
      </Col>
      <Col sm={6} className="">
        <UniversalCard
          isHeaderHidden
          bodyBgColor="dark"
          bodyContainer="container"
          Body={<div className="py-16 text-primary">this is a simple card with no header, and a single button of the footer with container instead of container-fluid</div>}
          footerActions={[
            {
              text: 'my only button',
              onClick: () => console.info('button clicked'),
            },
          ]}
        />
      </Col>
      <Col sm={6} className="text-start">
        <h5>Card 4</h5>
        <pre>
          <code>
            {`
        <UniversalCard
          headerBgColor="primary"
          headerColor="white"
          isHeaderHidden={false}
          headerText="Card 4"
          isCollapsible
          bodyBgColor="white"
          bodyContainer="container"
          Body={<div className="py-16">This is a simple card with a Footer and a collabsable header and container with 2 buttons</div>}
          footerActions={[
            {
              text: 'Here is my button text',
              onClick: () => console.info('button clicked'),
            },
            {
              text: 'Add a task',
              onClick: () => console.info('button clicked'),
            },
          ]}
        />
        `}
          </code>
        </pre>
      </Col>
      <Col sm={6} className="">
        <UniversalCard
          headerBgColor="primary"
          headerColor="white"
          isHeaderHidden={false}
          headerText="Card 4"
          isCollapsible
          bodyBgColor="white"
          bodyContainer="container"
          Body={<div className="py-16">This is a simple card with a Footer and a collabsable header and container with 2 buttons</div>}
          footerActions={[
            {
              text: 'Here is my button text',
              onClick: () => console.info('button clicked'),
            },
            {
              text: 'Add a task',
              onClick: () => console.info('button clicked'),
            },
          ]}
        />
      </Col>
      <Col sm={6} className="text-start">
        <h5>Card 5</h5>
        <pre>
          <code>
            {`
        <UniversalCard
          isHeaderHidden
          bodyBgColor="white"
          bodyContainer="container"
          Body={<div className="py-16">Simple card with only a body!</div>}
        />
        `}
          </code>
        </pre>
      </Col>
      <Col sm={6} className="">
        <UniversalCard
          isHeaderHidden
          bodyBgColor="white"
          bodyContainer="container"
          Body={<div className="py-16">Simple card with only a body!</div>}
        />
      </Col>
    </Row>

  </Row>
);

export default Cards;
