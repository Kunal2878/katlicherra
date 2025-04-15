
import React, { useState, useEffect } from "react";
import {
  Search,
  Loader,
  GraduationCap,
  Plus,
  X,
  PenSquare,
  Eye,
} from "lucide-react";
import UpdateStudents from "../../Pages/Student/UpdateStudent";
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from "react-redux";
import { setStudentData, setCurrentPage,setIsStudentUpdate } from "../../../Store/slice";
import { GetStudents } from '../../../service/api';
import Table from "../Elements/Table";
import Pagination from "../Elements/Pagination";

const PromoteStudents = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUpdateStudent, setShowUpdateStudent] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [paginationData, setPaginationData] = useState({
    currentPage: 1,
    totalItems: 0,
    totalPages: 0
  });
  const students = useSelector((state) => state.userData.StudentData);
  const currentPage = useSelector((state) => state.userData.CurrentPage);
  const isStudentUpdate = useSelector((state) => state.userData.isStudentUpdate);
  const url = import.meta.env.VITE_API_BASE_URL;
  const dispatch = useDispatch();
  

  useEffect(() => {
    document.title = "Student Details";
    dispatch(setCurrentPage(1));
  }, []);

  const fetchStudents = async () => {

      setLoading(true);
      const response = await GetStudents(url, currentPage);
      if (response.status === 200 || response.status === 204 || response.status === 201) {
        dispatch(setStudentData(response.data.students));
      
        // Update pagination data from API response
        setPaginationData({
          currentPage: response.data.pagination.currentPage|| 1,
          totalItems: response.data.pagination.totalItems,
          totalPages: response.data.pagination.totalPages,
          totalItemsPerPage: response.data.pagination.studentsPerPage ||10
        });
      
      } 
      
      else {
        dispatch(setStudentData([]));
         toast.error(response.message , {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                  });
      }
   
    setLoading(false);
  };

useEffect(() => {
fetchStudents();
  }, [currentPage]);

  useEffect(() => {
    if(isStudentUpdate){
    fetchStudents();
      dispatch(setIsStudentUpdate(false))

    }
  }, [isStudentUpdate]);







  // Handle page change
  const handlePageChange = (newPage) => {
    dispatch(setCurrentPage(newPage));
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    dispatch(setCurrentPage(1)); // Reset to first page when searching
  };

  // Handle student promotion
  const handlePromoteStudent = (student) => {
    setSelectedStudent(student);
    setShowUpdateStudent(true);
  };

  // Table columns definition
  const columns = [
    {
      field: 'name',
      headerName: "Student's Name",
      renderCell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-lamaPurpleLight rounded-full overflow-hidden flex flex-row justify-center items-center">
            <GraduationCap size={20} />
          </div>
          <span>{row.name}</span>
        </div>
      ),
    },
    {
      field: 'studentClass',
      headerName: 'Class',
      renderCell: (row) => row.studentClass?.className || "-",
    },
    {
      field: 'parentName',
      headerName: 'Parent Name',
    },
    {
      field: 'parentContact',
      headerName: 'Parent Contact',
    },
    {
      field: 'action',
      headerName: "Action",
      renderCell: (row) => (
        <div className="flex items-center gap-3">
          <button 
            onClick={() => handlePromoteStudent(row)} 
            className="w-10 h-10 hover:text-purpleColor  rounded-lg overflow-hidden flex flex-row justify-center items-center"
          >
            <PenSquare size={20} />
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
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
    
      {/* Update Student Modal */}
      <div
        className={`
          fixed inset-0 flex items-center justify-center 
          bg-black bg-opacity-50 z-50 
          ${
            showUpdateStudent
              ? "opacity-100 visible"
              : "opacity-0 invisible pointer-events-none"
          }
          transition-all duration-300 ease-in-out
        `}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowUpdateStudent(false);
            setSelectedStudent(null);
          }
        }}
      >
        {showUpdateStudent && selectedStudent && (
          <div
            className={`
              relative rounded-xl w-auto max-h-[90vh] overflow-y-auto 
              bg-white
              custom-scrollbar
              ${
                showUpdateStudent
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-95 -translate-y-4 pointer-events-none"
              }
              transition-all duration-300 ease-in-out
              transform origin-center
            `}
          >
            <button
              onClick={() => {
                setShowUpdateStudent(false);
                setSelectedStudent(null);
              }}
              className="absolute top-6 right-4 p-2 bg-white rounded-full text-black-300 transition-colors duration-200 transform hover:scale-110"
            >
              <X size={24} />
            </button>
            <UpdateStudents 
              studentData={selectedStudent} 
              onClose={() => {
                setShowUpdateStudent(false);
                setSelectedStudent(null);
              }} 
            />
          </div>
        )}
      </div>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row text-black justify-between items-start md:items-center mb-[32px] p-2">
        <div className="mb-4 md:mb-0 text-left">
          <h2 className="h2 mb-2 text-left">Student Promotion</h2>
          <div className="flex items-center subtitle-2 text-left">
            <span className="text-left">Students Details / </span>
            <span className="text-left">Student Promotion</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-2 rounded-md shadow-lg">
      

        {/* Table Component */}
        <Table
          columns={columns}
          data={students || []}
          checkboxSelection={false}
          actions={false}
          extraClasses="m-4"
        />
      </div>

      {/* Pagination Component */}
      {paginationData.totalPages > 0 && (
        <Pagination
          currentPage={paginationData.currentPage}
          totalPages={paginationData.totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default PromoteStudents;