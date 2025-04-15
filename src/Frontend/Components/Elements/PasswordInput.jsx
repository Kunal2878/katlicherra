
import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

const PasswordInput = ({
  id,
  name,
  label,
  register,
  errors,
  validation = {},
  className = '',
  watch = null,
  watchField = null,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`relative w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto mb-6 ${className}`}>
      {/* Added mb-6 to make space for the absolutely positioned error message */}
      <div className="relative">
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          placeholder={label}
          className="w-full px-4 py-2 bg-transparent border-2 border-black-200 text-black-300 focus:outline rounded-lg transition-all peer placeholder-transparent"
          {...register(name, validation)}
        />
        
        <label
          htmlFor={id}
          className="absolute left-2 -top-6 text-sm flex items-center gap-2 font-medium text-black transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-focus:-top-6 peer-focus:text-sm"
        >
          <span className="text-danger">
            <Lock size={20} />
          </span>
          {label}
        </label>
        
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-500"
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      </div>
      
      {/* Absolutely positioned error message */}
      {errors[name] && (
        <p className=" w-full flex flex-row justify-center absolute text-danger text-sm left-0 bottom-0 transform translate-y-full">
          {errors[name].message}
        </p>
      )}
    </div>
  );
};

export default PasswordInput;