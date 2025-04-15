import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import {
  User,
  Mail,
  ArrowRight,
  Calendar,
  DollarSign,
  CreditCard,
} from "lucide-react";
import Cookies from "js-cookie";
import Toast from "../../Components/Toast";
import { useSelector, useDispatch } from "react-redux";
import { setTeacherData } from "../../../Store/slice";
import { GetTeachers, AddTransactionAPI } from '../../../service/api';
import SelectDropdown from "../../Components/Elements/SelectDropDownList"; 
import Input from "../../Components/Elements/Input"; 

const AddTransactions = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastIcon, setToastIcon] = useState("");
  const [error, setError] = useState(null);
  const [advancePay, setAdvancePay] = useState(false);
  const teachers = useSelector((state) => state.userData.TeacherData);

  const dispatch = useDispatch();
  const url = import.meta.env.VITE_API_BASE_URL;
  const token = Cookies.get("token");

  useEffect(() => {
    const fetchTeachers = async () => {
      const response = await GetTeachers(url);
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

  const onSubmit = async (data) => {
    setLoading(true);

    const selectedTeacherData = teachers.find(
      (teacher) => teacher.email === selectedTeacher
    );

    const paymentData = {
      teacher: selectedTeacherData._id,
      month: data.month,
      status: data.status,
      advancePay: advancePay,
      advanceAmount: advancePay ? Number(data.advanceAmount) : 0,
    };

    const response = await AddTransactionAPI(url, paymentData, token);

    if (response.status === 200 || response.status === 201 || response.status === 204) {
      setToastMessage(response.message);
      setToastIcon("right");
      setShowToast(true);
      reset();
    } else {
      setToastMessage(response.message);
      setToastIcon("wrong");
      setShowToast(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen sm:px-16 px-6 sm:py-16 py-10 w-full">
      {showToast && (
        <div className="fixed">
          <Toast message={toastMessage} iconName={toastIcon} />
        </div>
      )}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-4xl mx-auto bg-white rounded-lg p-2 transition-all duration-300"
      >
        <h2 className="h2 text-xl md:text-2xl text-left font-bold mb-8 md:mb-12 mt-4 text-black-300">
          Teacher Payment Details
        </h2>

        <div className="mb-8">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-10 mb-6">
          <Input
            id="month"
            name="month"
            label="Month (YYYY-MM)"
            register={register}
            errors={errors}
            required={true}
            icon={Calendar}
          />
          <SelectDropdown
            options={[
              { value: 'paid', label: 'Paid' },
              { value: 'pending', label: 'Pending' }
            ]}
            selectedValue={watch('status')}
            onSelect={(value) => setValue('status', value)}
            displayField="label"
            valueField="value"
            placeholder="Select Status"
            required={true}
          />
        </div>

        <div className="mb-6">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={advancePay}
              onChange={(e) => setAdvancePay(e.target.checked)}
              className="form-checkbox"
            />
            <span>Advance Payment</span>
          </label>
        </div>

        {advancePay && (
          <div className="mb-6">
            <Input
              id="advanceAmount"
              name="advanceAmount"
              label="Advance Amount"
              type="number"
              register={register}
              errors={errors}
              required={true}
              icon={DollarSign}
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center py-3 px-4 rounded-md bg-success-500 text-white focus:outline-none hover:scale-105 transition duration-200"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <>
              Submit Payment
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AddTransactions;