import { Row, Dropdown, Nav } from 'react-bootstrap';

const TableOfContents = () => (
  <Row className="text-center">
    <a href="https://react-bootstrap.netlify.app/" className="mb-16">Go to React Bootstrap Docs</a>
    <Dropdown>
      <Dropdown.Toggle variant="white" id="dropdown-basic">
        Table of Contents
      </Dropdown.Toggle>
      <Dropdown.Menu className="text-center">
        <Nav.Link href="#colors" className="hover">Colors</Nav.Link>
        <Dropdown.Divider className="m-0" />
        <Nav.Link href="#header" className="hover">Typography</Nav.Link>
        <Dropdown.Divider className="m-0" />
        <Nav.Link href="#buttons" className="hover">Buttons</Nav.Link>
        <Dropdown.Divider className="m-0" />
        <Nav.Link href="#cards" className="hover">Cards</Nav.Link>
        <Dropdown.Divider className="m-0" />
        <Nav.Link href="#row-col" className="hover">Rows & Columns</Nav.Link>
        <Dropdown.Divider className="m-0" />
        <Nav.Link href="#navbar" className="hover">NavBar</Nav.Link>
        <Dropdown.Divider className="m-0" />
        <Nav.Link href="#navs" className="hover">Navs & Tabs</Nav.Link>
        <Dropdown.Divider className="m-0" />
        <Nav.Link href="#universal-inputs" className="hover">Universal Inputs</Nav.Link>
        <Dropdown.Divider className="m-0" />
        <Nav.Link href="#dropdown" className="hover">Dropdowns</Nav.Link>
        <Dropdown.Divider className="m-0" />
        <Nav.Link href="#modal" className="hover">Modals</Nav.Link>
        <Dropdown.Divider className="m-0" />
        <Nav.Link href="#images" className="hover">Images</Nav.Link>
        <Dropdown.Divider className="m-0" />
        <Nav.Link href="#tables" className="hover">Tables</Nav.Link>
        <Dropdown.Divider className="m-0" />
        <Nav.Link href="#alerts" className="hover">Alerts</Nav.Link>
        <Dropdown.Divider className="m-0" />
        <Nav.Link href="#badges" className="hover">Badges</Nav.Link>
        <Dropdown.Divider className="m-0" />
        <Nav.Link href="#progress" className="hover">Progress Bar</Nav.Link>
        <Dropdown.Divider className="m-0" />
        <Nav.Link href="#loader" className="hover">Loader</Nav.Link>
        <Dropdown.Divider className="m-0" />
        <Nav.Link href="#toasts" className="hover">Toasts</Nav.Link>
        <Dropdown.Divider className="m-0" />
        <Nav.Link href="#containers" className="hover">Containers</Nav.Link>
      </Dropdown.Menu>
    </Dropdown>
  </Row>
);

export default TableOfContents;
