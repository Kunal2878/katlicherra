import React, { useState, useEffect } from "react";
import {
  Loader,
  GraduationCap,
  Plus,
  X,
  Eye,
  School2
} from "lucide-react";
import AddStudents from "../../Pages/Student/AddStudent";
import UpdateStudents from "../../Pages/Student/UpdateStudent";
import ViewStudentDetails from '../../Pages/Student/ViewStudentsDetails/ViewStudentDetails';
import { useSelector, useDispatch } from "react-redux";
import Cookies from 'js-cookie'
import { setStudentData, setCurrentPage,setIsStudentUpdate,setShowConfirmationModel,setStatus, setAddText,setConfirmRequest } from "../../../Store/slice"; 
import { toast } from 'react-toastify';
import {  GetAllClassesAPI,GetStudentByClassAPI,DeleteStudentAPI} from '../../../service/api';
import Table from "../Elements/Table";
import Pagination from "../Elements/Pagination";
import SelectDropdown from "../Elements/SelectDropDownList";
import Confirmation from "../Elements/ConfirmationModel"

const StudentDetails = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [classData, setClassData] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [showUpdateStudent, setShowUpdateStudent] = useState(false);
  const [showViewStudent, setShowViewStudent] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showToast, setShowToast]=useState(false)
  const [toastMessage, setToastMessage]=useState('')
  const [toastType, setToastType]=useState('')
  const [showFailure, setShowFailure] = useState(false);
  const [paginationData, setPaginationData] = useState({
    currentPage: 1,
    totalItems: 0,
    totalPages: 0
  });
  const students = useSelector((state) => state.userData.StudentData);
   const isStudentUpdate = useSelector((state) => state.userData.isStudentUpdate);
  const url = import.meta.env.VITE_API_BASE_URL;
  const token = Cookies.get("token");
  const dispatch = useDispatch();
  const currentPage = useSelector((state) => state.userData.CurrentPage);
  const confirmRequest = useSelector((state) => state.userData.confirmRequest);
  const showConfirmation = useSelector((state) => state.userData.showConfirmationModel);
  useEffect(() => {
    document.title = "Student Details";
    dispatch(setCurrentPage(1));
  }, []);

  const fetchClasses = async () => {

    setLoading(true)
      const response = await GetAllClassesAPI(url)
      if(response.status===200 || response.status===201 || response.status===204){
        if(response.data.classes.length === 0) {
          setShowFailure(true);
        }
        setClassData(response.data.classes);
        setSelectedClass(response.data.classes[0]?._id);
      }
      else {

        setShowToast(true);
        setToastMessage(response.message);
        setToastType('error');
        setShowFailure(true);
      }
    setLoading(false)
  };
  const fetchStudentsByClass = async () => {
    setLoading(true)
    // setShowFailure(!showFailure)
      const response = await GetStudentByClassAPI(url,selectedClass)
      if(response.status===200 || response.status===201 || response.status===204){
        
        dispatch(setStudentData(response.data.students || []));
      }
      else {
        setShowToast(true);
        setToastMessage(response.message);
        setToastType('error');
        dispatch(setStudentData([]));
        setShowFailure(true);
      }
    setLoading(false)
  };
useEffect(()=>{
  if(selectedClass){
    fetchStudentsByClass()
  }
},[selectedClass])

useEffect(()=>{
  fetchClasses()
},[])
useEffect(()=>{
  if(isStudentUpdate){
    fetchStudentsByClass()
    dispatch(setIsStudentUpdate(false))
  }


},[isStudentUpdate])



useEffect(()=>{
  if(classData.length === 0 || students.length===0) {
    setShowFailure(true);
  } else {
    setShowFailure(false);
  }
},[classData, students])

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

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
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
      field: 'parentName',
      headerName: 'Parent Name',
    },
    {
      field: 'parentContact',
      headerName: 'Parent Contact',
    },
    {
      field: 'view',
      headerName: 'View',
      renderCell: (row) => (
        <Eye
          className=" cursor-pointer text-blue-500 hover:text-blue-700"
          size={20}
          onClick={() => handleViewStudent(row)}
        />
      ),
    },
  ];


  const handleViewStudent = (student) => {
  
    setSelectedStudent(student);
    setShowViewStudent(true);
  };

  const handleDeleteStudent = (student) => {
  setSelectedStudent(student);
  dispatch(setShowConfirmationModel(true));
  };
  
 useEffect(()=>{
if(confirmRequest)
{
  DeleteStudent();

}
  },[confirmRequest])

