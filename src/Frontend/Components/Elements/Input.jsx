
  // import React from 'react';

  // const Input = ({
  //   id,
  //   name,
  //   label,
  //   register,
  //   errors = {},
  //   required = false,
  //   type = 'text',
  //   placeholder = '',
  //   icon: Icon,
  //   validation = {},
  //   value,
  //   onChange,
  //   className = '',
  // }) => {
  //   // Combine default validation with passed validation
  //   const validationRules = {
  //     ...(required ? { required: typeof required === 'string' ? required : `${label} is required` } : {}),
  //     ...validation,
  //   };
  
  //   // Determine if we should use register or value/onChange
  //   const isControlled = value !== undefined && onChange !== undefined;
  
  //   return (
  //     <div className={`relative w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto ${className}`}>
  //       {isControlled ? (
  //         // Controlled input (for student inputs)
  //         <input
  //           id={id}
  //           type={type}
  //           value={value}
  //           onChange={onChange}
  //           placeholder={placeholder || label}
  //           className="w-full px-4 py-2 bg-transparent border-2 border-black-200 text-black-300 focus:outline rounded-lg transition-all peer placeholder-transparent"
  //         />
  //       ) : (
  //         // Uncontrolled input (for react-hook-form)
  //         <input
  //           id={id}
  //           type={type}
  //           placeholder={placeholder || label}
  //           className="w-full px-4 py-2 bg-transparent border-2 border-black-200 text-black-300 focus:outline rounded-lg transition-all peer placeholder-transparent"
  //           {...(register ? register(name, validationRules) : {})}
  //         />
  //       )}
      
  //       <label
  //         htmlFor={id}
  //         className="absolute left-2 -top-6 text-sm flex items-center gap-2 font-medium text-black transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-focus:-top-6 peer-focus:text-sm"
  //       >
  //         {Icon && (
  //           <span className="text-danger">
  //             <Icon size={20} />
  //           </span>
  //         )}
  //         {label}
  //       </label>
      
  //       {/* Absolute positioned error message */}
  //       {errors && errors[name] && (
  //         <p className="w-full flex flex-row justify-center items-center absolute text-danger text-sm -bottom-5  left-0">
  //           {errors[name].message}
  //         </p>
  //       )}
  //     </div>
  //   );
  // };
  
  // export default Input;

  import React from 'react';

const Input = ({
  id,
  name,
  label,
  register,
  errors = {},
  required = false,
  type = 'text',
  placeholder = '',
  icon: Icon,
  validation = {},
  value,
  onChange,
  className = '',
  disabled = false, // Added disabled prop with default value false
}) => {
  // Combine default validation with passed validation
  const validationRules = {
    ...(required ? { required: typeof required === 'string' ? required : `${label} is required` } : {}),
    ...validation,
  };

  // Determine if we should use register or value/onChange
  const isControlled = value !== undefined && onChange !== undefined;

  // Common input props
  const inputProps = {
    id,
    type,
    placeholder: placeholder || label,
    disabled, // Add disabled attribute
    className: `w-full px-4 py-2 bg-transparent border-2 ${
      disabled ? 'border-gray-300 bg-gray-100 cursor-not-allowed' : 'border-black-200'
    } text-black-300 focus:outline rounded-lg transition-all peer placeholder-transparent`,
  };

  return (
    <div className={`relative w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto ${className}`}>
      {isControlled ? (
        // Controlled input (for student inputs)
        <input
          {...inputProps}
          value={value}
          onChange={onChange}
        />
      ) : (
        // Uncontrolled input (for react-hook-form)
        <input
          {...inputProps}
          {...(register ? register(name, validationRules) : {})}
        />
      )}
    
      <label
        htmlFor={id}
        className={`absolute left-2 -top-6 text-sm flex items-center gap-2 font-medium ${
          disabled ? 'text-gray-500' : 'text-black'
        } transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-focus:-top-6 peer-focus:text-sm`}
      >
        {Icon && (
          <span className={disabled ? "text-gray-500" : "text-danger"}>
            <Icon size={20} />
          </span>
        )}
        {label}
      </label>
    
      {/* Absolute positioned error message */}
      {errors && errors[name] && (
        <p className="w-full flex flex-row justify-center items-center absolute text-danger text-sm -bottom-5 left-0">
          {errors[name].message}
        </p>
      )}
    </div>
  );
};

export default Input;