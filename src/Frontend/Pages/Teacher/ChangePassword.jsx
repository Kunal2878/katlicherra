import { useState } from "react";
import { Lock, RefreshCw,LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import axios from "axios";
import Toast from "../../Components/Toast";
import PasswordInput from '../../Components/Elements/PasswordInput';
import {useSelector} from 'react-redux'
const PasswordChange = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastIcon, setToastIcon] = useState("");
  const url = import.meta.env.VITE_API_BASE_URL;
  const user = useSelector((state) => state.userData.user);
  const onSubmit = async (data) => {
    setLoading(true);
    setError("");

    const payload = {
      oldPassword: data.oldPassword,
      newPassword: data.newPassword
    };

    try {
      const token = Cookies.get("token");
      
      if (!token) {
        setError("Authentication required. Please log in again.");
        setLoading(false);
        return;
      }

      const response = await axios.post(`${url}${user?.role}/change-password`, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 200 || response.status === 201 || response.status === 204) {
        setToastMessage("Password changed successfully!"), setToastIcon("right");
        setShowToast(true);
        reset();
      } else {
        setToastMessage(response.data.message || "Failed to change password"),
        setToastIcon("wrong");
        setShowToast(true);
      }
    } catch (error) {
      setToastMessage(error.response?.data?.message || "An error occurred. Please try again."),
      setToastIcon("wrong");
      setShowToast(true);
    }
    
    setLoading(false);
  };

  return (
    <div className="flex-1 overflow-y-auto px-[5%] my-auto">
      {showToast && <Toast message={toastMessage} iconName={toastIcon} />}
      <div className="mx-auto flex size-full flex-col py-10 max-w-[496px]">
        <div>
          <div className="mb-12 space-y-4 text-left">
            <h1 className="text-black text-[32px] md:text-[36px] leading-[36px] font-bold">
              Change Password
            </h1>
            <h2 className="mt-6 text-black">
              Update your <span className="text-purpleColor">Katlicherra Central School</span>
              password 🔐
            </h2>
          </div>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-10">
            <PasswordInput
              id="oldPassword"
              label="Current Password"
              register={register}
              name="oldPassword"
              errors={errors}
              validation={{
                required: "Current password is required"
              }}
            />
            
            <PasswordInput
              id="newPassword"
              label="New Password"
              register={register}
              name="newPassword"
              errors={errors}
              validation={{
                required: "New password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters"
                }
              }}
            />
          </div>

          {error && (
            <div className="text-danger text-base text-center mt-4">{error}</div>
          )}

          <div className="mt-8">
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 text-base font-medium rounded-md text-white border-2 bg-success-500 transform transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <LogIn size={24} />
              </span>
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <span className="text-lg">Change Password</span>
              )}
            </button>
          </div>
        </form>
        
      </div>
    </div>
  );
};

export default PasswordChange;