const DeleteStudent = async () => {
 
    const payload = {id: selectedStudent._id}
     const response = await DeleteStudentAPI(url, payload,token)
      
      // Update the UI by removing the deleted subject from both lists
      if(response.status===200 || response.status===201 || response.status===204){
    
     
      
      dispatch(setStatus("success"))
      dispatch(setAddText(response.message))
      fetchStudentsByClass()
      

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

    
      setSelectedStudent(null);
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

 
  return (
    <div className="sm:px-16 px-6 sm:py-16 py-10 min-h-screen">
      {/* Add Student Modal */}
      <div
        className={`
          fixed inset-0 flex items-center justify-center 
          bg-black bg-opacity-50 z-50 
          ${
            showAddStudent
              ? "opacity-100 visible"
              : "opacity-0 invisible pointer-events-none"
          }
          transition-all duration-300 ease-in-out
        `}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowAddStudent(false);
          }
        }}
      >
        {showAddStudent && (
          <div
            className={`
              relative rounded-xl w-auto max-h-[90vh] overflow-y-auto 
              bg-white
              custom-scrollbar
              ${
                showAddStudent
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-95 -translate-y-4 pointer-events-none"
              }
              transition-all duration-300 ease-in-out
              transform origin-center
            `}
          >
            <button
              onClick={() => setShowAddStudent(false)}
              className="absolute top-6 right-4 p-2 z-100 rounded-full text-black-300 transition-colors duration-200 transform hover:scale-110"
            >
              <X size={24} />
            </button>
            <AddStudents onClose={() => setShowAddStudent(false)} />
          </div>
        )}
      </div>
      
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
              onClick={() => setShowUpdateStudent(false)}
              className="absolute top-6 right-4 p-2 bg-white rounded-full text-black-300 transition-colors duration-200 transform hover:scale-110"
            >
              <X size={24} />
            </button>
            <UpdateStudents 
              studentData={selectedStudent} 
              // isUpdate={true} 
              onClose={() => {
                setShowUpdateStudent(false);
                setSelectedStudent(null);
              }} 
            />
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
            message={`Are you sure you want to delete the Student: ${selectedStudent?.name}? This action cannot be undone.`}
            note=""/>
        </div>
      )}



      {/* View Student Modal */}
      <div
        className={`
          fixed inset-0 flex items-center justify-center 
          bg-black bg-opacity-50 z-50 
          ${
            showViewStudent
              ? "opacity-100 visible"
              : "opacity-0 invisible pointer-events-none"
          }
          transition-all duration-300 ease-in-out
        `}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowViewStudent(false);
          }
        }}
      >
        {showViewStudent && selectedStudent && (
          <div
            className={`
              relative rounded-xl w-auto max-h-[90vh] overflow-y-auto 
              bg-white
              custom-scrollbar
              ${
                showViewStudent
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-95 -translate-y-4 pointer-events-none"
              }
              transition-all duration-300 ease-in-out
              transform origin-center
            `}
          >
            <button
              onClick={() => setShowViewStudent(false)}
              className="absolute top-4  mb-4 right-4 p-2  rounded-full text-black-300 transition-colors duration-200 transform hover:scale-110"
            >
              <X size={24} />
            </button>
            <ViewStudentDetails 
              studentData={selectedStudent}
              onClose={() => {
                setShowViewStudent(false);
                setSelectedStudent(null);
              }}
            />
          </div>
        )}
      </div>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row text-black justify-between items-start md:items-center mb-[32px] p-2">


        <div className="mb-4 md:mb-0 text-left">
          <h2 className="h2 mb-2 text-left">Student List</h2>
          <div className="flex items-center subtitle-2 text-left">
            <span className="">Students Details / </span>
            <span>Student List</span>
          </div>
        </div>
        <button
          onClick={() => setShowAddStudent(true)}
          className="flex items-center p-2 bg-success-500 text-white rounded-full transition-colors duration-200 transform hover:scale-105"
        >
          <h1 className="h1">
            <Plus size={24} />
          </h1>
        </button>
      </div>

      {/* Filters */}
      <div className=" flex flex-col justify-start bg-white p-2 rounded-md shadow-lg">
      <div className=" flex flex-row align-left  m-4 sm:w-96 md:w-[24rem] lg:w-[28rem]">
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
       
       
    

        {/* Table Component */}
        <Table
          columns={columns}
          data={students || []}
          checkboxSelection={false}
          actions={true}
          // onEdit={handleEditStudent}
          onDelete={handleDeleteStudent}
          extraClasses="m-4"
        />
      
      {students.length===0 &&(
  <p className="text-gray-500 text-lg mb-6">No students available yet, be the first to create one</p>

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

// Add custom animation class
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

export default StudentDetails;