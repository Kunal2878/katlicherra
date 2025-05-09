// import { useState, useEffect} from "react";
// import { LogIn, Mail, Lock } from "lucide-react";
// import Cookies from "js-cookie";
// import { useForm } from "react-hook-form";
// import { toast } from 'react-toastify';
// import { useSelector, useDispatch } from "react-redux";
// import { education,  onboarding } from "../../assets";
// import { Link } from 'react-router-dom';
// import { LoginUser } from '../../service/api';
// import Input from '../Components/Elements/Input';
// import PasswordInput from '../Components/Elements/PasswordInput';

// const Login = () => {
//   const role = useSelector((state) => state.userData.role);

//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm();
//   const [loading, setLoading] = useState(false);
//   const [showToast, setShowToast]=useState(false)
//   const [toastMessage, setToastMessage]=useState('')
//   const [toastType, setToastType]=useState('')
//   const [error, setError] = useState("");
//   const url = import.meta.env.VITE_API_BASE_URL;

//   useEffect(() => {
//     document.title = "Login to Katlicherra Central School";
//     if(role === ""){
//       window.location.href="/user-options"
//     }
//   }, [])

//   useEffect(() => {
//     if (showToast) {
//       toast[toastType](toastMessage, {
//         position: "top-right",
//         autoClose: 3000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//       });
//     }
//   }, [showToast, toastMessage, toastType]);

//   const onSubmit = async (data) => {
//     setLoading(true);
//     setError("");

//     const payload = {
//       email: data.email,
//       password: data.password
//     }

//     const response = await LoginUser(url, payload, role)
    
//     if (response.status === 200 || response.status === 201 || response.status === 204) {
//       Cookies.set(
//         "token", response.data.token
//       );
//       Cookies.set(
//         "user",
//         JSON.stringify(
//           response.data.user
//         ),
//         { expires: 7 }
//       );
      
//       setShowToast(true);
//       setToastMessage(response.message);
//       setToastType("success");

//       setTimeout(() => {
//         window.location.href = "/dashboard";
//       }, 1000);
//     }
//     else {
 
//       setShowToast(true);
//       setToastMessage(response.message);
//       setToastType("error");
      
    
//       reset();
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="flex h-screen max-h-screen">
//       <section className="relative flex-1 overflow-y-auto px-[5%] my-auto">
//         <div className="mx-auto flex size-full flex-col py-10 max-w-[496px]">
//           <img
//             src={education}
//             height={1000}
//             width={1000}
//             alt="education"
//             className="mb-12 h-10 w-fit"
//           />


//           <div>
//             <div className="mb-12 space-y-4 text-left">
//               <h1 className="text-black text-[32px] md:text-[36px] leading-[36px] font-bold">
//                 Hi there 👋
//               </h1>
//               <h2 className="mt-6 text-black">
//                 Get Started with <span className="text-purpleColor">Katlicherra Central School </span>
//                   🚀
//               </h2>
//               {role !== "principal" && (
//                 <span className="text-purpleColor">
//                   Use the same password which was sent to your email before
//                 </span>
//               )}
//             </div>
//           </div>
//           <form onSubmit={handleSubmit(onSubmit)}>
//             <div className="space-y-10">
//               <Input
//                 id="email"
//                 type="email"
//                 label="Email address"
//                 icon={Mail}
//                 register={register}
//                 name="email"
//                 errors={errors}
//                 validation={{
//                   required: "Email is required",
//                   pattern: {
//                     value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
//                     message: "Invalid email address"
//                   }
//                 }}
//               />
              
//               <PasswordInput
//                 id="password"
//                 label="Password"
//                 register={register}
//                 name="password"
//                 errors={errors}
//                 validation={{
//                   required: "Password is required"
//                 }}
//               />
//             </div>

//             {error && (
//               <div className="text-danger text-base text-center">{error}</div>
//             )}

//             <div className="mt-8">
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="group relative w-full flex justify-center py-2 px-4 text-base font-medium rounded-md text-white border-2 bg-success-500 transform transition-all duration-300 hover:scale-105 cursor-pointer"
//               >
//                 <span className="absolute left-0 inset-y-0 flex items-center pl-3">
//                   <LogIn size={24} />
//                 </span>
//                 {loading ? (
//                   <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                 ) : (
//                   <span className="text-lg">Sign in</span>
//                 )}
//               </button>
//             </div>
//             {role === 'principal' && (
//               <div className="text-center text-black my-4">
//                 Don't have an account?{" "}
//                 <Link to="/admin-signup" className="text-purpleColor font-semibold">
//                   Register
//                 </Link>
//               </div>
//             )}
            
