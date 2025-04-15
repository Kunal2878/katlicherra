import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useSelector, useDispatch } from "react-redux";
import { setUser ,setShowLogoutConfirm} from "../../Store/slice";
const ConfirmationLogout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const[loading, setLoading] = useState(false)

  return (
    <>
    
        <div
          className={`
            fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center
          `}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-black-300">Confirm Logout</h3>
            <p className="mb-6 text-black-200">Are you sure you want to logout?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  dispatch(setShowLogoutConfirm(false))
                 
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>             
              
               <button
                onClick={() => {
                  setLoading(true)
                  Cookies.remove("token");
                  Cookies.remove("user");
                  window.location.href = "/user-options";
             
                }}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
  
    </>
  );
};

export default ConfirmationLogout;
