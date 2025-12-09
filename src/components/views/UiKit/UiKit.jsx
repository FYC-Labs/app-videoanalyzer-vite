import {
  Container,
} from 'react-bootstrap';
import TableOfContents from './_components/TableOfContents';
import Headers from './_components/Headers';
import Buttons from './_components/Buttons';
import Cards from './_components/Cards';
import RowsAndColumns from './_components/RowsAndColumns';
import NavBars from './_components/NavBars';
import NavsAndTabs from './_components/NavsAndTabs';
import UniversalInputs from './_components/UniversalInputs';
import Dropdowns from './_components/Dropdowns';
import Modals from './_components/Modals';
import Images from './_components/Images';
import Tables from './_components/Tables';
import Alerts from './_components/Alerts';
import Badges from './_components/Badges';
import ProgressBars from './_components/ProgressBars';
import Loaders from './_components/Loaders';
import Colors from './_components/Colors';
import Toasts from './_components/Toasts';
import Containers from './_components/Containers';

const UiKit = () => (
  <Container fluid className="bg-white pb-24">
    <h1 className="text-center py-16 text-decoration-underline">Hello, Bootstrap 5 & React-Bootstrap!</h1>
    <h5 className="text-center">Feel free to update these components to match the styles for your app</h5>

    <TableOfContents />
    {/* AFTER */}
    <hr />
    <NavsAndTabs />

    {/* TODO */}
    <Containers />

    {/* <h1>
      App Container
      - Padding
      - margin
      - background-color
      - IF navigation
      - IF footer
    </h1> */}
    <hr />

    {/* TODO */}
    <Colors />
    {/* Simple Color squares */}
    <hr />

    <Headers />
    {/* Match the sizes (
    Add the font size on the text
    ) */}
    <hr />

    <Buttons />
    {/*
      We will add variants to the buttons
      Paddings
      Border Radius
      Size
      Disabled
      Outlined
    */}
    <hr />

    {/* DONE */}
    <Cards />
    <hr />

    {/* TODO */}
    <RowsAndColumns />
    {/* Match padding */}
    <hr />

    {/* TODO */}
    <NavBars />
    {/* Nav Bar and Mobile */}
    <hr />

    {/* TODO */}
    <NavsAndTabs />
    {/* Tab Container */}
    <hr />

    {/* TODO */}
    <UniversalInputs />
    {/*
      React select our new select
    */}
    <hr />

    {/* TODO */}
    <Dropdowns />
    {/*
      Come up with a univeral component for this passing in arrays? variants
    */}
    <hr />

    {/* TODO */}
    <Modals />
    {/*
      Come up with universal Modal to sit on the top of the app
    */}
    <hr />

    {/* TODO */}
    <Images />
    {/*
    i think we re good here
    */}
    <hr />

    {/* TODO */}
    <Tables />
    {/*
      Discussion with Tim
    */}
    <hr />

    {/* TODO */}
    <Alerts />
    {/*
      Set up alert to be as universal as possible
    */}
    <hr />

    {/* TODO */}
    <Badges />
    {/*
      Set up badge to be as universal as possible
    */}
    <hr />

    {/* TODO */}
    <ProgressBars />
    {/*
      Simple
    */}
    <hr />

    {/* TODO */}
    <Loaders />
    {/* Make clickable loader with set time out
     */}
    <hr />

    {/* TODO */}
    <Toasts />
    {/* TOOL TIPS? */}

  </Container>
);

export default UiKit;