//           </form>
//           <div className="text-14-regular mt-20 flex justify-between">
//             <p className="justify-items-end text-black-300 xl:text-left">
//               © 2025 Katlicherra Central School. All rights reserved
//             </p>
//           </div>
//         </div>
//       </section>

//       <img
//         src={onboarding}
//         alt="Knowledge is Liberation"
//         height={1000}
//         width={1000}
//         className="hidden object-cover h-full max-w-[50%] md:block"
//       />
//     </div>
//   );
// };

// export default Login;

import { useState, useEffect} from "react";
import { LogIn, Mail, Lock, IdCard } from "lucide-react";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from "react-redux";
import { education,  onboarding } from "../../assets";
import { Link } from 'react-router-dom';
import { LoginUser } from '../../service/api';
import Input from '../Components/Elements/Input';
import PasswordInput from '../Components/Elements/PasswordInput';

const Login = () => {
  const role = useSelector((state) => state.userData.role);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast]=useState(false)
  const [toastMessage, setToastMessage]=useState('')
  const [toastType, setToastType]=useState('')
  const [error, setError] = useState("");
  const url = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    document.title = "Login to Katlicherra Central School";
    if(role === ""){
      window.location.href="/user-options"
    }
  }, [])

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

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");

    // Create payload based on role
    const payload = role === "student" 
      ? {
          studentId: data.studentId,
          password: data.password
        }
      : {
          email: data.email,
          password: data.password
        };

    const response = await LoginUser(url, payload, role)
    
    if (response.status === 200 || response.status === 201 || response.status === 204) {
      Cookies.set(
        "token", response.data.token
      );
      Cookies.set(
        "user",
        JSON.stringify(
          response.data.user
        ),
        { expires: 7 }
      );
      
      setShowToast(true);
      setToastMessage(response.message);
      setToastType("success");

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);
    }
    else {
 
      setShowToast(true);
      setToastMessage(response.message);
      setToastType("error");
      
    
      reset();
    }
    setLoading(false);
  };

  return (
    <div className="flex h-screen max-h-screen">
      <section className="relative flex-1 overflow-y-auto px-[5%] my-auto">
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
              <h1 className="text-black text-[32px] md:text-[36px] leading-[36px] font-bold">
                Hi there 👋
              </h1>
              <h2 className="mt-6 text-black">
                Get Started with <span className="text-purpleColor">Katlicherra Central School </span>
                  🚀
              </h2>
              {role !== "principal" && (
                <span className="text-purpleColor">
                  Use the same password which was sent to your email before
                </span>
              )}
            </div>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-10">
              {role === "student" ? (
                // Student ID field for student role
                <Input
                  id="studentId"
                  type="text"
                  label="Student ID"
                  icon={IdCard}
                  register={register}
                  name="studentId"
                  errors={errors}
                  validation={{
                    required: "Student ID is required"
                  }}
                />
              ) : (
                // Email field for all other roles
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
                      message: "Invalid email address"
                    }
                  }}
                />
              )}
              
              <PasswordInput
                id="password"
                label="Password"
                register={register}
                name="password"
                errors={errors}
                validation={{
                  required: "Password is required"
                }}
              />
            </div>

            {error && (
              <div className="text-danger text-base text-center">{error}</div>
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
                  <span className="text-lg">Sign in</span>
                )}
              </button>
            </div>
            {role === 'principal' && (
              <div className="text-center text-black my-4">
                Don't have an account?{" "}
                <Link to="/admin-signup" className="text-purpleColor font-semibold">
                  Register
                </Link>
              </div>
            )}
            
          </form>
          <div className="text-14-regular mt-20 flex justify-between">
            <p className="justify-items-end text-black-300 xl:text-left">
              © 2025 Katlicherra Central School. All rights reserved
            </p>
          </div>
        </div>
      </section>

      <img
        src={onboarding}
        alt="Knowledge is Liberation"
        height={1000}
        width={1000}
        className="hidden object-cover h-full max-w-[50%] md:block"
      />
    </div>
  );
};

export default Login;