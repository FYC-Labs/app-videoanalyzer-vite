import { Navigate, Outlet } from 'react-router-dom';
import { $auth } from '@fyclabs/tools-fyc-react/signals';
import ContentWrapper from '../ContentWrapper';

const PublicRoutes = () => {
  if ($auth.value.isSignedIn && !$auth.value.isLoading) {
    return <Navigate to={`/?redirect=${window.location.pathname}`} />;
  }
  return (
    <ContentWrapper>
      <Outlet />
    </ContentWrapper>
  );
};

export default PublicRoutes;
