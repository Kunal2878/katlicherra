import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import {
  User,
  Mail,
  ArrowRight,
  School,
  School2,
  GraduationCap,
  IndianRupee,
} from "lucide-react";
import Cookies from "js-cookie";
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from "react-redux";
import { setTeacherData, setClassData } from "../../../Store/slice";
import { GetTeachers,GetAllTeachersAPI, CreateClassAPI } from '../../../service/api';
import SelectDropdown from "../../Components/Elements/SelectDropDownList"
import Input from "../../Components/Elements/Input"; 

const RegisterClass = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [students, setStudents] = useState([{ name: "", email: "" }]);
  const [loading, setLoading] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedTeacherName, setSelectedTeacherName] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");
  const [error, setError] = useState(null);
  const teachers = useSelector((state) => state.userData.TeacherData);
  const classes = useSelector((state) => state.userData.ClassData);

  const dispatch = useDispatch();
  const url = import.meta.env.VITE_API_BASE_URL;
  const token = Cookies.get("token");

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

  const addStudent = () => {
    setStudents([...students, { name: "", email: "" }]);
  };

  const handleStudentChange = (index, field, value) => {
    const updatedStudents = [...students];
    updatedStudents[index][field] = value;
    setStudents(updatedStudents);
  };

  const handleDeleteStudent = () => {
    if (students.length > 1) {
      setStudents(students.slice(0, -1));
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);

    const selectedTeacherData = teachers.find(
      (teacher) => teacher.email === selectedTeacher
    );
    console.log(selectedTeacherData);
    const studentsData = students
      .map((student) => ({
        name: student.name,
        email: student.email,
      }))
      .filter((student) => student.email && student.name);

    const classData = {
      className: data.className,
      section: data.section,
      classTeacher: selectedTeacherData._id,
      classTeacherEmail: selectedTeacherData.email,
      students: studentsData,
      fee:data.fee,
      lateFineAmount: data.lateFineAmount,
      subjects: [],
      timetable: [],
    };
    const AddData = {
      className: data.className,
      section: data.section,
      classTeacher: {name: selectedTeacherData.name},
      students: studentsData,
      subjects: [],
      timetable: [],
    }    
    const response = await CreateClassAPI(url, classData, token);

    if (response.status === 200 || response.status === 201 || response.status === 204) {
      dispatch(setClassData([...classes, AddData]))
      setShowToast(true);
      setToastMessage(response.message);
      setToastType("success");
      reset();
    } else {
      setShowToast(true);
      setToastMessage(response.message);
      setToastType("error");
      reset();
      if (response.status === 401) {  
        Cookies.remove('user');
        Cookies.remove('token');
        window.location.href = '/user-options';                      
      }
    }
    setLoading(false);
  };

  return (
    <div className="h-auto overflow-auto sm:px-16 px-6 sm:py-16 py-10 w-full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-4xl mx-auto bg-white rounded-lg p-2 transition-all duration-300"
      >
        <h2 className="h2 text-xl md:text-2xl text-left font-bold mb-8 md:mb-12 mt-4 text-black-300">
          {" "}
          Register New Class
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10 mb-8">
          <Input
            id="className"
            name="className"
            label="Class Name (eg.1A)"
            register={register}
            errors={errors}
            required={true}
            icon={School}
          />
          <Input
            id="section"
            name="section"
            label="Section (eg.A)"
            register={register}
            errors={errors}
            required={true}
            icon={School2}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10 mb-6">
          <Input
            id="fee"
            name="fee"
            type = "number"
            label="Class Fee (eg. Rs.1000)"
            register={register}
            errors={errors}
            required={true}
            icon={IndianRupee}
          />
          <Input
            id="lateFineAmount"
            name="lateFineAmount"
            type = "number"
            label="Late Fine (eg. Rs.100)"
            register={register}
            errors={errors}
            required={true}
            icon={IndianRupee}
          />
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-6 text-black">
            Class Teacher Details
          </h3>
          
          <SelectDropdown
            options={teachers || []}
            selectedValue={selectedTeacher}
            onSelect={setSelectedTeacher}
            displayField="name"
            valueField="email"
            placeholder="Select Teacher"
            icon={<User size={20} />}
            required={true}
          />
        </div>

      
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center py-3 px-4 rounded-md bg-success-500 text-white focus:outline-none hover:scale-105 transition duration-200"
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
      </form>
    </div>
  );
};

export default RegisterClass;