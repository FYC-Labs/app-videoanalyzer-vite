import UniversalInput from '@src/components/global/Inputs/UniversalInput';
import { $form } from '@src/signals';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const Search = ({
  signal = $form,
  name = 'localSearch', // because 'search' is already reserved for nav search in $form
  placeholder = 'Search',
  bg = 'white',
  containerClassName = '',
  inputClassName = '',
  hidden = false,
}) => (
  <div
    className={`d-flex align-items-center border border-primary-500 bg-${bg} ps-0 pe-8 ${containerClassName}`}
    style={{ borderRadius: '10px' }}
    hidden={hidden}
  >
    <UniversalInput
      name={name}
      signal={signal}
      type="text"
      placeholder={placeholder}
      className={`border-0 bg-${bg} ${inputClassName}`}
    />
    <FontAwesomeIcon icon={faSearch} />
  </div>
);

export default Search;
