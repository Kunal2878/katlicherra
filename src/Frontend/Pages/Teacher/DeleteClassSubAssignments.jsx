
import React, { useState, useEffect } from "react";
import {

  Loader,
  ChevronLeft,
  ChevronRight

} from "lucide-react";
import Cookies from "js-cookie";
import { toast } from 'react-toastify';
import { setTeacherData,setShowConfirmationModel,setStatus, setAddText  } from "../../../Store/slice";
import { GetAllTeachersAPI, GetAllSubjectsAPI } from '../../../service/api';
import { useSelector, useDispatch } from "react-redux";
import Table from '../../Components/Elements/Table';
import axios from 'axios';
import Confirmation from "../../Components/Elements/ConfirmationModel"

const DeleteClassSub = () => {
  const url = import.meta.env.VITE_API_BASE_URL;
  const token = Cookies.get("token");

  const [allSubjects, setAllSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);
  const [selectedTeacherData, setSelectedTeacherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');
  // Variables for deletion
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [selectedSubjectIds, setSelectedSubjectIds] = useState([]);

  const teachers = useSelector((state) => state.userData.TeacherData);
  const confirmRequest = useSelector((state) => state.userData.confirmRequest);
  const showConfirmation = useSelector((state) => state.userData.showConfirmationModel);
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
      setShowToast(false);
    }
  }, [showToast, toastMessage, toastType]);

  useEffect(() => {
    const fetchTeachers = async () => {
      const response = await GetAllTeachersAPI(url);
      if (response.status === 200 || response.status === 204 || response.status === 201) {
        dispatch(setTeacherData(response.data.teachers));
        if (response.data.teachers?.length > 0) {
          setSelectedTeacherId(response.data.teachers[0]._id);
          setSelectedTeacherData(response.data.teachers[0]);
        }
      } else {
        setError(response.message);
        setShowToast(true);
        setToastMessage(response.message);
        setToastType("error");
      }
      setLoading(false);
    };

    if (teachers?.length === 0) {
      fetchTeachers();
    } else if (teachers?.length > 0 && !selectedTeacherId) {
      setSelectedTeacherId(teachers[0]._id);
      setSelectedTeacherData(teachers[0]);
      setLoading(false);
    }
  }, [teachers]);

  const fetchSubjects = async () => {
    setLoading(true);

        // Fetch all subjects
        const response = await GetAllSubjectsAPI(url);
        
        if (response.status === 200 || response.status === 204 || response.status === 201) {
          setAllSubjects(response.data || []);
        } else {
          setError(response.message);
          setShowToast(true);
          setToastMessage(response.message);
          setToastType("error");
        }
      
      setLoading(false);
    };
    
    useEffect(() => {
    fetchSubjects();
  }, []);

  // Filter subjects whenever teacher selection or all subjects change
  useEffect(() => {
    if (selectedTeacherId && allSubjects.length) {
      // Filter subjects that have the selected teacher
      const teacherSubjects = allSubjects.filter(subject => 
        subject.teacher && subject.teacher.some(teacher => teacher._id === selectedTeacherId)
      );
      
      setFilteredSubjects(teacherSubjects);
      setCurrentPage(1); // Reset to first page when changing filters
    }
  }, [selectedTeacherId, allSubjects]);

  const handleDeleteClick = (subject) => {
    
      setSelectedClassId(subject.class?._id);
      setSelectedSubjectIds([subject._id]);
 
    dispatch(setShowConfirmationModel(true));
    
  
  };

  useEffect(()=>{
if(confirmRequest)
{
  DeleteSubject();
  
}
  },[confirmRequest])


  const DeleteSubject = async () => {
 
    try {
      if (!selectedTeacherId || !selectedClassId || selectedSubjectIds.length === 0) {
        setShowToast(true);
        setToastMessage("Missing required information for deletion");
        setToastType("error");
        return;
      }

     const response = await axios.delete(`${url}teacher/${selectedTeacherData._id}/delete-assignments`, {
        data: {
          classesToRemove: [selectedClassId],
          subjectsToRemove: selectedSubjectIds
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Update the UI by removing the deleted subject from both lists
      setAllSubjects(prev => prev.filter(subject => !selectedSubjectIds.includes(subject._id)));
      setFilteredSubjects(prev => prev.filter(subject => !selectedSubjectIds.includes(subject._id)));
      
      dispatch(setStatus("success"))
      dispatch(setAddText(response.message))
      fetchSubjects()
      
      // Reset selected IDs
      setSelectedClassId(null);
      setSelectedSubjectIds([]);
    } 
    catch (error) {
      console.log(error)
      dispatch(setStatus("error"))
      dispatch(setAddText(error.response?.data.message || "An error occoured, please try after sometime"))
      
      
      if (error.response?.status === 401) {  
        Cookies.remove('user');
        Cookies.remove('token');
        window.location.href = '/user-options';      
      }
    }
finally {
    
      setTimeout(() => {
        dispatch(setStatus(''));
        dispatch(setAddText(''));
        dispatch(setShowConfirmationModel(false));
      }, 3000);
    }

    
  };

  const handleClassChange = (e) => {
    const teacherId = e.target.value;
    setSelectedTeacherId(teacherId);
    const selectedTeacher = teachers.find(teacher => teacher._id === teacherId);
    setSelectedTeacherData(selectedTeacher);
  };

  // Table column definitions
  const columns = [
    { field: "name", headerName: "Subject Name" },
    { 
      field: "class", 
      headerName: "Class",
      renderCell: (row) => row.class?.className || "-"
    },
    { 
      field: "section", 
      headerName: "Section",
      renderCell: (row) => row.class?.section || "-"
    },
    { 
      field: "syllabus", 
      headerName: "Syllabus",
      renderCell: (row) => {
        if (!row.syllabus) return "-";
        
        if (row.syllabus.length > 50) {
          return (
            <div>
              {row.syllabus.substring(0, 50)}...
              <button 
                onClick={() => handleSyllabusClick(row.syllabus)}
                className="text-purpleColor ml-2 hover:underline"
              >
                Read More
              </button>
            </div>
          );
        }
        return row.syllabus;
      }
    }
  ];

  const searchFilteredSubjects = filteredSubjects?.filter(
    (subject) =>
      subject.name?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
      (subject.class?.name || "")
        ?.toLowerCase()
        .includes(searchQuery?.toLowerCase())
  );

  const indexOfLastSubject = currentPage * subjectsPerPage;
  const indexOfFirstSubject = indexOfLastSubject - subjectsPerPage;
  const currentSubjects = searchFilteredSubjects?.slice(
    indexOfFirstSubject,
    indexOfLastSubject
  );
  const totalPages = Math.ceil(searchFilteredSubjects?.length / subjectsPerPage);

  const handleSyllabusClick = (syllabus) => {
    // Display full syllabus in a modal or new window
    alert(syllabus);
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
        disabled={currentPage === totalPages || totalPages === 0}
        className="px-3 py-1 rounded-lg bg-lamaPurpleLight text-purpleColor disabled:opacity-50"
      >
        <ChevronRight size={20} />
      </button>
    );

    return buttons;
  };

  if (loading && !selectedTeacherId) {
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
          <h2 className="h2 text-2xl font-medium mb-2 text-left">Delete Classes-Subjects</h2>
          <div className="flex items-center text-sm subtitle-2 text-left">
            <span className="mr-2">Academic /</span>
            <span>Delete Classes-Subjects</span>
          </div>
        </div>
       
      </div>

      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-6">
          <select
            value={selectedTeacherId || ""}
            onChange={handleClassChange}
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-black-300 focus:outline-none focus:border-purpleColor"
          >
            {teachers?.map((teacher) => (
              <option key={teacher._id} value={teacher._id}>
                {teacher?.name}
              </option>
            ))}
          </select>
          
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader className="h-10 w-10 animate-spin text-purpleColor" />
          </div>
        ) : (
          <>
            {filteredSubjects.length > 0 ? (
              <Table 
                columns={columns}
                data={currentSubjects}
                actions={true}
                onDelete={handleDeleteClick}
                // onEdit={(subject) => console.log("Edit subject:", subject)}
                extraClasses="mb-4"
              />
            ) : (
              <div className="text-center py-10 text-gray-500">
                No subjects assigned to this teacher
              </div>
            )}
          </>
        )}
      </div>
{
showConfirmation && (
        <div
          className={`
            fixed inset-0 flex items-center justify-center 
            bg-black bg-opacity-50 z-50 
            ${
              showConfirmation
                ? "opacity-100 visible"
                : "opacity-0 invisible pointer-events-none"
            }
            transition-all duration-300 ease-in-out
          `}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              dispatch(setShowConfirmationModel(false))
              setSelectedExpenses(null);
            }
          }}
        >
          <Confirmation 
            message={`Are you sure you want to delete this subject assignment? This action cannot be undone.`}
            note=""/>
        </div>
      )}


{/* 
      {searchFilteredSubjects?.length > 0 && (
        <div className="bottom-0 max-w-screen-xl border-t p-4 flex justify-between items-center">
          <div className="w-full flex justify-center items-center gap-2">
            {renderPaginationButtons()}
          </div>
        </div>
      )} */}
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

export default DeleteClassSub;