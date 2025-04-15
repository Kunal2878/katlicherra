
import React, { useState, useEffect } from 'react';
import { X, Check, XCircle, Loader, AlertCircle } from 'lucide-react';
import { setShowConfirmationModel, setConfirmRequest } from "../../../Store/slice";
import { useSelector, useDispatch } from "react-redux";

const Confirmation = ({ message, note }) => {
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const dispatch = useDispatch();
  const status = useSelector((state) => state.userData.status);
  const addText = useSelector((state) => state.userData.addText);
  const confirmRequest = useSelector((state) => state.userData.confirmRequest);

  useEffect(() => {
    // Animation effect for modal entry
    setIsVisible(true);
    return () => setIsVisible(false);
  }, []);

  const closeModal = () => {
    setIsVisible(false);
    setTimeout(() => {
      dispatch(setShowConfirmationModel(false));
      dispatch(setConfirmRequest(false));
      
    }, 300);
  };

  const handleConfirm = async () => {
    dispatch(setConfirmRequest(true));
  };

  // Status-specific styling
  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <Check className="text-green-400" size={50} />;
      case 'error':
        return <XCircle className="text-red-400" size={50} />;
      default:
        return <AlertCircle className="text-yellow-400" size={50} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300">
      <div 
        className={`w-11/12 sm:w-96 md:w-96 lg:w-96 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} transition-all duration-300 ease-in-out`}
      >
        <div 
          className="relative rounded-xl overflow-hidden shadow-2xl"
          style={{
            background: 'linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 100%)'
          }}
        >
          {/* Top decorative bar */}
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600"></div>
          
          <div className="p-6">
            <button
              onClick={closeModal}
              className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors duration-200"
              aria-label="Close"
            >
              <X size={22} />
            </button>

            <div className="flex flex-col items-center text-center mb-6 mt-3 pt-4">
              {status ? (
                <div className="mb-4 flex flex-col items-center">
                  <div className="p-3 rounded-full bg-opacity-20 mb-4">
                    {getStatusIcon()}
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    {status === 'success' ? 'Success!' : 'Error!'}
                  </h3>
                </div>
              ) : (
                <>
                  <div className="p-3 rounded-full bg-opacity-20 mb-4">
                    <AlertCircle size={50} className="text-yellow-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {message ? message.split('?')[0] + '?' : "Confirmation Required"}
                  </h3>
                  {message && message.includes('?') && (
                    <p className="text-danger text-sm">
                      {message.split('?')[1].trim()}
                    </p>
                  )}
                </>
              )}
              
              {note && !status && (
                <p className="text-gray-300 text-sm mb-2 mt-2"><strong>Note: </strong>{note}</p>
              )}
              
              {addText && (
                <p className={`text-sm ${status === 'success' ? 'text-green-400' : 'text-red-400'} mt-2`}>
                  {addText}
                </p>
              )}
            </div>

            <div className="flex justify-center gap-4 mt-2">
              {!status && (
                <>
                  
                  <button
                    onClick={handleConfirm}
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-colors duration-200 flex items-center justify-center min-w-24 font-medium"
                    disabled={confirmRequest && !status}
                  >
                    {(confirmRequest && !status) ? (
                      <Loader className="animate-spin" size={20} />
                    ) : (
                      'Confirm'
                    )}
                  </button>
                </>
              )}
              
              {status && (
                <button
                  onClick={closeModal}
                  className="px-8 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-colors duration-200 font-medium"
                >
                  Close
                </button>
              )}
            </div>
          </div>
          
          {/* Bottom decorative bar */}
          <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-purple-500 to-blue-500"></div>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;