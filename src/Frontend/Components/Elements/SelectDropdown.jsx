import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";

const SelectDropdown = ({
  options,
  selectedValue,
  onSelect,
  displayField,
  valueField,
  placeholder = "Select an option",
  icon,
  secondaryField,
  label,
  labelNote,
  required = false,
  multiple = false,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSelect = (value) => {
    if (multiple) {
      const newSelectedValues = Array.isArray(selectedValue) ? [...selectedValue] : [];
      const valueIndex = newSelectedValues.indexOf(value);
      
      if (valueIndex === -1) {
        newSelectedValues.push(value);
      } else {
        newSelectedValues.splice(valueIndex, 1);
      }
      onSelect(newSelectedValues);
    } else {
      onSelect(value);
      setIsDropdownOpen(false);
    }
  };

  const getDisplayText = () => {
    if (!selectedValue) return placeholder;
    if (multiple && Array.isArray(selectedValue)) {
      const selectedOptions = options.filter(
        (option) => selectedValue.includes(option[valueField])
      );
      return selectedOptions.length > 0
        ? selectedOptions.map((option) => option[displayField]).join(", ")
        : placeholder;
    }
    const selectedOption = options.find(
      (option) => option[valueField] === selectedValue
    );
    return selectedOption ? selectedOption[displayField] : placeholder;
  };

  return (
    <div className="relative">
      {label && (
        <label className="text-sm flex flex-row  items-center gap-2 font-medium text-black mb-2">
          {icon && <span className="text-danger  mr-2">{icon}</span>}
          {label} {labelNote && <span className="text-gray-400 flex flex-row  items-center">({labelNote})</span>}
          {required && <span className="text-danger">*</span>}
        </label>
      )}
      <button
        type="button"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="w-full flex items-center justify-between px-2 py-1.5 md:py-2 bg-transparent border-2 border-black-200 text-gray-600 focus:outline rounded-md text-sm md:text-base"
      >
        <div className="flex items-center">
          {icon && <span className="w-4 h-4 md:w-5 md:h-5 mr-2 text-danger">{icon}</span>}
          <span className="text-black">
            {getDisplayText()}
          </span>
        </div>
        <ChevronDown size={24} className="text-black" />
      </button>
      {isDropdownOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
          {options.length > 0 ? (
            options.map((option, index) => (
              <div
                key={index}
                onClick={() => handleSelect(option[valueField])}
                className="flex items-center px-2 md:px-4 py-1.5 md:py-2 hover:bg-gray-100 cursor-pointer text-gray-600 text-sm md:text-base"
              >
                <div
                  className={`w-3 h-3 md:w-4 md:h-4 border rounded mr-2 flex items-center justify-center ${
                    multiple
                      ? Array.isArray(selectedValue) && selectedValue.includes(option[valueField])
                        ? "bg-purpleColor text-white"
                        : "border-gray-300"
                      : selectedValue === option[valueField]
                      ? "bg-purpleColor text-white"
                      : "border-gray-300"
                  }`}
                >
                  {(multiple
                    ? Array.isArray(selectedValue) && selectedValue.includes(option[valueField])
                    : selectedValue === option[valueField]) && (
                    <Check className="w-2 h-2 md:w-3 md:h-3 text-gray-600" />
                  )}
                </div>
                {option[displayField]}
                {secondaryField && ` - ${option[secondaryField]}`}
              </div>
            ))
          ) : (
            <div className="px-4 py-2 text-gray-500 text-sm">No options available</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SelectDropdown;