/* eslint-disable implicit-arrow-linebreak */
import useWindowSize from '@src/utils/windowSize';
import { Badge, Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import { auth } from '@src/utils/firebase';
import { $global } from '@src/signals';
import { getCurrentAuthenticatedUser, handleFirebaseLogin, handleFirebaseLogout } from '@src/utils/auth';
import Loadable from '../Loadable';

const AppWrapper = () => {
  const { breakPoint } = useWindowSize();

  auth.onAuthStateChanged(async (fbUser) => {
    $global.update({
      isLoading: true,
    });
    if (fbUser) {
      await handleFirebaseLogin(fbUser);
      await getCurrentAuthenticatedUser();
    } else if ($global.value.isSignedIn) {
      await handleFirebaseLogout();
    }

    $global.update({
      isLoading: false,
    });
  });
  return (
    <Container fluid className="p-0">
      {import.meta.env.VITE_DEV_IS_BREAKPOINT_VISABLE === 'true' && (
      <Badge bg="primary" className="breakpointBadge">
        {breakPoint}
      </Badge>
      )}
      <Loadable signal={$global}>
        <Outlet />
      </Loadable>
    </Container>
  );
};

export default AppWrapper;
