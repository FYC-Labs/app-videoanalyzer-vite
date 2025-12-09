import { useEffect } from 'react';
import { Tab } from 'react-bootstrap';

const TabNavDefault = ({ tabsClassName, tabs, handleClick, currentTab }) => (
  <div
    className={`d-flex align-items-center overflow-x-auto ${tabsClassName || ''}`}
    style={{ marginBottom: '-2px' }}
  >
    {tabs.map((tab) => (
      <div
        key={tab}
        className={`fw-bold rounded-tab text-center pt-16 w-100 ${tab.key === currentTab && 'bg-gray-50'}`}
      >
        <div
          role="button"
          tabIndex={0}
          onClick={() => handleClick(tab)}
          className={`text-nowrap mb-8 base ${tab.key === currentTab ? 'fw-800 text-primary' : 'text-gray-800'}`}
        >
          {tab.title}
        </div>
      </div>
    ))}
  </div>
);

const TabNavUnderline = ({ tabsClassName, tabs, handleClick, currentTab }) => (
  <div className={`d-flex mb-24 align-items-center overflow-x-auto ${tabsClassName || ''}`}>
    {tabs.map((tab) => (
      <div
        role="button"
        key={tab.key}
        tabIndex={0}
        onClick={() => handleClick(tab)}
        className={`text-center pt-16 text-nowrap mb-8 pb-8 px-40 base border-bottom ${tab.key === currentTab ? 'fw-800 text-primary tabnav-active-underline' : 'fw-300 text-dark-900 border-gray-100 border-2'}`}
      >
        {tab.title}
      </div>
    ))}
  </div>
);

const TabNav = ({
  tabs,
  activeTab,
  defaultActiveTab,
  TabPaneComponents,
  onClick = () => {},
  shouldQueryParamUpdate = false,
  tabsClassName,
  tabsContainerClassName,
  template = 'default',
  $signalsToClean = [],
  isLoadedAsync = true,
}) => {
  const currentTab = activeTab || defaultActiveTab || tabs[0]?.key;

  useEffect(() => {
    $signalsToClean.forEach(($signal) => {
      $signal.reset();
    });
  }, [currentTab, $signalsToClean]);

  const handleClick = (newTab) => {
    if (shouldQueryParamUpdate && currentTab !== newTab.key) {
      const queryParams = new URLSearchParams(window.location.search);
      queryParams.set('tab', newTab.key);
      window.history.pushState(null, null, `?${queryParams.toString()}`);
    }
    onClick(newTab);
  };

  return (
    <>
      {template === 'default' && (<TabNavDefault tabsClassName={tabsClassName} tabs={tabs} handleClick={handleClick} currentTab={currentTab} />)}
      {template === 'underline' && (<TabNavUnderline tabsClassName={tabsClassName} tabs={tabs} handleClick={handleClick} currentTab={currentTab} />)}
      <Tab.Container activeKey={currentTab}>
        <Tab.Content className={`${tabsContainerClassName || ''}`}>
          {tabs
            .map((tab, tabIdx) => (
              <Tab.Pane eventKey={tab.key} key={tab.key} mountOnEnter={isLoadedAsync} unmountOnExit={isLoadedAsync}>
                {TabPaneComponents[tabIdx]}
              </Tab.Pane>
            ))}
        </Tab.Content>
      </Tab.Container>
    </>
  );
};

export default TabNav;
