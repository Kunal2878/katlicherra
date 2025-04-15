import { useState, useEffect } from "react";
import { Check, ArrowRight, ChevronDown, School, User } from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";
import { GetAllClasses, GetAllTeachers } from '../../Route';
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';

  const MakeClassTeacher = () => {
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [isTeacherDropdownOpen, setIsTeacherDropdownOpen] = useState(false);
  
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  
  const [isClassDropdownOpen, setIsClassDropdownOpen] = useState(false);
  const [classData, setClassData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');
  
  const url = import.meta.env.VITE_API_BASE_URL;
  const token = Cookies.get('token');
  const {
    register,
    reset,
    formState: { errors },
  } = useForm();

  const fetchClasses = async () => {
    try {
      const response = await axios.get(`${url}${GetAllClasses}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      setClassData(response.data.data.classes);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get(`${url}${GetAllTeachers}`);
        setTeachers(response.data.data.teachers);
      } catch (error) {
        console.error('Error fetching teachers:', error);
      }
    }
    fetchTeachers();
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

  const handleTeacherSelect = (e) => {
    setSelectedTeacher(e.target.value);
  };

  const handleClassSelect = (className, classId) => {
    setSelectedClass(className);
    setSelectedClassId(classId);
    setIsClassDropdownOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const selectedTeacherData = teachers.find(teacher => teacher.email === selectedTeacher);
    
    try {
      await axios.put(`${url}teacher/${selectedTeacherData._id}/make-class-teacher`, {
        classId: selectedClassId
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setShowToast(true);
      setToastMessage("Successfully assigned class teacher");
      setToastType("success");
     
      setSelectedClass("");
      setSelectedClassId("");
      setSelectedTeacher("");
      
    } catch (error) {
      setShowToast(true);
      setToastMessage(error.response.data.message || "Failed to assign class teacher");
      setToastType("error");
      if (error.status === 401) {  
        Cookies.remove('user');
        Cookies.remove('token');
        window.location.href = '/user-options';                      
      }
    } finally {
      setIsLoading(false);
      setSelectedClass("");
      setSelectedClassId("");
      setSelectedTeacher("");
    }
  };

  const isFormValid = selectedTeacher && selectedClassId;
  
  return (
    <div className="min-h-screen p-4 md:p-8 overflow-y-auto">
      <div className="max-w-2xl mx-auto bg-white rounded-md p-4 md:p-6">
        <h2 className="text-xl md:text-2xl text-left font-bold mb-8 md:mb-12 mt-4 text-gray-800">
          Assign Class Teacher
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div className="mb-8">
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsTeacherDropdownOpen(!isTeacherDropdownOpen)}
                className="w-full flex items-center justify-between px-2 py-1.5 md:py-2 bg-transparent border-2 border-black-200 text-gray-600 focus:outline rounded-md text-sm md:text-base"
              >
                <div className="h5 flex items-center">
                  <User className="w-4 h-4 md:w-5 md:h-5 mr-2 text-danger" />
                  <span className="text-black">
                    {selectedTeacher ? teachers.find(t => t.email === selectedTeacher)?.name : "Select Teacher"}
                  </span>
                </div>
                <ChevronDown size={24} className="text-black" />
              </button>
              {isTeacherDropdownOpen && (
                <div className="absolute z-50 w-full max-h-40 overflow-y-scroll mt-1 bg-white border rounded-md shadow-lg">
                  {teachers.map((teacher) => (
                    <div
                      key={teacher._id}
                      onClick={() => {
                        handleTeacherSelect({ target: { value: teacher.email }});
                        setIsTeacherDropdownOpen(false);
                      }}
                      className="flex items-center px-2 md:px-4 py-1.5 md:py-2 hover:bg-gray-100 cursor-pointer text-gray-600 text-sm md:text-base"
                    >
                      <div
                        className={`w-3 h-3 md:w-4 md:h-4 border rounded mr-2 flex items-center justify-center ${
                          selectedTeacher === teacher.email
                            ? "bg-purple-500 text-white"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedTeacher === teacher.email && (
                          <Check className="w-2 h-2 md:w-3 md:h-3 text-gray-600" />
                        )}
                      </div>
                      {teacher.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="relative bg-transparent border-2 border-black-200 text-gray-600 rounded-lg focus:outline mb-4">
            <button
              type="button"
              onClick={() => setIsClassDropdownOpen(!isClassDropdownOpen)}
              className="w-full flex items-center justify-between px-2 py-1.5 md:py-2 border rounded-lg bg-white text-sm md:text-base"
            >
              <div className="flex items-center">
                <School className="w-4 h-4 md:w-5 md:h-5 mr-2 text-danger" />
                <span className="h5 text-black">
                  {selectedClass || "Select Class"}
                </span>
              </div>
              <ChevronDown size={24} className="text-black" />
            </button>
            {isClassDropdownOpen && (
              <div className="absolute z-10 w-full max-h-40 overflow-y-auto mt-1 bg-white border rounded-lg shadow-lg">
                {classData.map((classItem) => (
                  <div
                    key={classItem._id}
                    onClick={() => handleClassSelect(classItem.className, classItem._id)}
                    className="flex items-center px-2 md:px-4 py-1.5 md:py-2 hover:bg-gray-100 cursor-pointer text-gray-600 text-sm md:text-base"
                  >
                    <div
                      className={`w-3 h-3 md:w-4 md:h-4 border rounded mr-2 flex items-center justify-center ${
                        selectedClassId === classItem._id
                          ? "bg-purple-500 text-white"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedClassId === classItem._id && (
                        <Check className="w-2 h-2 md:w-3 md:h-3 text-gray-600" />
                      )}
                    </div>
                    {classItem.className}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            className={`w-full flex items-center justify-center py-3 px-4 rounded-lg ${
              isFormValid ? "bg-success-500 text-white hover:scale-105 transition duration-200" : "bg-gray-300 text-gray-500 cursor-not-allowed"
            } focus:outline-none`}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                Assign Class Teacher
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MakeClassTeacher;