import Select from 'react-select';
import Signal from '@fyclabs/tools-fyc-react/signals/Signal';
import { $form } from '@src/signals';

const $select = Signal({});

const SelectInput = ({
  name,
  signal = $form,
  disabled,
  value,
  variant = 'form-control', // || form-control-border
  className,
  options,
  customOnChange, // ONLY USE IF NEEDED
  notClearable,
  isMulti = false,
  placeholder,
}) => {
  if (!signal || !name) {
    return new Error(`Universal Select has no signal or name (Name: ${name})`);
  }

  const { [name]: isHovered } = $select.value;

  return (
    <div
      onMouseEnter={() => $select.update({ [name]: true })}
      onMouseLeave={() => $select.update({ [name]: false })}
    >
      <Select
        id={name}
        className={`${variant || ''} ${className || ''} ps-0 py-8`}
        value={value || signal.value?.[name]}
        options={options}
        onChange={customOnChange || ((e) => signal.update({ [name]: e }))}
        disabled={disabled}
        isMulti={isMulti}
        isClearable={!notClearable}
        placeholder={placeholder}
        styles={{
          control: (base) => ({
            ...base,
            boxShadow: 'none',
            border: 'none',
            minHeight: '21px',
          }),
          placeholder: (base) => ({
            ...base,
            color: isHovered ? '#373636' : '#777676',
          }),
          valueContainer: (base) => ({
            ...base,
            paddingLeft: '0',
            paddingTop: '0',
            paddingBottom: '0',
            marginLeft: '1rem',
          }),
          singleValue: (base) => ({
            ...base,
            color: 'dark',
          }),
          multiValue: (base) => ({
            ...base,
            backgroundColor: '#EDEDED',
            borderRadius: '10px',
            margin: '0',
            marginRight: '4px',
            height: '21px',
          }),
          multiValueLabel: (base) => ({
            ...base,
            color: 'dark',
            paddingLeft: '10px',
          }),
          multiValueRemove: (base) => ({
            ...base,
            color: 'dark',
            borderRadius: '10px',
            ':hover': {
              backgroundColor: '#EDEDED',
              color: 'dark',
            },
          }),
          input: (base) => ({
            ...base,
            paddingTop: '0',
            paddingBottom: '0',
            marginTop: '0',
            marginBottom: '0',
          }),
          clearIndicator: (base) => ({
            ...base,
            paddingTop: '0',
            paddingBottom: '0',
            paddingRight: '0',
            color: 'dark',
            ':hover': { color: 'dark' },
          }),
          dropdownIndicator: (base) => ({
            ...base,
            paddingTop: '0',
            paddingBottom: '0',
            paddingRight: '0',
            color: 'dark',
            ':hover': { color: 'dark' },
          }),
          indicatorSeparator: (base) => ({
            ...base,
            display: 'none',
          }),
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected ? '#01738F' : '',
            ':hover': { backgroundColor: state.isSelected ? '' : '#B8E7F2' },
          }),
        }}
      />
    </div>
  );
};

export default SelectInput;
