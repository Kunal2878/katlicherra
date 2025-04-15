import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Mail, Lock, User, Eye, EyeOff, CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import { education, onboarding} from "../../../assets";
import Input from '../../Components/Elements/Input';
import PasswordInput from '../../Components/Elements/PasswordInput';
import { RegisterPrincipalAccount } from '../../../service/api';
import { useSelector, useDispatch } from "react-redux";

const RegisterPrincipal = () => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast]=useState(false)
  const [toastMessage, setToastMessage]=useState('')
  const [toastType, setToastType]=useState('')

  const url = import.meta.env.VITE_API_BASE_URL;
  const role = useSelector((state) => state.userData.role);

  useEffect(() => {
    document.title = "Create Your Account";
    if(role === ""){

      window.location.href="/user-options"
    }
}, []);




  const onSubmit = async (data) => {
    setLoading(true);

    const response = await RegisterPrincipalAccount(url, data);


 
      if (response.status === 200 || response.status === 204 || response.status === 201) {
        setShowToast(true);
        setToastMessage(response.message);
        setToastType("success");
        setTimeout(() => {
                  window.location.href = "/login";
                }, 2000);
        
      } 
    else {
      setShowToast(true);
      setToastMessage(response.message);
      setToastType("error");
      setTimeout(() => {
      }, 2000);
      reset();
     
    }
    setLoading(false);
  };
  useEffect(() => {
    if (showToast) {
      toast[toastType](toastMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }, [showToast, toastMessage, toastType]);


  return (
    <div className="flex h-screen overflow-hidden">
      <section className="flex-1 relative">
        <div className="h-screen overflow-y-auto px-[5%] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full">
          <div className="mx-auto flex size-full flex-col py-10 max-w-[496px]">
            <img
              src={education}
              height={1000}
              width={1000}
              alt="education"
              className="mb-12 h-10 w-fit"
            />

            <div>
              <div className="mb-12 space-y-4 text-left">
                <h1 className="text-[32px] md:text-[36px] leading-[36px] font-bold">
                  Welcome 👋
                </h1>
                <h2 className="mt-6 text-black">
                  Get Started with <span className="text-purpleColor">Katlicherra Central School </span>
                   🚀
                </h2>
                <p className="text-black-300">
                  <i>
                    Be the part of Katlicherra Central School! The perfect platform to shape the future
                    of education
                  </i>
                </p>
              </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-10">
                <Input
                  id="fullName"
                  type="text"
                  label="Full Name"
                  icon={User}
                  register={register}
                  name="name"
                  errors={errors}
                  validation={{
                    required: "Name is required"
                  }}
                />

                <Input
                  id="email"
                  type="email"
                  label="Email address"
                  icon={Mail}
                  register={register}
                  name="email"
                  errors={errors}
                  validation={{
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  }}
                />

                <Input
                  id="experience"
                  type="number"
                  label="Experience (in years)"
                  icon={CalendarDays}
                  register={register}
                  name="experience"
                  errors={errors}
                  validation={{
                    required: "Experience is required",
                    min: {
                      value: 0,
                      message: "Experience cannot be negative",
                    },
                  }}
                />

                <PasswordInput
                  id="password"
                  label="Password"
                  register={register}
                  name="password"
                  errors={errors}
                  validation={{
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  }}
                />

                <PasswordInput
                  id="confirmPassword"
                  label="Confirm Password"
                  register={register}
                  name="confirmPassword"
                  errors={errors}
                  validation={{
                    required: "Please confirm your password",
                    validate: (val) => {
                      if (watch("password") != val) {
                        return "Passwords do not match";
                      }
                    },
                  }}
                />
              </div>

              <div className="mt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-2 px-4 text-base font-medium rounded-md text-white border-2 bg-success-500 transform transition-all duration-300 hover:scale-105 cursor-pointer"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <span className="text-lg">Register</span>
                  )}
                </button>
              </div>

              <div className="text-center text-black my-4">
                Already have an account?{" "}
                <Link to="/login" className="text-purpleColor font-semibold">
                  Login
                </Link>
              </div>
            </form>

            <div className="text-14-regular mt-20 flex justify-between pb-16 lg:pb-18">
              <p className="justify-items-end text-black-300 xl:text-left">
                © 2025 Katlicherra Central School. All rights reserved
              </p>
            </div>
          </div>
        </div>
      </section>

      <img
        src={onboarding}
        alt="Knowledge is Liberation"
        height={1000}
        width={1000}
        className="hidden object-cover h-screen max-w-[50%] md:block"
      />
    </div>
  );
};
export default RegisterPrincipal;