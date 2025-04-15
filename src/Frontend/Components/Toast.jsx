import React, { useEffect, useState } from "react";
import { CircleCheckBig, XCircle } from "lucide-react";

const Toast = ({ message, iconName }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="z-100 fixed bottom-5 right-5 flex items-center animate-fade-in-up">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-sm w-full mx-4 md:mx-0 transform transition-all duration-300 ease-in-out hover:scale-105">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            {iconName === "right" ? (
              <CircleCheckBig className="text-2xl text-green-500" />
            ) : (
              <XCircle className="text-2xl text-danger" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toast;
