  import React, { useState, useEffect } from "react";
  import {
    Search,
    Trash2,
    PenSquare,
    GraduationCap,
    Plus,
    Loader,
    X,
    ChevronLeft,
    ChevronRight,
    Eye,
  } from "lucide-react";
  import Cookies from "js-cookie";
  import { toast } from 'react-toastify';
  import RegisterSubject from "./RegisterSubject";
  import { setClassData } from "../../../Store/slice";
  import { GetAllClassesAPI,GetSubjectByClassAPI } from '../../../service/api';
  import { useSelector, useDispatch } from "react-redux";
  const AllSubjects = () => {
    const url = import.meta.env.VITE_API_BASE_URL;
    const token = Cookies.get("token");

    const [subjects, setSubjects] = useState([]);
    const [selectedClassId, setSelectedClassId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [showAddSubject, setShowAddSubject] = useState(false);
    const [showFullSyllabus, setShowFullSyllabus] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('');
    const classes = useSelector((state) => state.userData.ClassData);
    const dispatch = useDispatch();

    const subjectsPerPage = 10;
    useEffect(() => {
        document.title = "Subject Details";
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

    useEffect(() => {
      const fetchClasses = async () => {
        const response = await GetAllClassesAPI(url);
        if (response.status === 200 || response.status === 204 || response.status === 201) {
          dispatch(setClassData(response.data.classes));
          if (response.data.classes?.length > 0) {
            setSelectedClassId(response.data.classes[0]._id);
          }
        } else {
          setError(response.message);
          setShowToast(true);
          setToastMessage(response.message);
          setToastType("error");
        }
        setLoading(false);
      };

      if(classes?.length === 0) {
        fetchClasses();
      }
    }, []);

    useEffect(() => {
      const fetchSubjectsByClass = async () => {
        if (!selectedClassId) return;
        else {
          setLoading(true);
          const response = await GetSubjectByClassAPI(url, selectedClassId);

          if (response.status === 200 || response.status === 204 || response.status === 201) {
            setSubjects(response.data);
        
          } else {
            setError(response.message);
            setShowToast(true);
            setToastMessage(response.message);
            setToastType("error");
          }
          setLoading(false);
        }
      };

      fetchSubjectsByClass();
    }, [selectedClassId]);
    
    const handleClassChange = (e) => {
      setSelectedClassId(e.target.value);
      setCurrentPage(1); // Reset to first page when changing class
    };

    const filteredSubjects = subjects?.filter(
      (subject) =>
        subject.name?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
        (subject.teacher?.name || "")
          ?.toLowerCase()
          .includes(searchQuery?.toLowerCase())
    );

    const indexOfLastSubject = currentPage * subjectsPerPage;
    const indexOfFirstSubject = indexOfLastSubject - subjectsPerPage;
    const currentSubjects = filteredSubjects?.slice(
      indexOfFirstSubject,
      indexOfLastSubject
    );
    const totalPages = Math.ceil(filteredSubjects?.length / subjectsPerPage);

    const handleSyllabusClick = (url) => {
      if (url) {
        window.open(url, "_blank");
      }
    };

    const renderPaginationButtons = () => {
      const buttons = [];

      buttons.push(
        <button
          key="prev"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded-lg bg-purple-100 text-purple-600 disabled:opacity-50"
        >
          <ChevronLeft size={20} />
        </button>
      );

      buttons.push(
        <span key="current" className="px-3 py-1">
          {currentPage} of {totalPages || 1}
        </span>
      );

      buttons.push(
        <button
          key="next"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded-lg bg-lamaPurpleLight text-purpleColor disabled:opacity-50"
        >
          <ChevronRight size={20} />
        </button>
      );

      return buttons;
    };

    if (loading && !selectedClassId) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <div className="flex items-center justify-center h-96">
            <Loader className="h-12 w-12 animate-spin text-purpleColor" />
          </div>
        </div>
      );
    }

    return (
      <div className="sm:px-16 px-6 sm:py-16 py-10 min-h-screen">
        <div className="flex flex-col md:flex-row text-black-300 justify-between items-start md:items-center mb-6 p-2">
          <div className="mb-4 md:mb-0 text-left">
            <h2 className="h2 text-2xl font-medium mb-2 text-left">All Subjects</h2>
            <div className="flex items-center text-sm subtitle-2 text-left">
              <span className="mr-2">Subjects /</span>
              <span>All Subjects</span>
            </div>
          </div>
          <button
            onClick={() => setShowAddSubject(true)}
            className="flex items-center p-2 bg-success-500 text-white rounded-full transition-colors duration-200 transform hover:scale-105"
          >
            <span>
              <Plus size={20} />
            </span>
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4">
          <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-6">
            <select
              value={selectedClassId || ""}
              onChange={handleClassChange}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-purpleColor focus:outline-none focus:border-purpleColor"
            >
              {classes?.map((classItem) => (
                <option key={classItem._id} value={classItem._id}>
                  {classItem.className}
                </option>
              ))}
            </select>
        
          </div>

          <div
            className={`
              fixed inset-0 flex items-center justify-center 
              bg-black bg-opacity-50 z-50 
              ${
                showAddSubject
                  ? "opacity-100 visible"
                  : "opacity-0 invisible pointer-events-none"
              }
              transition-all duration-300 ease-in-out
            `}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowAddSubject(false);
              }
            }}
          >
            {showAddSubject && (
              <div
                className={`
                  relative rounded-lg w-auto max-h-[90vh] overflow-y-auto 
                  bg-white 
                  custom-scrollbar
                  ${
                    showAddSubject
                      ? "opacity-100 scale-100 translate-y-0"
                      : "opacity-0 scale-95 -translate-y-4 pointer-events-none"
                  }
                  transition-all duration-300 ease-in-out
                  transform origin-center
                `}
              >
                <button
                  onClick={() => setShowAddSubject(false)}
                  className="absolute top-6 mb-2 right-5 lg:right-6 p-2  bg-white rounded-full z-50 text-black-300 hover:text-gray-800 transition-colors duration-200 transform hover:scale-110"
                >
                  <X size={24} />
                </button>
                <div className="z-40">
                <RegisterSubject
                  onClose={() => setShowAddSubject(false)}
                  selectedClassId={selectedClassId}
                />
              </div>
              </div>
            )}
          </div>

          {loading && selectedClassId ? (
            <div className="flex justify-center items-center py-20">
              <Loader className="h-10 w-10 animate-spin text-purpleColor" />
            </div>
          ) : (
            <div className="overflow-x-auto text-black-300 text-base">
              <table className="w-full min-w-[768px] pb-10">
                <thead className="bg-lamaPurpleLight">
                  <tr className="border-b">
                    <th className="p-4 text-left">Sl No</th>
                    <th className="p-4 text-left">Subject Name</th>
                    <th className="p-4 text-left">Teacher</th>
                    <th className="p-4 text-left">Syllabus</th>
                    <th className="p-4 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {(error || subjects?.length === 0)? (
                    <tr>
                      <td colSpan="6" className="text-center p-4">
                        {error || "No subjects available for this class"}
                      </td>
                    </tr>
                  ) : (
                    currentSubjects?.map((subject, index) => (
                      <tr
                        key={subject._id}
                        className="border-b hover:bg-gray-50 transition-colors duration-150 animate-fade-in"
                      >
                        <td className="p-4 text-left">{index + 1}</td>
                        <td className="p-4 text-left">{subject.name}</td>
                        <td className="p-4">
                          <div className="flex flex-col gap-2">
                            {subject.teacher?.map((teacher, index) => (
                              <div key={teacher._id} className="flex items-center gap-3">
                              
                                <span>{teacher.name || "-"}</span>
                              </div>
                            ))}
                          </div>
                        </td>
                
                        <td className="p-4 text-left">
                          {subject.syllabus && (
                            <div>
                              {subject.syllabus.length > 50 ? (
                                <div>
                                  {showFullSyllabus ? (
                                    <div>
                                      {subject.syllabus}
                                      <button 
                                        onClick={() => setShowFullSyllabus(false)}
                                        className="text-purpleColor ml-2 hover:underline"
                                      >
                                        Show Less
                                      </button>
                                    </div>
                                  ) : (
                                    <div>
                                      {subject.syllabus.substring(0, 50)}...
                                      <button 
                                        onClick={() => setShowFullSyllabus(true)}
                                        className="text-purpleColor ml-2 hover:underline"
                                      >
                                        Read More
                                      </button>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                subject.syllabus
                              )}
                            </div>
                          )}
                        </td>                      
                        <td className="p-4">
                          <div className="flex justify-start gap-2">
                            <button className="p-1 hover:text-danger transition-colors duration-200 transform hover:scale-110">
                              <Trash2 size={18} />
                            </button>
                            <button className="p-1 hover:text-purpleColor transition-colors duration-200 transform hover:scale-110">
                              <PenSquare size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {subjects?.length > 0 && (
          <div className="bottom-0 max-w-screen-xl border-t p-4 flex justify-between items-center">
            <div className="w-full flex justify-center items-center gap-2">
              {renderPaginationButtons()}
            </div>
          </div>
        )}


      </div>
    );
  };

  const styles = document.createElement("style");
  styles.textContent = `
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .animate-fade-in {
        animation: fadeIn 0.3s ease-out forwards;
      }
    `;
  document.head.appendChild(styles);

  export default AllSubjects;