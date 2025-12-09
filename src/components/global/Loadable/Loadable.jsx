import Loader from '@src/components/global/Loader';
import { Placeholder } from 'react-bootstrap';

const Loadable = ({ signal, animation, placeholderType, children, template, className }) => {
  if (!signal) {
    return new Error('SIGNAL REQUIRED FOR LOADABLE');
  }

  if (signal?.value?.isLoading) {
    return (
      <Placeholder as={placeholderType || 'div'} animation={animation || 'glow'} className="mb-0">
        {/* Normal Loadable */}
        {!template && (
          <div className="w-100 d-flex justify-content-center text-primary">
            <div className="spinner-border" />
          </div>
        )}
        {/* Text Loadable */}
        {template === 'text' && (
          <Placeholder xs={12} as={placeholderType || 'p'} className={`${className} text-loadable`} />
        )}
        {/* Component Loadable */}
        {template === 'component' && (
          <Loader className="d-flex align-items-center justify-content-center" />
        )}

        {/* CUSTOM LOADABLES */}

        {/* END CUSTOM LOADABLES */}
      </Placeholder>
    );
  }

  return (<div>{children}</div>);
};

export default Loadable;
