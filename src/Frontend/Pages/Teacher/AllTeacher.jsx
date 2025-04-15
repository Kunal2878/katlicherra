import React, { useState, useEffect } from "react";
import {
  Search,
  GraduationCap,
  Plus,
  Loader,
  X,
  Eye,
} from "lucide-react";
import AddTeachers from "../../Pages/Teacher/AddTeacher";
import { useSelector, useDispatch } from "react-redux";
import Cookies from 'js-cookie'
import { setTeacherData,setCurrentPage,setConfirmRequest,setShowConfirmationModel,setStatus, setAddText,setIsTeacherUpdate  } 
from "../../../Store/slice";
import { GetTeachersPages,DeleteTeacherAPI } from '../../../service/api';
import Table from "../../Components/Elements/Table";
import Pagination from "../../Components/Elements/Pagination";
import ViewTeacherDetails from './ViewTeacherDetails/ViewTeacherDetails';
import { toast } from 'react-toastify';
import Confirmation from "../../Components/Elements/ConfirmationModel"

const TeacherDetails = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddTeacher, setShowAddTeacher] = useState(false);
  const [showViewTeacher, setShowViewTeacher] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');
  const [showFailure, setShowFailure] = useState(false);
  const [paginationData, setPaginationData] = useState({
    currentPage: 1,
    totalItems: 0,
    totalPages: 0
  });
  const url = import.meta.env.VITE_API_BASE_URL;
  const token = Cookies.get("token");
  const currentpage = useSelector((state) => state.userData.CurrentPage);
  const teachers = useSelector((state) => state.userData.TeacherData);
  const confirmRequest = useSelector((state) => state.userData.confirmRequest);
  const showConfirmation = useSelector((state) => state.userData.showConfirmationModel);
  const IsTeacherUpdate = useSelector((state) => state.userData.isTeacherUpdate);
  const dispatch = useDispatch();

  useEffect(() => {
    document.title = "Teacher Details";
    dispatch(setCurrentPage(1));
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

  const fetchTeachers = async () => {
    dispatch(setTeacherData([]));
    setLoading(true);
    const response = await GetTeachersPages(url,currentpage);
    if (response.status === 200 || response.status === 204 || response.status === 201) {
      dispatch(setTeacherData(response.data.teachers));
      setPaginationData({
        currentPage: response.data.pagination.currentPage || 1,
        totalItems: response.data.pagination.totalTeachers,
        totalPages: response.data.pagination.totalPages,
        totalItemsPerPage: response.data.pagination.teachersPerPage ||10,
      });
    
          
        } else {

          setError(response.message);
          setShowFailure(true);
          setShowToast(true);
          setToastMessage(response.message);
          setToastType("error");
          dispatch(setTeacherData([]));
          setTimeout(() => {
            setShowFailure(false);
          }, 2000);
        }
        setLoading(false)
      };

      useEffect(() => {
      fetchTeachers();
  }, [currentpage]);

      useEffect(() => {
        if(IsTeacherUpdate)
        {
          fetchTeachers();
          dispatch(setIsTeacherUpdate(false))

        }
  }, [IsTeacherUpdate]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const columns = [
    {
      field: 'name',
      headerName: "Teacher's Name",
      renderCell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-purple-100 rounded-full overflow-hidden flex flex-row justify-center items-center">
            <GraduationCap size={20} />
          </div>
          <span>{row.name}</span>
        </div>
      ),
    },
    {
      field: 'email',
      headerName: 'Email',
    },
    {
      field: 'salary',
      headerName: 'Salary',
      renderCell: (row) => row.salary || "-",
    },
    {
      field: 'view',
      headerName: 'View',
      renderCell: (row) => (
        <button
          onClick={() => {
            setSelectedTeacher(row);
            setShowViewTeacher(true);
          }}
          className="p-2 text-blue-500 hover:text-blue-700 transition-colors duration-200"
        >
          <Eye size={20} />
        </button>
      ),
    },
  ];

  const handleEditTeacher = (teacher) => {

  };

  const handleDeleteTeacher = (teacher) => {
    setSelectedTeacher(teacher);
    dispatch(setShowConfirmationModel(true));

  };

 useEffect(()=>{
if(confirmRequest)
{
  DeleteTeacher();
  
}
  },[confirmRequest])


const DeleteTeacher = async () => {
 
    const payload = {id: selectedTeacher._id}
     const response = await DeleteTeacherAPI(url, payload,token)
      
      // Update the UI by removing the deleted subject from both lists
      if(response.status===200 || response.status===201 || response.status===204){
    
     
      
      dispatch(setStatus("success"))
      dispatch(setAddText(response.message))
      fetchTeachers()
      

    } 

    else  {
   
      dispatch(setStatus("error"))
      dispatch(setAddText(response.message || "An error occoured, please try after sometime"))
      
      
      if (response.status === 401) {  
        Cookies.remove('user');
        Cookies.remove('token');
        window.location.href = '/user-options';      
      }
    }

    
      setSelectedTeacher(null);
      setTimeout(() => {
        dispatch(setStatus(''));
        dispatch(setAddText(''));
        dispatch(setShowConfirmationModel(false));
        dispatch(setConfirmRequest(false))
      }, 3000);


    
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex items-center justify-center h-96">
          <Loader className="h-12 w-12 animate-spin text-purpleColor" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-danger">
        {error}
      </div>
    );
  }

  return (
    <div className="sm:px-16 px-6 sm:py-16 py-10 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row text-black-300 justify-between items-start md:items-center mb-6 p-2">
        <div className="mb-4 md:mb-0 text-left">
          <h2 className="h2 text-2xl font-medium mb-2 text-left">All Teachers </h2>
          <div className="flex items-center text-sm subtitle-2 text-left">
            <span className="mr-2">Teachers /</span>
            <span> All Teachers</span>
          </div>
        </div>
        <button
          onClick={() => setShowAddTeacher(true)}
          className="flex items-center p-2 bg-success-500 text-white rounded-full transition-colors duration-200 transform hover:scale-105"
        >
          <h1 className="h1">
            <Plus size={24} />
          </h1>
        </button>
      </div>

      <div
        className={`
          fixed inset-0 flex items-center justify-center 
          bg-black bg-opacity-50 z-50 
          ${showAddTeacher ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}
          transition-all duration-300 ease-in-out
        `}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowAddTeacher(false);
          }
        }}
      >
        {showAddTeacher && (
          <div className={`
            relative rounded-xl w-auto max-h-[90vh] overflow-y-auto 
            bg-white 
            custom-scrollbar
            ${showAddTeacher ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-4 pointer-events-none"}
            transition-all duration-300 ease-in-out
            transform origin-center
          `}>
            <button
              onClick={() => setShowAddTeacher(false)}
              className="absolute top-6 right-4 p-2 bg-white rounded-full text-black-300 hover:text-gray-800 transition-colors duration-200 transform hover:scale-110"
            >
              <X size={24} />
            </button>
            <AddTeachers onClose={() => setShowAddTeacher(false)} />
          </div>
        )}
      </div>

      <div
        className={`
          fixed inset-0 flex items-center justify-center 
          bg-black bg-opacity-50 z-50 
          ${showViewTeacher ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}
          transition-all duration-300 ease-in-out
        `}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowViewTeacher(false);
          }
        }}
      >
        {showViewTeacher && (
          <div className={`
            relative rounded-xl w-auto max-h-[90vh] overflow-y-auto 
            bg-white 
            custom-scrollbar
            ${showViewTeacher ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-4 pointer-events-none"}
            transition-all duration-300 ease-in-out
            transform origin-center
          `}>
            <button
              onClick={() => setShowViewTeacher(false)}
              className="absolute top-6 right-4 p-2 bg-white rounded-full text-black-300 hover:text-gray-800 transition-colors duration-200 transform hover:scale-110"
            >
              <X size={24} />
            </button>
            <ViewTeacherDetails TeacherData={selectedTeacher} onClose={() => setShowViewTeacher(false)} />
          </div>
        )}
      </div>

{/* Delete Student confirmation model */}

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
            message={`Are you sure you want to delete the Teacher: ${selectedTeacher?.name}? This action cannot be undone.`}
            note=""/>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg p-4">

        {/* Table Component */}
        <Table
          columns={columns}
          data={teachers || []}
          checkboxSelection={false}
          actions={true}
          // onEdit={handleEditTeacher}
          onDelete={handleDeleteTeacher}
          extraClasses="m-4"
        />

{teachers.length === 0 && (

<div className="flex flex-col items-center justify-center mt-4 p-4 ">
  
              <p className="text-gray-500 text-lg mb-6">No teachers available yet, be the first to create one</p>

</div>       
 )}

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

export default TeacherDetails;