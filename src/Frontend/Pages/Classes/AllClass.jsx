import React, { useState, useEffect } from "react";
import {
  Search,
  Trash2,
  PenSquare,
  GraduationCap,
  Plus,
  Loader,
  X,Eye,
} from "lucide-react";
import RegisterClass from "./RegisterClass";
import UpdateClasses from "./UpdateClass"
import { useSelector, useDispatch } from "react-redux";
import { setClassData,setCurrentPage,setConfirmRequest,setShowConfirmationModel,setStatus, setAddText } from "../../../Store/slice";
import { GetClasses,DeleteClassAPI } from '../../../service/api';
import { toast } from 'react-toastify';
import Cookies from "js-cookie";
import Table from "../../Components/Elements/Table";
import Pagination from "../../Components/Elements/Pagination";
import Confirmation from "../../Components/Elements/ConfirmationModel"


const AllClasses = () => {
  const url = import.meta.env.VITE_API_BASE_URL;
  const token = Cookies.get("token");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddTeacher, setShowAddTeacher] = useState(false);
  const [showUpdateClass, setshowUpdateClass] = useState(false);
  const [selectedClass, setselectedClass] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');
  const [showFailure, setShowFailure] = useState(false);
  const [paginationData, setPaginationData] = useState({
    currentPage: 1,
    totalItems: 0,
    totalPages: 0
  });
  const classes = useSelector((state) => state.userData.ClassData);
  const currentPage = useSelector((state) => state.userData.CurrentPage);
  const showConfirmation = useSelector((state) => state.userData.showConfirmationModel);
  const confirmRequest = useSelector((state) => state.userData.confirmRequest);
  const dispatch = useDispatch();
  
  useEffect(() => {
    document.title = "All Classes";
    dispatch(setCurrentPage(1));
  }, []);
  useEffect(() => {
    setShowFailure(classes.length === 0);
  }, [classes]);

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
    const response = await GetClasses(url);
    if (response.status === 200 || response.status === 204 || response.status === 201) {
      dispatch(setClassData(response.data.classes));
      setPaginationData({
        currentPage: response.data.pagination.currentPage|| 1,
        totalItems: response.data.pagination.totalItems,
        totalPages: response.data.pagination.totalPages,
        totalItemsPerPage: response.data.pagination.studentsPerPage ||10
      });
      if(response.data.classes.length === 0) {
      
        setShowToast(true);
        setToastMessage("No classes found");
        setToastType("info");
      }
    } else {
      setError(response.message);
 
      setShowToast(true);
      setToastMessage(response.message);
      setToastType("error");
    }
    setLoading(false);
  };
  useEffect(() => {
    

    fetchClasses();
    
  }, [currentPage]);

  const handleTimeTableClick = (url) => {
    if (url) {
      window.open(url, "_blank");
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const columns = [
    {
      field: 'classTeacher',
      headerName: 'Class Teacher',
      renderCell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-purple-100 rounded-full overflow-hidden flex flex-row justify-center items-center">
            <GraduationCap size={20} />
          </div>
          <span>{row.classTeacher?.name || "-"}</span>
        </div>
      ),
    },
    {
      field: 'className',
      headerName: 'Class',
    },
    {
      field: 'section',
      headerName: 'Section',
    },
    {
      field: 'timeTable',
      headerName: 'Time Table',
      renderCell: (row) => (
        row.timeTable && (
          <button
            onClick={() => handleTimeTableClick(row.timeTable)}
            className="p-1 hover:text-purpleColor transition-colors duration-200 transform hover:scale-110"
          >
            <Eye size={18} />
          </button>
        )
      ),
    },
  ];
  const handleEditClass = (classItem) => {
      setselectedClass(classItem);
      setshowUpdateClass(true);
  };

  const handleDeleteClass = async (classItem) => {
    setselectedClass(classItem);
    dispatch(setShowConfirmationModel(true))
   
  };

const DeleteClass = async ()=>{

      const response = await DeleteClassAPI(url, token, selectedClass?._id);
      if (response.status ===200 ||response.status ===201 || response.status ===204 ) {
        dispatch(setStatus("success"))
        dispatch(setAddText(` ${selectedClass?.className} deleted successfully`))
        
        fetchClasses();
      } else {
        dispatch(setStatus("error"))
        dispatch(setAddText(response.message))
       

        if(response.status ===401)
        {
          Cookies.remove('token');
                    Cookies.remove('user');
                    window.location.href = '/user-options';
          
        }
      }
      setTimeout(() => {
        dispatch(setStatus(''));
        dispatch(setAddText(''));
        dispatch(setShowConfirmationModel(false));
      }, 3000);
      dispatch(setConfirmRequest(false))
}


useEffect( ()=>{
  if(confirmRequest)
    {
    DeleteClass()
    }
},[confirmRequest])


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
      <div className="flex flex-col md:flex-row text-black-300 justify-between items-start md:items-center mb-6 p-2">
        <div className="mb-4 md:mb-0 text-left">
          <h2 className="h2 text-2xl font-medium mb-2 text-left">All Classes</h2>
          <div className="flex items-center text-sm subtitle-2 text-left">
            <span className="mr-2">Classes /</span>
            <span>All Classes</span>
          </div>
        </div>
        <button
          onClick={() => setShowAddTeacher(true)}
          className="flex items-center p-2 bg-success-500 text-white rounded-full transition-colors duration-200 transform hover:scale-105"
        >
          <span>
            <Plus size={20} />
          </span>
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
            relative rounded-lg w-auto max-h-[90vh] overflow-y-auto 
            bg-white 
            custom-scrollbar
            ${showAddTeacher ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-4 pointer-events-none"}
            transition-all duration-300 ease-in-out
            transform origin-center
          `}>
            <button
              onClick={() => setShowAddTeacher(false)}
              className="absolute top-6 lg:top-6 right-6 p-2 bg-white rounded-full text-black-300 hover:text-gray-800 transition-colors duration-200 transform hover:scale-110"
            >
              <X size={24} />
            </button>
            <RegisterClass onClose={() => setShowAddTeacher(false)} />
          </div>
        )}
      </div>
      <div
        className={`
          fixed inset-0 flex items-center justify-center 
          bg-black bg-opacity-50 z-50 
          ${
            showUpdateClass
              ? "opacity-100 visible"
              : "opacity-0 invisible pointer-events-none"
          }
          transition-all duration-300 ease-in-out
        `}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setshowUpdateClass(false);
          }
        }}
      >
        {showUpdateClass && selectedClass && (
          <div
            className={`
              relative rounded-xl w-auto max-h-[90vh] overflow-y-auto 
              bg-white
              custom-scrollbar
              ${
                showUpdateClass
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-95 -translate-y-4 pointer-events-none"
              }
              transition-all duration-300 ease-in-out
              transform origin-center
            `}
          >
            <button
              onClick={() => setshowUpdateClass(false)}
              className="absolute top-6 right-4 p-2 bg-white rounded-full text-black-300 transition-colors duration-200 transform hover:scale-110"
            >
              <X size={24} />
            </button>
            <UpdateClasses 
              classData={selectedClass} 
              onClose={() => {
                setshowUpdateClass(false);
                setselectedClass(null);
              }} 
            />
          </div>
        )}
      </div>

          {/* Confirmation Modal for Fine Imposition */}
      {showConfirmation && (
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
              setselectedClass(null);
            }
          }}
        >
          <Confirmation 
            message={`Are you sure you want to delete class${selectedClass?.className}? This action cannot be undone and will remove all associated student data.`}
            note=""          />
        </div>
      )}





      <div className="bg-white rounded-lg shadow-lg p-4">

      
          <Table
            columns={columns}
            data={classes}
            checkboxSelection={false}
            actions={true}
            onEdit={handleEditClass}
            onDelete={handleDeleteClass}
            extraClasses="m-4"
          />
   {classes.length === 0 &&(
        <p className="text-gray-500 text-lg mb-6">No classes available yet, be the first to create one</p>

      )}
 
      </div>

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

export default AllClasses;