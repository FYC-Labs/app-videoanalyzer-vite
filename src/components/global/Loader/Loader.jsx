const Loader = ({ message = '', className }) => (
  <div className={className}>
    <h4 className="mt-16">{message ?? 'Loading...'}</h4>
  </div>
);

export default Loader;
