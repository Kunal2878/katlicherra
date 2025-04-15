  import { useState } from "react";
  import { useForm } from "react-hook-form";
  import Cookies from "js-cookie";
  import { School2, ArrowRight } from "lucide-react";
  import Toast from "../../Components/Toast";
  import axios from "axios";
  import { UpdateClassDetails } from "../../Route";
  import Input from "../../Components/Elements/Input";

  const UpdateClasses = (ClassData) => {
    const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
    } = useForm({
      defaultValues: {
        className: ClassData.className,
        section: ClassData.section,
      }
    });
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastIcon, setToastIcon] = useState("");

    const url = import.meta.env.VITE_API_BASE_URL;
    const token = Cookies.get("token");
    
    const onSubmit = async (data) => {
      const classData = {
        className: data.className,
        section: data.section,
      };
      setLoading(true);
      try {
        const response = await axios.put(
          `${url}${UpdateClassDetails}/:${ClassData.classData._id}`,
          classData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          setToastMessage("Class updated successfully");
          setToastIcon("right");
          setShowToast(true);
          reset();
        } else {
          setToastMessage("Update failed");
          setToastIcon("wrong");
          setShowToast(true);
        }
      } catch (error) {
        console.error(error);
        setToastMessage(error.response.data.message);
        setToastIcon("wrong");
        setShowToast(true);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="min-h-full max-w-3xl flex items-center justify-center p-6">
        {showToast && (
          <div className="fixed">
            <Toast message={toastMessage} iconName={toastIcon} />
          </div>
        )}
        <div className="h-full w-full space-y-12 bg-white">
          <div className="text-left">
            <h2 className="h2 text-black mt-5 flex flex-col items-start">
              Update Class
            </h2>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-8 space-y-10 mb-4"
          >
            <Input
              id="className"
              name="className"
              label="Class Name"
              register={register}
              errors={errors}
              required="Class Name is required"
              placeholder="Enter Class Name"
              icon={School2}
              className="w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto"
            />
        
            <Input
              id="section"
              name="section"
              label="Section"
              register={register}
              errors={errors}
              required="Section is required"
              placeholder="Enter Section"
              icon={School2}
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

  export default UpdateClasses;