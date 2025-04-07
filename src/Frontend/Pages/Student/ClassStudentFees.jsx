import React, { useState, useEffect } from "react";
import {
  Search,
  Loader,
  IndianRupee,
  Plus,
  X,
  Calendar,
  Filter,
  Eye
} from "lucide-react";
import AddStudentFees from "./AddStudentFee";
import Cookies from 'js-cookie'
import { useSelector, useDispatch } from "react-redux";
import { setStudentFinanceData, setCurrentPage, setShowConfirmationModel,setStatus, setAddText,
  setConfirmRequest } from "../../../Store/slice";
import { GetTransactionsByTeacherAPI, GetClasses,GetAllClassesAPI, ImposeFineAPI,GetClassFeeTransactionAPI, 
  FilterTransactionAPI, DeleteTransactionAPI } from '../../../service/api';
import Table from "../../Components/Elements/Table";
import ViewStudentFees from "../Student/ViewStudentsDetails/ViewStudentFeeHistory"
import Pagination from "../../Components/Elements/Pagination";
import { toast } from 'react-toastify';
import StudentFeePieChart from "../../Components/Elements/PieChartModel"
import Confirmation from "../../Components/Elements/ConfirmationModel"
import ViewStudentFeeTabs from './StudentFeeTab'
const ClassStudentFees = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [displayMonth, setDisplayMonth] = useState("");
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedClassName, setSelectedClassName] = useState("");
  const [showViewStudent, setShowViewStudent] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [classFee, setClassFee] = useState(null)
  // const [status, setStatus] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');
  // const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedFineStudent, setSelectedFineStudent] = useState(null);
  const [paginationData, setPaginationData] = useState({
    currentPage: 1,
    totalItems: 0,
    totalPages: 0
  });

  const transactions = useSelector((state) => state.userData.StudentFinanceData);
  const showConfirmation = useSelector((state) => state.userData.showConfirmationModel);
  const confirmRequest = useSelector((state) => state.userData.confirmRequest);
  // const status = useSelector((state) => state.userData.status);
  // const addText = useSelector((state) => state.userData.addText);

  const dispatch = useDispatch();
  const currentPage = useSelector((state) => state.userData.CurrentPage);
  const confirmationStatus = useSelector((state) => state.userData.confirmationStatus);
  const url = import.meta.env.VITE_API_BASE_URL;
  const token = Cookies.get("token");

  useEffect(() => {
    document.title = "Student Fees";
    dispatch(setCurrentPage(1));
    fetchClasses();
  
    // Set initial display month
    const monthNames = ["January", "February", "March", "April", "May", "June", 
                        "July", "August", "September", "October", "November", "December"];
    setDisplayMonth(monthNames[selectedMonth.getMonth()]);
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

  // Handle fine imposition confirmation result
  useEffect(() => {
    if (confirmationStatus === false) {
      dispatch(setShowConfirmationModel(false))
      setSelectedFineStudent(null);
    }
    if (confirmRequest === true && selectedFineStudent) {
      handleImposeFineConfirmed(selectedFineStudent);

    }
  }, [confirmRequest]);

  const fetchClasses = async () => {
    const response = await GetAllClassesAPI(url);
    if (response.status === 200 || response.status === 201) {
      setClasses(response.data.classes);
    } else {
      setClasses([]);
      setError("Failed to fetch classes list");
      setShowToast(true);
      setToastMessage(response.message||"Failed to fetch classes list");
      setToastType("error");
    }
  };

  const fetchTransactions = async () => {
    if (!selectedClass) {
      setError("Please select a class first");
      setShowToast(true);
      setToastMessage("Please select a class first");
      setToastType("error");
      return;
    }
  
    setLoading(true);
    const response = await GetClassFeeTransactionAPI(url, token, selectedClass, displayMonth);
    if (response.status === 200 || response.status === 204 || response.status === 201) {
      dispatch(setStudentFinanceData(response.data));
      setPaginationData({
        currentPage: response.data.currentPage || 1,
        totalItems: response.data.totalItems || 0,
        totalPages: response.data.totalPages || 0
      });
    
    } else {
      dispatch(setStudentFinanceData([]));
      setError(response.message);
      setShowToast(true);
      setToastMessage(response.message);
      setToastType("error");
      if (response.status === 401) {  
        Cookies.remove('user');
        Cookies.remove('token');
        window.location.href = '/user-options';                      
      }
    }
 
    setLoading(false);
  };




  const handleDeleteTransaction = async (transaction) => {
    try {
      const response = await DeleteTransactionAPI(url, token, transaction._id);
      if (response.status === 200 || response.status === 204) {
        setShowToast(true);
        setToastMessage("Transaction deleted successfully");
        setToastType("success");
        fetchTransactions();
      } else {
        setError("Failed to delete transaction");
        setShowToast(true);
        setToastMessage("Failed to delete transaction");
        setToastType("error");
      }
    } catch (err) {
      setError(err.message || "Failed to delete transaction");
      setShowToast(true);
      setToastMessage(err.message || "Failed to delete transaction");
      setToastType("error");
    }
  };

  const handleImposeFine = (student) => {
    if (student.imposeFine) return; // Do nothing if fine is already imposed
    
    setSelectedFineStudent(student);
    dispatch(setShowConfirmationModel(true))
  };

  const handleImposeFineConfirmed = async (student) => {
  
    const payload={
      studentId: student?.student?._id,
      month: displayMonth,
    }

 

    if(confirmRequest){

    
const response = await ImposeFineAPI(url, payload,token)

if(response.status ===200 || response.status ===201 ||response.status ===204) 
{
dispatch(setStatus("success"))
dispatch(setAddText(`Fine imposed on ${student.student.name} successfully`))
 
setTimeout(() => {
  dispatch(setStatus(''));
  dispatch(setAddText(''));
  dispatch(setShowConfirmationModel(false));
}, 3000);

fetchTransactions();

    } 
    
    else 
    
    {
      dispatch(setStatus("error"))
      dispatch(setAddText(response.message))
       
      setTimeout(() => {
        dispatch(setStatus(''));
        dispatch(setAddText(''));
        dispatch(setShowConfirmationModel(false));
      }, 3000);
    }

  }
dispatch(setConfirmRequest(false))

  };

  const handlePageChange = (newPage) => {
    dispatch(setCurrentPage(newPage));
  };

  const handleMonthChange = (e) => {
    const [year, month] = e.target.value.split('-');
    const date = new Date(year, month - 1);
    setSelectedMonth(date);
    
    // Update display month
    const monthNames = ["January", "February", "March", "April", "May", "June", 
                      "July", "August", "September", "October", "November", "December"];
    setDisplayMonth(monthNames[parseInt(month) - 1]);
  };

  const handleClassChange = (e) => {
    const classId = e.target.value;
    setSelectedClass(classId);
    
    // Set class name for display
    const selectedClassObj = classes.find(c => c._id === classId);
    if (selectedClassObj) {
      setSelectedClassName(selectedClassObj.className);
    }
  };

  const handleStatusChange = (e) => {
    // setStatus(e.target.value);
  };

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setShowViewStudent(true);
  };

  const handleFilter = () => {
    if (selectedClass) {
      fetchTransactions();
    }
  };

  const getFormattedMonth = () => {
    const year = selectedMonth.getFullYear();
    const month = (selectedMonth.getMonth() + 1).toString().padStart(2, '0');
    return `${year}-${month}`;
  };

  const columns = [
    {
      field: 'student',
      headerName: 'Student Name',
      renderCell: (row) => (
        <div className="flex items-center gap-2">
          <span>{row.student.name || '-'}</span>
        </div>
      ),
    },
    {
      field: 'class',
      headerName: 'Class',
      renderCell: () => (
        <div className="flex items-center gap-2">
          <span>{selectedClassName || '-'}</span>
        </div>
      ),
    },
    {
      field: 'month',
      headerName: 'Month',
      renderCell: () => (
        <div className="flex items-center gap-2">
          <span>{displayMonth || '-'}</span>
        </div>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      renderCell: (row) => (
        <div className={`px-2 py-2 flex items-center lg:py-1 rounded-lg lg:rounded-full text-sm ${
          row.status === 'paid' ? ' text-success-500' : ' text-danger'
        }`}>
          {row.status || '-'}
        </div>
      ),
    },
    {
      field: 'details',
      headerName: 'Impose Fine',
      renderCell: (row) => (
        <div className="flex items-center justify-start lg:ml-6">
          {row?.details?.isLateFeeApplied ? (
            <input
              type="radio"
              checked={true}
              disabled={true}
              className="h-4 w-4 appearance-none bg-red-500 text-black-3000 border-black-300 rounded focus:ring-blue-500"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e")`
              }}
            />
          ) : (
            <button 
              onClick={() => handleImposeFine(row)}
              className="text-yellow-600 hover:text-danger transition-colors font-black flex flex-row justify-center items-center"
              title="Impose Fine"
            >
              <IndianRupee size={18} className="stroke-current" />
            </button>
          )}
        </div>
      ),
    },
    {
      field: 'view',
      headerName: 'View',
      renderCell: (row) => (
        <Eye
          className="cursor-pointer text-blue-500 hover:text-blue-700"
          size={20}
          onClick={() => handleViewStudent(row)}
        />
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
      {/* Add Transaction Modal */}
      <div
        className={`
          fixed inset-0 flex items-center justify-center 
          bg-black bg-opacity-50 z-50 
          ${showAddTransaction ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}
          transition-all duration-300 ease-in-out
        `}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowAddTransaction(false);
          }
        }}
      >
        {showAddTransaction && (
          <div className="relative rounded-xl w-auto max-h-[90vh] overflow-y-auto bg-white custom-scrollbar space-y-4">
            <button
              onClick={() => setShowAddTransaction(false)}
              className="absolute top-4 right-4 p-2 bg-white rounded-full text-black-300 transition-colors duration-200 transform hover:scale-110"
            >
              <X size={24} />
            </button>
            <ViewStudentFeeTabs onClose={() => {
              setShowAddTransaction(false);
              fetchTransactions(); // Refresh data after adding
            }} />
          </div>
        )}
      </div>
      
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
              className="absolute top-4 mb-4 right-4 p-2 rounded-full text-black-300 transition-colors duration-200 transform hover:scale-110"
            >
              <X size={24} />
            </button>
            <ViewStudentFees 
              studentData={selectedStudent}
              onClose={() => {
                setShowViewStudent(false);
                setSelectedStudent(null);
              }}
            />
          </div>
        )}
      </div>

      {/* Confirmation Modal for Fine Imposition */}
      {showConfirmation && selectedFineStudent && (
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
              setSelectedFineStudent(null);
            }
          }}
        >
          <Confirmation 
            message={`Are you sure you want to impose a fine on ${selectedFineStudent.student.name}?This action cannot be undone.`} 
            note=" The student's parent will be notified about the fine via. email which is now under maintenance"
          />
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row text-black justify-between items-start md:items-center mb-[32px] p-2">
        <div className="mb-4 md:mb-0 text-left">
          <h2 className="h2 mb-2 text-left">Student Fees</h2>
          <div className="flex items-center subtitle-2 text-left">
            <span className="text-left">Accounting / </span>
            <span className="text-left">Student Fees</span>
          </div>
        </div>
        <button
          onClick={() => setShowAddTransaction(true)}
          className="flex items-center p-2 bg-success-500 text-white rounded-full transition-colors duration-200 transform hover:scale-105"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-2 rounded-md shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mt-[16px] mb-[32px] bg-white flex-wrap">
          <div className="flex flex-wrap gap-4 p-2">
            {/* Class Selection Dropdown */}
            <div className="relative min-w-[200px]">
              <select
                value={selectedClass}
                onChange={(e) => {
                  handleClassChange(e)
                  const selectedFee = classes.find(c => c._id === e.target.value)?.fee || 0
                  setClassFee(selectedFee)
                }}
                className="p-2 pl-3 border rounded-lg bg-primary-300 text-black-300 border-lamaSkyLight transition-all duration-200 h-11 w-full"
              >
                <option value="">Select Class</option>
                {classes.map((classItem) => (
                  <option key={classItem._id} value={classItem._id}>
                    {classItem.className}
                  </option>
                ))}
              </select>
            </div>
            {/* Month Selection */}
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2" size={20} />
              <input
                type="month"
                value={getFormattedMonth()}
                onChange={handleMonthChange}
                className="p-2 pl-10 border rounded-lg bg-primary-300 text-black-300 border-lamaSkyLight transition-all duration-200 [color-scheme:light] h-11"
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={handleFilter}
              className="flex items-center gap-2 p-2 px-4 bg-blue-600 hover:bg-blue-400 text-white rounded-lg transition-colors duration-200 transform h-11"
            >
              <Filter size={16} />
              <span>Filter</span>
            </button>
          </div>
          <div className="ml-auto">
                      {classFee && (
                        <div className="flex items-center gap-2 p-2 px-4 bg-primary-300 text-black-300 rounded-lg h-11">
                          <span className="font-medium">Tuition Fee:</span>
                          <span>₹{classFee}</span>
                        </div>
                      )}
                    </div>
          
        </div>

        {/* Table Component */} 
        <Table
          columns={columns}
          data={transactions?.students || []}
          checkboxSelection={false}
          extraClasses="m-4"
        />
          
        {error && (
          <div className="p-2 mb-4 text-black-200">
            {error}
          </div>
        )}

        {!selectedClass && (
          <div className="p-2 mb-4 text-black-200">
            Please select a class to filter transactions.
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

      {transactions?.summary && (
        <div className="mt-12">
          <StudentFeePieChart Summary={transactions?.summary || []} />
        </div>
      )}
    </div>
  );
};

export default ClassStudentFees;