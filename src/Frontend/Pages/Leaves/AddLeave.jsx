  import { useState,useEffect  } from "react";
  import { useForm } from "react-hook-form";
  import Cookies from "js-cookie";
  import { ArrowRight,User,FileText,Mail } from "lucide-react";

  import Input from "../../Components/Elements/Input";
  import {SendLeaveAPI} from "../../../service/api"
  import { toast } from 'react-toastify';
  const AddLeaves = () => {
    const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
    } = useForm({
    });
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("");

    const url = import.meta.env.VITE_API_BASE_URL;
    const token = Cookies.get("token");
    

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
      const leaveData = {
        teacherName: data.teacherName,
        email: data.email,
        type:data.type
      };
      setLoading(true);
    
        const response = await SendLeaveAPI(url,leaveData)

        if (response.status === 200 || response.status === 201 ||response.status === 204) {
          setToastMessage(response.message);
          setToastType("success");
          setShowToast(true);
          reset();
        } else {
          setToastMessage(response.message);
          setToastType("error");
          setShowToast(true);
        }
        setLoading(false);   
      } 

    

    return (
      <div className="min-h-full max-w-3xl flex items-center justify-center p-6">
        <div className="h-full w-full space-y-12 bg-white">
          <div className="text-left">
            <h2 className="h2 text-black mt-5 flex flex-col items-start">
             Add Leave
            </h2>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-8 space-y-10 mb-4"
          >
            <Input
              id="teacherName"
              name="teacherName"
              label="Teacher Name"
              register={register}
              errors={errors}
              required="Name is required"
              placeholder="Enter your Name"
              icon={User}
              className="w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto"
            />
        
        <Input
            id="email"
            name="email"
            label="Email"
            register={register}
            errors={errors}
            required="Email is required"
            type="email"
            placeholder="Email Address"
            icon={Mail}
            validation={{
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            }}
            className="w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto"
          />
        
        <Input
              id="type"
              name="type"
              label="Leave Type"
              register={register}
              errors={errors}
              required="Leave typy is required"
              placeholder="Enter type of Leave"
              icon={FileText}
              className="w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto"
            />
            <div className="w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center py-3 px-4 rounded-lg bg-success-500 text-white focus:outline-none hover:scale-105 transition duration-200"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    Update
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  export default AddLeaves;