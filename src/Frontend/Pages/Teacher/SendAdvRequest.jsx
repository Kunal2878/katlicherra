import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { ArrowRight, IndianRupee } from "lucide-react";
import Cookies from "js-cookie";
import { toast } from 'react-toastify';
import { useSelector } from "react-redux";
import { setTransactionUpdate } from "../../../Store/slice";
import {  SendAdvPayReqApi } from '../../../service/api';
import Input from "../../Components/Elements/Input"; 

const AddTransactions = () => {
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");
  
  const user = useSelector((state) => state.userData.user);
  const url = import.meta.env.VITE_API_BASE_URL;
  const dispatch= useDispatch()
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      amount: "",
      date: new Date().toISOString().slice(0, 10)
    }
  });

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

    const transactionData = {
      teacherId: user?._id,
      date: data.date,
      amount: Number(data.amount)
    };

    try {
      const response = await SendAdvPayReqApi(url, transactionData);
      
      if (response.status === 200 || response.status === 201 || response.status === 204) {
        setToastMessage(response.message);
        setToastType("success");
        setShowToast(true);
        dispatch(setTransactionUpdate(true))
        reset();
      } else {
        setToastMessage(response.message);
        setToastType("error");
        setShowToast(true);
      }
    } catch (error) {
      setToastMessage("Error processing transaction");
      setToastType("error");
      setShowToast(true);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-full max-w-3xl flex items-center justify-center p-6">
      <div className="h-full w-full space-y-10 bg-white">
        <div className="text-left">
          <h2 className="h2 text-xl md:text-2xl font-bold text-black-300">
            Request Advance Payment
          </h2>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto">
            <Input
              id="amount"
              name="amount"
              type="number"
              label="Amount"
              register={register}
              errors={errors}
              required={true}
              icon={IndianRupee}
            />
          </div>

          <div className="w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              id="date"
              {...register("date", { required: true })}
              className="w-full p-2 bg-transparent border-2 border-black-200 text-black-300 focus:outline rounded-lg transition-all duration-200"
            />
            {errors.date && (
              <p className="text-danger text-xs mt-1">Date is required</p>
            )}
          </div>

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
                 Submit Request
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

export default AddTransactions;