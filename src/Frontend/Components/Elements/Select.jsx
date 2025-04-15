import React from 'react';

const Select = ({
  name,
  value,
  onChange,
  onBlur,
  options,
  label,
  icon: Icon,
  placeholder,
  required = false,
  error,
  helpText,
  className = '',
  disabled = false
}) => {
  return (
    <div className={`relative mb-6 ${className}`}>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        className={`w-full px-3 py-2 border-2 bg-transparent rounded-md transition-all ${
          error ? 'border-danger text-danger' : 'border-black-300 text-gray-600'
        } focus:outline`}
        required={required}
      >
        <option value="">{placeholder || 'Select an option'}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {label && (
        <label 
          htmlFor={name} 
          className="absolute left-2 -top-6 text-sm flex items-center gap-2 font-medium text-black transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-focus:-top-6 peer-focus:text-sm"
        >
          {Icon && (
            <span className="text-danger">
              <Icon size={20} />
            </span>
          )}
          {label} {helpText && <span className='text-gray-400'>({helpText})</span>}
        </label>
      )}
      
      {error && (
        <p className="mt-1 text-xs text-danger">{error}</p>
      )}
    </div>
  );
};

export default Select;