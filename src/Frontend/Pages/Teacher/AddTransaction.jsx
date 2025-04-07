
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { User, ArrowRight, IndianRupee, MessageCircleQuestion } from "lucide-react";
import Cookies from "js-cookie";
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from "react-redux";
import { setTeacherData,setTransactionUpdate } from "../../../Store/slice";
import { GetAllTeachersAPI,AcceptRejectPayReqAPI } from '../../../service/api';
import SelectDropdown from "../../Components/Elements/SelectDropDownList"; 
import Input from "../../Components/Elements/Input"; 

const AddTransactions = () => {
  const [loading, setLoading] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");
  const [error, setError] = useState(null);
  
  // Track both the display format for the input and the month name for the API
  const [selectedMonthValue, setSelectedMonthValue] = useState(new Date().toISOString().slice(0, 7));
  const [selectedMonth, setSelectedMonth] = useState(new Date().toLocaleString('default', { month: 'long' }));
  
  const [selectedStatus, setSelectedStatus] = useState("");
  const [advanceStatus, setAdvanceStatus] = useState("");
  const [baseSalary, setBaseSalary] = useState("");
  const teachers = useSelector((state) => state.userData.TeacherData);

  const dispatch = useDispatch();
  const url = import.meta.env.VITE_API_BASE_URL;
  const token = Cookies.get("token");
  
  const statusOptions = [
    { name: "Paid", value: "paid" },
    { name: "Unpaid", value: "unpaid" }
  ];
  const AdvstatusOptions = [
    { name: "Approved", value: "approved" },
    { name: "Rejected", value: "rejected" }
  ];

  const selectedTeacherData = teachers.find(
    (teacher) => teacher.email === selectedTeacher
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm({
    defaultValues: {
      baseSalary: "",
    }
  });
  
  const advancePayChecked = watch("advancePay");
  const salaryPayChecked = watch("salaryPay");

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


  const fetchTeachers = async () => {
    const response = await GetAllTeachersAPI(url);
    if (response.status === 200 || response.status === 204 || response.status === 201) {
      dispatch(setTeacherData(response.data.teachers));
    } else {
      setToastMessage(response.message);
      setToastType("error");
      setShowToast(true);
      setError(response.message);
    }
  };
  
  useEffect(() => {
    if (teachers?.length === 0) {
      fetchTeachers();
    }
  }, [teachers]);

  // Update baseSalary when a teacher is selected
  useEffect(() => {
    if (selectedTeacherData?.salary) {
      setBaseSalary(selectedTeacherData.salary);
      setValue("baseSalary", selectedTeacherData.salary);
    }
  }, [selectedTeacherData, setValue]);

  const onSubmit = async (data) => {
if (!salaryPayChecked && !advancePayChecked) {
  setToastMessage("Please select at least one payment type.");
  setToastType("error");
  setShowToast(true);
  return;
}

    setLoading(true);
    const transactionData = {
      Id: selectedTeacherData?._id,
      month: selectedMonth,
      Salarystatus: selectedStatus,
      AdvStatus :advanceStatus,
      advancePay: data.advancePay === true,
      advanceAmount: data.advancePay ? Number(data.advanceAmount) : 0,
      baseSalary: Number(data.baseSalary)
    };
    const type = advancePayChecked && salaryPayChecked ? "both" : advancePayChecked ? "adv" : "salary";

      const response = await AcceptRejectPayReqAPI(url, transactionData,type);
      
      if (response.status === 200 || response.status === 201 || response.status === 204) {
        setToastMessage(response.message);
      setToastType("success");
      setShowToast(true);
        reset();
        dispatch(setTransactionUpdate(true))
        setSelectedStatus("");
        setBaseSalary("");
      } else {
        setToastMessage(response.message);
        setToastType("error");
        setShowToast(true);
      }
  
    
    setLoading(false);
    setSelectedTeacher("");
    setSelectedStatus("");
    setAdvanceStatus("");
    // Reset month to current month
    const currentDate = new Date();
    setSelectedMonthValue(currentDate.toISOString().slice(0, 7));
    setSelectedMonth(currentDate.toLocaleString('default', { month: 'long' }));
  };

  const handleMonthChange = (e) => {
    const dateValue = e.target.value; 
    setSelectedMonthValue(dateValue); 
    // This will be in format "2025-03"
    // Keep the original format for the input element
    
    // Extract month name from the date
    const date = new Date(dateValue + "-01"); // Add day to make a valid date
    const monthName = date.toLocaleString('default', { month: 'long' }); // Gets "March"
    
    setSelectedMonth(monthName); // Save just the month name for your API
  };

  const handleStatusChange = (value) => {
    setSelectedStatus(value);
    setValue("status", value);
  };
  const handleAdvanceStatusChange = (value) => {
    setAdvanceStatus(value);
    setValue("advanceStatus", value);
  };

  const handleBaseSalaryChange = (e) => {
    const value = e.target.value;
    setBaseSalary(value);
    setValue("baseSalary", value);
  };

  return (
    <div className="min-h-full max-w-3xl flex items-center justify-center p-6">
      <div className="h-full w-full space-y-10 bg-white">
        <div className="text-left">
          <h2 className="h2 text-xl md:text-2xl font-bold text-black-300">
            Add New Transaction
          </h2>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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
              required
              value={selectedMonthValue}
              onChange={handleMonthChange}
              className="w-full p-2 pl-10 bg-transparent border-2 border-black-200 text-black-300 focus:outline rounded-lg transition-all duration-200 [color-scheme:light]"
            />
          </div>
          
          <div className="w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto">
            <Input
              id="baseSalary"
              name="baseSalary"
              type="number"
              label="Base Salary"
              value={baseSalary}
              onChange={handleBaseSalaryChange}
              errors={errors}
              required={true}
              icon={IndianRupee}
            />
          </div>

          <div className="w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto flex items-center">
            <input
              type="checkbox"
              id="salaryPay"
              {...register("salaryPay")}
              className=" size-3 mr-2"
            />
            <label htmlFor="salaryPay" className="text-black-300">Salary Pay Status</label>
          </div>

{
  salaryPayChecked &&(

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

  )
}

          <div className="w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto flex items-center">
            <input
              type="checkbox"
              id="advancePay"
              {...register("advancePay")}
              className="size-3 mr-2"
            />
            <label htmlFor="advancePay" className="text-black-300">Advance Pay Status</label>
          </div>

          {/* Only show advance amount field if advancePay is checked */}
          {advancePayChecked && (
            <>
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
               <div className="w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto">
               <SelectDropdown
                 options={AdvstatusOptions}
                 selectedValue={advanceStatus}
                 onSelect={handleAdvanceStatusChange}
                 displayField="name"
                 valueField="value"
                 placeholder="Select Advance Pay Status"
                 icon={<MessageCircleQuestion size={20} />}
                 required={true}
               />
             </div>
             </>

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