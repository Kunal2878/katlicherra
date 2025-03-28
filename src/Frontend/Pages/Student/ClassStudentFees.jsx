  import React, { useState, useEffect } from "react";
  import {
    Search,
    Loader,
    IndianRupee,
    Plus,
    X,
    Calendar,
    Filter,
    Trash2
  } from "lucide-react";
  import AddStudentFees from "./AddStudentFee";
  import Cokkies from 'js-cookie'
  import { useSelector, useDispatch } from "react-redux";
  import { setStudentFinanceData, setCurrentPage } from "../../../Store/slice";
  import { GetTransactionsByTeacherAPI, GetClasses,GetAllClassesAPI, GetClassFeeTransactionAPI, FilterTransactionAPI, DeleteTransactionAPI } from '../../../service/api';
  import Table from "../../Components/Elements/Table";
  import Pagination from "../../Components/Elements/Pagination";
  import {  oops } from "../../../assets/index";
  import { toast } from 'react-toastify';
  const ClassStudentFees = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(new Date());
    const [displayMonth, setDisplayMonth] = useState("");
    const [showAddTransaction, setShowAddTransaction] = useState(false);
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState("");
    const [selectedClassName, setSelectedClassName] = useState("");
    const [status, setStatus] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('');
    const [paginationData, setPaginationData] = useState({
      currentPage: 1,
      totalItems: 0,
      totalPages: 0
    });
  
    const transactions = useSelector((state) => state.userData.StudentFinanceData);
    const dispatch = useDispatch();
    const currentPage = useSelector((state) => state.userData.CurrentPage);
    const url = import.meta.env.VITE_API_BASE_URL;
    const token = Cokkies.get("token");

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

    const fetchClasses = async () => {

        const response = await GetAllClassesAPI(url);
        if (response.status === 200 || response.status === 201) {
          setClasses(response.data.classes);
        } 
        
        else {
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
          setShowToast(true);
          setToastMessage("Transactions fetched successfully");
          setToastType("success");
        } else {
          dispatch(setStudentFinanceData([]));
          setError(response.message);
          setShowToast(true);
          setToastMessage(response.message);
          setToastType("error");
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
          fetchTransactions()
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
    setStatus(e.target.value);
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
      field: 'name',
      headerName: 'Student Name',
      renderCell: (row) => (
        <div className="flex items-center gap-2">
          <span>{row.student?.name || '-'}</span>
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
        <div className={`px-2 py-1 rounded-full text-sm ${
          row.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {row.status || '-'}
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
            <AddStudentFees onClose={() => {
              setShowAddTransaction(false);
              fetchTransactions(); // Refresh data after adding
            }} />
          </div>
        )}
      </div>

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
                onChange={handleClassChange}
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
        </div>

        {/* Error display */}

        {/* Table Component */}
        <Table
          columns={columns}
          data={transactions || []}
          checkboxSelection={false}
          extraClasses="m-4"
          />
          
          {error && (
            <div className="p-2 mb-4 text-red-500 bg-red-50 rounded">
              {error}
            </div>
          )}
          {(classes.length===0)&& (
                <div className="flex items-center justify-center mt-4">
                  <img
                    src={oops}
                    alt="Failure"
                    className="w-[300px] h-[200px] sm:w-[400px] sm:h-[250px] md:w-[500px] md:h-[300px] lg:w-[600px] lg:h-[350px] border-2 rounded-md"
                  />
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

export default ClassStudentFees;