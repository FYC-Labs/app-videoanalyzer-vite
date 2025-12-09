import { Tab } from 'react-bootstrap';

const TabContainer = ({ activeTab, tabs }) => (
  <Tab.Container activeKey={activeTab}>
    <Tab.Content>
      {tabs.map(t => (
        <Tab.Pane key={t.name} eventKey={t.name}>
          {t.component}
        </Tab.Pane>
      ))}
    </Tab.Content>
  </Tab.Container>
);

export default TabContainer;
