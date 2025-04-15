  import { useState } from "react";
  import { useForm } from "react-hook-form";
  import Cookies from "js-cookie";
  import axios from "axios";
  import Toast from "../../Components/Toast";
  import { useSelector } from "react-redux";
  import {CreateComplaint} from "../../Route"
  import {ArrowRight} from 'lucide-react'
  const CreateComplaints = () => {
      const {
          register,
          handleSubmit,
          formState: { errors },
          reset,
    } = useForm();

    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastIcon, setToastIcon] = useState("");
    const id = useSelector((state) => state.userData._id);

    const url = import.meta.env.VITE_API_BASE_URL;


    const onSubmit = async (data) => {
      const complaintData = {
  
        complain: data.complaint
      };

      setLoading(true);
      try {
        const response = await axios.post(
          `${url}${CreateComplaint}`,
          complaintData,
          {
            headers: {
              "Authorization": `Bearer ${Cookies.get("token")}`,
              "Content-Type": "application/json"
            },
          }
        );

        if (response.status === 200 || response.status === 201) {
          setToastMessage("Complaint submitted successfully");
          setToastIcon("right");
          setShowToast(true);
          reset();
        } else {
          setToastMessage("Failed to submit complaint");
          setToastIcon("wrong");
          setShowToast(true);
        }
      } catch (error) {
        setToastMessage("An error occurred while submitting complaint");
        setToastIcon("wrong");
        setShowToast(true);
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="min-h-full max-w-3xl flex items-center justify-center p-6">
        <div className="h-full w-full space-y-12 bg-white">
          <div className="text-left">
            <h2 className="h2 text-black mt-5 flex flex-col items-start">
              Submit Complaint
            </h2>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-[32px] space-y-10 mb-[16px]"
          >
            <div className="mb-6 w-full">
              <div className="relative w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto">
                <textarea
                  {...register("complaint", {
                    required: "Complaint description is required",
                    minLength: {
                      value: 10,
                      message: "Complaint must be at least 10 characters long"
                    },
                    maxLength: {
                      value: 500,
                      message: "Complaint should not exceed 500 characters"
                    }
                  })}
                  className="w-full px-4 py-2 bg-transparent border-2 border-black-200 text-black-300 focus:outline rounded-lg transition-all"
                  rows="6"
                  placeholder="Enter your complaint here..."
                />
                {errors.complaint && (
                  <p className="text-danger text-sm mt-1">
                    {errors.complaint.message}
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center py-3 px-4 rounded-lg bg-success-500 text-white focus:outline-none hover:scale-105 transition duration-200"
              >

                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white z-50"></div>
                ) : (
                  <>
                    Add
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1" />
                  </>
                )}
              </button>{" "}          
            </div>
          </form>
        </div>
        {showToast && (
          <div className="fixed top-5 right-4 z-50">
            <Toast message={toastMessage} iconName={toastIcon} />
          </div>
        )}
      </div>
    );
  };

  export default CreateComplaints;
