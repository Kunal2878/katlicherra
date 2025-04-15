import { useState, useEffect } from "react";
import { Check, ArrowRight, ChevronDown, School, BookOpen, User } from "lucide-react";
import { toast } from 'react-toastify';
import axios from "axios";
import Cookies from "js-cookie";
import { GetAllClass,GetAllClasses, GetAllTeacher,GetAllTeachers, AssignClassSubject } from '../../Route';
import { GetSubjectByClassAPI } from '../../../service/api';

const AssignClassSub = () => {
  const [activeTab, setActiveTab] = useState('assign');
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [isTeacherDropdownOpen, setIsTeacherDropdownOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedSubjectIds, setSelectedSubjectIds] = useState([]);
  const [isClassDropdownOpen, setIsClassDropdownOpen] = useState(false);
  const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);
  const [classData, setClassData] = useState([]);
  const [subjectData, setSubjectData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');
  
  const url = import.meta.env.VITE_API_BASE_URL;
  const token = Cookies.get('token');

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
    const fetchSubjectsByClass = async () => {
      if (!selectedClassId) {
        setSubjectData([]);
        return;
      }
      
      setLoading(true);
      try {
        const response = await GetSubjectByClassAPI(url, selectedClassId);

        if (response.status === 200 || response.status === 204 || response.status === 201) {
          setSubjectData(response.data);
          setSelectedSubjects([]);
          setSelectedSubjectIds([]);
      
        } else {
          setShowToast(true);
          setToastMessage(response.message || "No subjexts found for the class");
          setToastType("error");
        }
      } catch (error) {
        console.error("Error fetching subjects:", error);
        setShowToast(true);
        setToastMessage(error.response.data.message || "Failed to fetch subjects");
        setToastType("error");
      } finally {
        setLoading(false);
      }
    };

    fetchSubjectsByClass();
  }, [selectedClassId, url]);

  const handleTeacherSelect = (e) => {
    setSelectedTeacher(e.target.value);
  };

  const handleClassSelect = (className, classId) => {
    setSelectedClass(className);
    setSelectedClassId(classId);
    setIsClassDropdownOpen(false);
  };

  const toggleSubject = (subject, subjectId) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    );
    
    setSelectedSubjectIds((prev) =>
      prev.includes(subjectId)
        ? prev.filter((id) => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const selectedTeacherData = teachers.find(teacher => teacher.email === selectedTeacher);
    
    try {
      if (activeTab === 'assign') {

     await axios.post(`${url}${AssignClassSubject}/${selectedTeacherData._id}`, {
          classIds: [selectedClassId],
          subjectIds: selectedSubjectIds
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
       
          setShowToast(true);
          setToastMessage("Successfully assigned class and subjects");
          setToastType("success");



      } 
      
      else {
        await axios.delete(`${url}teacher/${selectedTeacherData._id}/delete-assignments`, {
          data: {
            classesToRemove: [selectedClassId],
            subjectsToRemove: selectedSubjectIds.length > 0 ? selectedSubjectIds : []
          },
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setShowToast(true);
        setToastMessage("Successfully removed assignment");
        setToastType("success");
      }
      
      setSelectedClass("");
      setSelectedClassId("");
      setSelectedSubjects([]);
      setSelectedSubjectIds([]);
      setSelectedTeacher("");
      
    } catch (error) {
      setShowToast(true);
      setToastMessage(error.response?.data?.message || "An error occurred");
      setToastType("error");
      if (error.status === 401) {  
        Cookies.remove('user');
        Cookies.remove('token');
        window.location.href = '/user-options';                      
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = selectedTeacher && selectedClassId && (activeTab === 'delete' || selectedSubjectIds.length > 0);
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-md p-4 md:p-6">
        {/* <div className="flex mb-6 border-b">
          <button
            className={`px-4 py-2 ${activeTab === 'assign' ? 'border-b-2 border-purple-500 text-purple-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('assign')}
          >
            Assign
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'delete' ? 'border-b-2 border-purple-500 text-purple-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('delete')}
          >
            Delete
          </button>
        </div> */}

        <h2 className="text-xl md:text-2xl text-left font-bold mb-8 md:mb-12 mt-4 text-gray-800">
          {activeTab === 'assign' ? 'Assign Class and Subjects' : 'Remove Class and Subjects Assignment'}
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
                <div className="absolute z-50 max-h-40 overflow-y-auto w-full mt-1 bg-white border rounded-md shadow-lg">
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
              <div className="absolute z-20 max-h-40 overflow-y-auto w-full mt-1 bg-white border rounded-lg shadow-lg">
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

          <div className="relative bg-transparent border-2 border-black-200 text-gray-600 rounded-lg focus:outline">
            <button
              type="button"
              onClick={() => selectedClassId && setIsSubjectDropdownOpen(!isSubjectDropdownOpen)}
              disabled={!selectedClassId || loading}
              className={`w-full flex items-center justify-between px-2 py-1.5 md:py-2 border rounded-lg bg-white text-sm md:text-base ${!selectedClassId ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              <div className="h5 flex items-center gap-2">
                <BookOpen size={20} className="text-brand" />
                <span className="text-black">
                  {loading ? "Loading subjects..." :
                    !selectedClassId ? "Select class first" :
                    selectedSubjects.length ? selectedSubjects.join(", ") : "Select subjects"}
                </span>
              </div>
              <ChevronDown size={24} className="text-black" />
            </button>

            {isSubjectDropdownOpen && subjectData.length > 0 && (
              <div className="absolute z-10 max-h-40 overflow-y-auto w-full mt-1 bg-white border rounded-lg shadow-lg">
                {subjectData.map((subject) => (
                  <div
                    key={subject._id}
                    onClick={() => toggleSubject(subject.name, subject._id)}
                    className="flex items-center px-2 md:px-4 py-1.5 md:py-2 hover:bg-gray-100 cursor-pointer text-gray-600 text-sm md:text-base"
                  >
                    <div
                      className={`w-3 h-3 md:w-4 md:h-4 border rounded mr-2 flex items-center justify-center ${
                        selectedSubjectIds.includes(subject._id)
                          ? "bg-purple-500 text-white"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedSubjectIds.includes(subject._id) && (
                        <Check className="w-2 h-2 md:w-3 md:h-3 text-gray-600" />
                      )}
                    </div>
                    {subject.name}
                  </div>
                ))}
                
                {subjectData.length === 0 && !loading && (
                  <div className="px-4 py-2 text-gray-500">No subjects available for this class</div>
                )}
              </div>
            )}
            
            {isSubjectDropdownOpen && loading && (
              <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg">
                <div className="px-4 py-2 text-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-500 mx-auto"></div>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            className={`w-full flex items-center justify-center py-3 px-4 rounded-lg ${
              isFormValid ? activeTab === 'assign' ? "bg-success-500" : "bg-red-500" : "bg-gray-300"
            } text-white hover:scale-105 transition duration-200 focus:outline-none ${
              !isFormValid && "cursor-not-allowed"
            }`}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                {activeTab === 'assign' ? 'Assign Class and Subjects' : 'Remove Assignment'}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AssignClassSub;