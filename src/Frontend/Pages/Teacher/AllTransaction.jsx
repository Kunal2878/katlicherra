
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
import AddTransaction from "./AddTransaction";
import Cokkies from 'js-cookie'
import { useSelector, useDispatch } from "react-redux";
import { setTransactionData, setCurrentPage } from "../../../Store/slice";
import { GetTransactionsByTeacherAPI, GetTeachers,GetAllTeachersAPI, FilterTransactionAPI, DeleteTransactionAPI } from '../../../service/api';
import Table from "../../Components/Elements/Table";
import Pagination from "../../Components/Elements/Pagination";

const AllTransaction = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [displayMonth, setDisplayMonth] = useState("");
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [status, setStatus] = useState("");
  const [paginationData, setPaginationData] = useState({
    currentPage: 1,
    totalItems: 0,
    totalPages: 0
  });
  
  const transactions = useSelector((state) => state.userData.TransactionData);
  const dispatch = useDispatch();
  const currentPage = useSelector((state) => state.userData.CurrentPage);
  const url = import.meta.env.VITE_API_BASE_URL;
  const token = Cokkies.get("token")

  useEffect(() => {
    document.title = "All Transactions";
    dispatch(setCurrentPage(1));
    fetchTeachers();
    
    // Set initial display month
    const monthNames = ["January", "February", "March", "April", "May", "June", 
                        "July", "August", "September", "October", "November", "December"];
    setDisplayMonth(monthNames[selectedMonth.getMonth()]);
  }, []);


  const fetchTeachers = async () => {
    try {
      const response = await GetAllTeachersAPI(url, token);
      if (response.status === 200 || response.status === 201) {
        setTeachers(response.data.teachers);
      } else {
        setError("Failed to fetch teachers list");
      }
    } catch (err) {
      setError(err.message || "Failed to fetch teachers");
    }
  };

  const fetchTransactionsByTeacher = async () => {
    if (!selectedTeacher) {
      setError("Please select a teacher first");
      return;
    }
    
    try {
      setLoading(true);
      const month = selectedMonth.getMonth() + 1;
      
      const response = await GetTransactionsByTeacherAPI(url, token, selectedTeacher, displayMonth);
      if (response.status === 200 || response.status === 204 || response.status === 201) {
        dispatch(setTransactionData(response.data));
        setPaginationData({
          currentPage: response.data.currentPage || 1,
          totalItems: response.data.totalItems || 0,
          totalPages: response.data.totalPages || 0
        });
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  };
  const fetchFilteredTransactions = async () => {

      setLoading(true);
 
      const response = await FilterTransactionAPI(url, token, displayMonth, status);
  
      if (response.status === 200 || response.status === 204 || response.status === 201) {
        dispatch(setTransactionData(response.data));
        setPaginationData({
          currentPage: response.data.currentPage || 1,
          totalItems: response.data.totalItems || 0,
          totalPages: response.data.totalPages || 0
        });
          }   
          
          else {
        setError(response.message);
      }
    
      setLoading(false);
    
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

  const handleTeacherChange = (e) => {
    setSelectedTeacher(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleFilter = () => {
    if (selectedTeacher) {
      fetchTransactionsByTeacher();
    } else {
      fetchFilteredTransactions();
    }
  };

  const getFormattedMonth = () => {
    const year = selectedMonth.getFullYear();
    const month = (selectedMonth.getMonth() + 1).toString().padStart(2, '0');
    return `${year}-${month}`;
  };

  const handleDeleteTransaction = async (transaction) => {
    if (window.confirm(`Are you sure you want to delete transaction ${transaction.transactionId}?`)) {
      try {
        setLoading(true);
        const response = await DeleteTransactionAPI(url, token, transaction._id);
        if (response.status === 200) {
          // Refresh transactions after delete
          if (selectedTeacher) {
            fetchTransactionsByTeacher();
          } else {
            fetchFilteredTransactions();
          }
        } else {
          setError(response.message || "Failed to delete transaction");
        }
      } catch (err) {
        setError(err.message || "Failed to delete transaction");
      } finally {
        setLoading(false);
      }
    }
  };

  const columns = [
    {
      field: 'name',
      headerName: 'Name',
      renderCell: (row) => (
        <div className="flex items-center gap-2">
          <span>{row.teacher.name}</span>
        </div>
      ),
    },
    {
      field: 'month',
      headerName: 'Month',
      renderCell: (row) => (
        <div className="flex items-center gap-2">
          <span>{row.month||'-'}</span>
        </div>
      ),
    },
    {
      field: 'advanceAmount',
      headerName: 'Advance Paid',
      renderCell: (row) => (
        <div className="flex items-center gap-2">
          <IndianRupee size={16} />
          <span>{row.advanceAmount||'-'}</span>
        </div>
      ),
    },

    {
      field: 'status',
      headerName: 'Status',
    },
    {
      field: 'actions',
      headerName: 'Actions',
      renderCell: (row) => (
        <div className="flex items-center">
          <button 
            onClick={() => handleDeleteTransaction(row)}
            className="p-1 text-red-500 hover:bg-red-50 rounded-full transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    }
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
            <AddTransaction onClose={() => setShowAddTransaction(false)} />
          </div>
        )}
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row text-black justify-between items-start md:items-center mb-[32px] p-2">
        <div className="mb-4 md:mb-0">
          <h2 className="h2 mb-2">Teacher Finance</h2>
          <div className="flex items-center subtitle-2">
            <span className="">Accounting / </span>
            <span>Teacher Finance</span>
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
            {/* Teacher Selection Dropdown */}
            <div className="relative min-w-[200px]">
              <select
                value={selectedTeacher}
                onChange={handleTeacherChange}
                className="p-2 pl-3 border rounded-lg bg-primary-300 text-black-300 border-lamaSkyLight transition-all duration-200 h-11 w-full"
              >
                <option value="">Select Teacher</option>
                {teachers.map((teacher) => (
                  <option key={teacher._id} value={teacher._id}>
                    {teacher.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Selection Dropdown */}

            {
              !selectedTeacher &&(

            <div className="relative min-w-[150px]">
              <select
                value={status}
                onChange={handleStatusChange}
                className="p-2 pl-3 border rounded-lg bg-primary-300 text-black-300 border-lamaSkyLight transition-all duration-200 h-11 w-full"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
              </select>
            </div>
              )
            }

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
              className="flex items-center gap-2 p-2 px-4 bg-blue-600 hover:bg-blue-400 text-white rounded-lg transition-colors duration-200 transform  h-11"
            >
              <Filter size={16} />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Error display */}
        {error && (
          <div className="p-2 mb-4 text-red-500 bg-red-50 rounded">
            {error}
          </div>
        )}

        {/* Table Component */}
        <Table
          columns={columns}
          data={transactions || []}
          checkboxSelection={false}
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

export default AllTransaction;