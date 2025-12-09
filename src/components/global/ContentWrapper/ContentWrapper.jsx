/* eslint-disable implicit-arrow-linebreak */
import { $auth } from '@fyclabs/tools-fyc-react/signals';
import { Container } from 'react-bootstrap';
import Loader from '@src/components/global/Loader';

const ContentWrapper = ({ children, className, fluid }) => {
  if ($auth.value?.isLoading) {
    return (
      <div>
        <div className="min-vh-100 w-100 d-flex justify-content-center align-items-center flex-grow-1">
          <Loader
            message={$auth.value?.isLoadingMessage ?? 'Loading...'}
            className="text-center"
          />
        </div>
      </div>
    );
  }
  return (
    <div>
      <Container fluid={!!fluid} className={className}>
        {children}
      </Container>
    </div>
  );
};

export default ContentWrapper;
