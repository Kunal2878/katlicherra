
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { User, ArrowRight, IndianRupee, MessageCircleQuestion } from "lucide-react";
import Cookies from "js-cookie";
import Toast from "../../Components/Toast";
import { useSelector, useDispatch } from "react-redux";
import { setTeacherData } from "../../../Store/slice";
import { GetTeachers, GetAllTeachersAPI,AddTransactionAPI } from '../../../service/api';
import SelectDropdown from "../../Components/Elements/SelectDropdown"; 
import Input from "../../Components/Elements/Input"; 

const AddTransactions = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm();
  
  // Watch the advancePay checkbox
  const advancePayChecked = watch("advancePay");
  
  const [loading, setLoading] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastIcon, setToastIcon] = useState("");
  const [error, setError] = useState(null);
  
  // Track both the display format for the input and the month name for the API
  const [selectedMonthValue, setSelectedMonthValue] = useState(new Date().toISOString().slice(0, 7));
  const [selectedMonth, setSelectedMonth] = useState(new Date().toLocaleString('default', { month: 'long' }));
  
  const [selectedStatus, setSelectedStatus] = useState("");
  const teachers = useSelector((state) => state.userData.TeacherData);

  const dispatch = useDispatch();
  const url = import.meta.env.VITE_API_BASE_URL;
  const token = Cookies.get("token");

  const statusOptions = [
    { name: "Paid", value: "paid" },
    { name: "Pending", value: "pending" }
  ];

  useEffect(() => {
    const fetchTeachers = async () => {
      const response = await GetAllTeachersAPI(url);
      if (response.status === 200 || response.status === 204 || response.status === 201) {
        dispatch(setTeacherData(response.data.teachers));
      } else {
        setError(response.message);
      }
    };
    if (teachers?.length === 0) {
      fetchTeachers();
    }
  }, []);

  const selectedTeacherData = teachers.find(
    (teacher) => teacher.email === selectedTeacher
  );

  const onSubmit = async (data) => {
    setLoading(true);

    const transactionData = {
      teacher: selectedTeacherData?._id,
      month: selectedMonth,
      status: selectedStatus,
      advancePay: data.advancePay === true,
      advanceAmount: data.advancePay ? Number(data.advanceAmount) : 0
    };
  
    
    try {
      const response = await AddTransactionAPI(url, transactionData, token);
      
      if (response.status === 200 || response.status === 201|| response.status===204) {
        setToastMessage("Transaction added successfully");
        setToastIcon("right");
        setShowToast(true);
        reset();
        setSelectedStatus("");
      } else {
        setToastMessage(response.message || "Failed to add transaction");
        setToastIcon("wrong");
        setShowToast(true);
      }
    } catch (error) {
      setToastMessage("Error adding transaction");
      setToastIcon("wrong");
      setShowToast(true);
    }
    
    setLoading(false);
    setSelectedTeacher("");
    setSelectedStatus("");
    // Reset month to current month
    const currentDate = new Date();
    setSelectedMonthValue(currentDate.toISOString().slice(0, 7));
    setSelectedMonth(currentDate.toLocaleString('default', { month: 'long' }));
  };

  const handleMonthChange = (e) => {
    const dateValue = e.target.value; // This will be in format "2025-03"
    setSelectedMonthValue(dateValue); // Keep the original format for the input element
    
    // Extract month name from the date
    const date = new Date(dateValue + "-01"); // Add day to make a valid date
    const monthName = date.toLocaleString('default', { month: 'long' }); // Gets "March"
    
    setSelectedMonth(monthName); // Save just the month name for your API
  };

  const handleStatusChange = (value) => {
    setSelectedStatus(value);
    setValue("status", value);
  };

  return (
    <div className="min-h-full max-w-3xl flex items-center justify-center p-6">
      {showToast && (
        <div className="fixed z-100">
          <Toast message={toastMessage} iconName={toastIcon} />
        </div>
      )}
      <div className="h-full w-full space-y-8 bg-white">
        <div className="text-left">
          <h2 className="h2 text-xl md:text-2xl font-bold text-black-300">
            Add New Transaction
          </h2>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto">
            <SelectDropdown
              options={teachers || []}
              selectedValue={selectedTeacher}
              onSelect={setSelectedTeacher}
              displayField="name"
              valueField="email"
              placeholder="Select Teacher"
              icon={<User size={20} />}
              secondaryField="email"
              required={true}
            />
          </div>

          <div className="w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto">
            <input
              type="month"
              value={selectedMonthValue}
              onChange={handleMonthChange}
              className="w-full p-2 pl-10 bg-transparent border-2 border-black-200 text-black-300 focus:outline rounded-lg transition-all duration-200 [color-scheme:light]"
            />
          </div>

          <div className="w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto">
            <SelectDropdown
              options={statusOptions}
              selectedValue={selectedStatus}
              onSelect={handleStatusChange}
              displayField="name"
              valueField="value"
              placeholder="Select Status"
              icon={<MessageCircleQuestion size={20} />}
              required={true}
            />
          </div>

          <div className="w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto flex items-center">
            <input
              type="checkbox"
              id="advancePay"
              {...register("advancePay")}
              className="mr-2"
            />
            <label htmlFor="advancePay" className="text-black-300">Advance Pay</label>
          </div>

          {/* Only show advance amount field if advancePay is checked */}
          {advancePayChecked && (
            <div className="w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto">
              <Input
                id="advanceAmount"
                name="advanceAmount"
                type="number"
                label="Advance Amount"
                register={register}
                errors={errors}
                required={true}
                icon={IndianRupee}
              />
            </div>
          )}

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
                  Add Transaction
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