import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import { Mail,Lock,User,ArrowRight,Eye,EyeOff,Phone, VenusAndMars, School2,Calendar, IdCard, MapPin
} from "lucide-react";
import axios from "axios";
import { SignupStudent,GetAllClasses } from "../../Route";
import { setIsStudentUpdate } from "../../../Store/slice";
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from "react-redux";
import Input from "../../Components/Elements/Input";
import SelectDropdown from "../../Components/Elements/SelectDropDownList";

const AddStudents = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showToast, setShowToast]=useState(false)
  const [toastMessage, setToastMessage]=useState('')
  const [toastType, setToastType]=useState('')
  const [classData, setClassData] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const url = import.meta.env.VITE_API_BASE_URL;
  const token = Cookies.get("token");
  const students = useSelector((state) => state.userData.StudentData);
  const dispatch = useDispatch();

  const genderOptions = [
    { name: "Male", value: "male" },
    { name: "Female", value: "female" },
    { name: "Other", value: "other" },
  ];

  useEffect(() => {
    // Animation effect for modal entry
    setIsVisible(true);
    return () => setIsVisible(false);
  }, []);
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

  const fetchClasses = async () => {
    try {
      const response = await axios.get(`${url}${GetAllClasses}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setClassData(response.data.data.classes);
    } catch (error) {
      setShowToast(true);
      setToastMessage(error.response.data.message || "Failed to fetch classes");
      setToastType("error");
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const onSubmit = async (data) => {
    const st_data = {
      name: data.name,
      email: data.email,
      password: data.password,
      parentContact: data.parentContact,
      phoneNumber: data.phoneNumber,
      parentName: data.parentName,
      dob:data.dob,
      studentPan:data.studentPan,
      aadharId:data.aadharId,
      motherAadhar:data.motherAadhar,
      fatherAadhar:data.fatherAadhar,
      address:data.address,
      whatsappNumber:data.whatsappNumber,
      studentClass: selectedClass,
      gender: selectedGender
    };
    setLoading(true);
    try {
      const response = await axios.post(
        `${url}${SignupStudent}`,
        st_data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (
        response.status === 200 ||
        response.status === 201 ||
        response.status === 204
      ) {
        setShowToast(true);
        setToastMessage(response.data.message);
        setToastType("success");
        reset();
        setSelectedClass("");
        setSelectedGender("");
        dispatch(setIsStudentUpdate(true))
      } 
       else {
        setShowToast(true);
        setToastMessage(response.data.message);
        setToastType("error");
      }
    } catch (error) {
      setShowToast(true);
      setToastMessage(error.response?.data.message);
      setToastType("error");

       if (response.status === 401) {  
                  Cookies.remove('user');
                  Cookies.remove('token');
                  window.location.href = '/user-options';                      
                }
    } finally {
      setLoading(false);
      reset();
    }
  };

  return (
    <div className="min-h-full max-w-3xl flex items-center justify-center p-6">
      <div className="h-full w-full space-y-12 bg-white">
        <div className="text-left">
          <h2 className="h2 text-black mt-5 flex flex-col items-start">
            Add Students
          </h2>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 space-y-10 mb-4"
        >
          <Input
            id="name"
            name="name"
            label="Student Name"
            register={register}
            errors={errors}
            required="Name is required"
            placeholder="Full Name"
            icon={User}
            className="w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto"
          />
          
          <Input
            id="email"
            name="email"
            label="Student Email/Admission No."
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
            id="dob"
            name="dob"
            label="Date of Birth"
            type= "date"
            register={register}
            errors={errors}
            required="Date of Birth is required"
            placeholder="eg. 2023-08-15"
            icon={Calendar}
            className="w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto [color-scheme:light]"
          />
   <Input
            id="studentPan"
            name="studentPan"
            label="Student Pan"
            register={register}
            errors={errors}
            required="Pan is required"
            placeholder="Student Pan"
            icon={IdCard}
            className="w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto"
          />
   <Input
            id="aadharId"
            name="aadharId"
            label="Student Aadhaar ID"
            register={register}
            errors={errors}
            required="Student Aadhaar is required"
            placeholder="Student Aadhaar"
            icon={IdCard}
            className="w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto"
          />
   <Input
            id="motherAadhar"
            name="motherAadhar"
            label="Aadhaar ID of Mother"
            register={register}
            errors={errors}
            required="Aadhaar ID of Mother is required"
            placeholder="Aadhaar ID of Mother"
            icon={IdCard}
            className="w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto"
          />
          <Input
            id="fatherAadhar"
            name="fatherAadhar"
            label="Aadhaar ID of Father"
            register={register}
            errors={errors}
            required="Aadhaar ID of Father is required"
            placeholder="Aadhaar ID of Father"
            icon={IdCard}
            className="w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto"
          />
          <Input
            id="address"
            name="address"
            label="Address"
            register={register}
            errors={errors}
            required="Address is required"
            placeholder="Address"
            icon={MapPin}
            className="w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto"
          />
    <Input
            id="phoneNumber"
            name="phoneNumber"
            label="Phone No."
            register={register}
            errors={errors}
            required="Phone No. is  required"
            type="text"
            placeholder="eg. 9876543210"
            icon={Phone}
            validation={{
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Invalid phone number",
              },
            }}
            className="w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto"
          />
    <Input
            id="whatsappNumber"
            name="whatsappNumber"
            label="Whatsapp No."
            register={register}
            errors={errors}
            required="Whatsapp No. is required"
            type="text"
            placeholder="eg. 9876543210"
            icon={Phone}
            validation={{
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Invalid phone number",
              },
            }}
            className="w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto"
          />

          <Input
            id="parentName"
            name="parentName"
            label="Parent Name"
            register={register}
            errors={errors}
            required="Parent name is required"
            placeholder="Parent Name"
            icon={User}
            className="w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto"
          />
          
          <Input
            id="parentContact"
            name="parentContact"
            label="Parent Contact"
            register={register}
            errors={errors}
            required="Parent contact is required"
            type="text"
            placeholder="Parent Contact"
            icon={Phone}
            validation={{
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Invalid contact number",
              },
            }}
            className="w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto"
          />
          






          <div className="w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto">
            <SelectDropdown
              options={classData || []}
              selectedValue={selectedClass}
              onSelect={setSelectedClass}
              displayField="className"
              valueField="_id"
              placeholder="Select Class"
              icon={<School2 size={20} />}
              required={true}
            />
          </div>
          
          <div className="w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto">
            <SelectDropdown
              options={genderOptions}
              selectedValue={selectedGender}
              onSelect={setSelectedGender}
              displayField="name"
              valueField="value"
              placeholder="Select Gender"
              icon={<VenusAndMars size={20} />}
              required={true}
            />
          </div>
          
          <div className="w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto mb-8">
  {/* Added margin-bottom (mb-8) to make space for the error message */}
  <div className="relative">
    <Input
      id="password"
      name="password"
      label="Password"
      register={register}
      errors={errors}
      required="Password is required"
      type={showPassword ? "text" : "password"}
      placeholder="Password"
      icon={Lock}
      validation={{
        minLength: {
          value: 8,
          message: "Password must be at least 8 characters",
        },
      }}
      className="w-full"
    />
    {/* The eye icon positioned absolutely relative to the parent div */}
    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-500">
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? (
          <EyeOff className="h-5 w-5" />
        ) : (
          <Eye className="h-5 w-5" />
        )}
      </button>
    </div>
  </div>
</div>
          
          <div className="w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto mb-8">
  {/* Added margin-bottom (mb-8) to make space for the error message */}
  <div className="relative">
    <Input
      id="confirmPassword"
      name="confirmPassword"
      label="Confirm Password"
      register={register}
      errors={errors}
      required="Please confirm your password"
      type={showConfirmPassword ? "text" : "password"}
      placeholder="Confirm Password"
      icon={Lock}
      validation={{
        validate: (val) => {
          if (watch("password") != val) {
            return "Passwords do not match";
          }
        },
      }}
      className="w-full"
    />
    {/* The eye icon positioned absolutely relative to the parent div */}
    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-500">
      <button
        type="button"
        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
      >
        {showConfirmPassword ? (
          <EyeOff className="h-5 w-5" />
        ) : (
          <Eye className="h-5 w-5" />
        )}
      </button>
    </div>
  </div>
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
                  Add
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

export default AddStudents;

