
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
import Cookies from 'js-cookie'
import { useSelector, useDispatch } from "react-redux";
import { setTransactionData, setCurrentPage, setTransactionUpdate } from "../../../Store/slice";
import { GetTransactionsByTeacherAPI, GetAllTeachersAPI, FilterTransactionAPI, 
  DeleteTransactionAPI, GetTeacherExpenseApi } from '../../../service/api';
import Table from "../../Components/Elements/Table";
import Pagination from "../../Components/Elements/Pagination";

const AllTransaction = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  // Add filteredMonth state to track the month actually used for filtering
  const [filteredMonth, setFilteredMonth] = useState(new Date());
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
  const transactionUpdate = useSelector((state) => state.userData.transactionUpdate);
  const url = import.meta.env.VITE_API_BASE_URL;
  const token = Cookies.get("token")

  useEffect(() => {
    document.title = "All Transactions";
    dispatch(setCurrentPage(1));
    fetchTeachers();
    
    // Initialize both selectedMonth and filteredMonth
    const currentDate = new Date();
    setSelectedMonth(currentDate);
    setFilteredMonth(currentDate);
    
    // Set initial display month
    const monthNames = ["January", "February", "March", "April", "May", "June", 
                        "July", "August", "September", "October", "November", "December"];
    setDisplayMonth(monthNames[currentDate.getMonth()]);
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
      setError("Failed to fetch teachers list");
    }
  };

  const fetchTransactionsByTeacher = async () => {
    if (!selectedTeacher) {
      setError("Please select a teacher first");
      return;
    }
    
    try {
      setLoading(true);
      const month = `${selectedMonth.getFullYear()}-${String(selectedMonth.getMonth() + 1).padStart(2, '0')}`;
      const response = await GetTeacherExpenseApi(url, selectedTeacher, month);
      if (response.status === 200 || response.status === 204 || response.status === 201) {
        dispatch(setTransactionData(response.data));
        setPaginationData({
          currentPage: response.data.currentPage || 1,
          totalItems: response.data.totalItems || 0,
          totalPages: response.data.totalPages || 0
        });
      } else {
        if (response.status === 401) {  
          Cookies.remove('user');
          Cookies.remove('token');
          window.location.href = '/user-options';                      
        }
        setError(response.message);
      }
    } catch (err) {
      setError("Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredTransactions = async () => {
    try {
      setLoading(true);
      const response = await FilterTransactionAPI(url, token, displayMonth, status);
  
      if (response.status === 200 || response.status === 204 || response.status === 201) {
        dispatch(setTransactionData(response.data));
        setPaginationData({
          currentPage: response.data.currentPage || 1,
          totalItems: response.data.totalItems || 0,
          totalPages: response.data.totalPages || 0
        });
      } else {
        if (response.status === 401) {  
          Cookies.remove('user');
          Cookies.remove('token');
          window.location.href = '/user-options';                      
        }
        setError(response.message);
      }
    } catch (err) {
      setError("Failed to fetch filtered transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(transactionUpdate) {
      fetchTransactionsByTeacher();
      dispatch(setTransactionUpdate(false));
    }
  }, [transactionUpdate]);

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
    
    // Note: We DON'T update filteredMonth here - only when filter button is clicked
  };

  const handleTeacherChange = (e) => {
    setSelectedTeacher(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleFilter = () => {
    // Update the filteredMonth to match the selected month when filter is clicked
    setFilteredMonth(selectedMonth);
    
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
    if (window.confirm(`Are you sure you want to delete transaction ${transaction._id}?`)) {
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

  // Function to prepare a flattened version of the expense data for the table
  const prepareTableData = () => {
    if (!transactions || !transactions.expenses) {
      return [];
    }
    
    // Use filteredMonth instead of selectedMonth for filtering the display
    const filteredMonthStr = `${filteredMonth.getFullYear()}-${String(filteredMonth.getMonth() + 1).padStart(2, '0')}`;
    
    // Filter expenses to only show the filtered month (not the selected month)
    const filteredExpenses = transactions.expenses.filter(expense => {
      // Extract YYYY-MM from the expense month string for comparison
      const expenseMonth = expense.month.substring(0, 7);
      return expenseMonth === filteredMonthStr;
    });
    
    // Find the previous month's advance amount (if any)
    const getPreviousMonthAdvance = (expenses, currentMonthExpense) => {
      if (!expenses || expenses.length <= 1) return 0;
      
      const currentMonthDate = new Date(currentMonthExpense.month);
      
      // Find the previous month expense
      const previousMonth = expenses.find(exp => {
        const expDate = new Date(exp.month);
        // Check if it's exactly one month before
        return expDate.getMonth() === ((currentMonthDate.getMonth() - 1 + 12) % 12) && 
              (expDate.getMonth() === 11 ? expDate.getFullYear() === currentMonthDate.getFullYear() - 1 
                                        : expDate.getFullYear() === currentMonthDate.getFullYear());
      });
      
      return (previousMonth && previousMonth.advanceAmount && previousMonth.advanceStatus === 'approved') 
        ? previousMonth.advanceAmount 
        : 0;
    };
    
    // Transform only the filtered expense data
    return filteredExpenses.map(expense => {
      const salaryAmount = transactions.salaryAmount || 0;
      const advanceAmount = expense.advanceAmount || 0;
      const numberOfAbsent = transactions.numberOfAbsent || 0;
      const previousMonthAdvance = getPreviousMonthAdvance(transactions.expenses, expense);
      
      // Calculate total salary
      const totalSalary = Number(salaryAmount) + Number(advanceAmount);
      
      // Calculate salary deduction
      const absenceDeduction = (Number(numberOfAbsent) * Number(salaryAmount) / 30);
      const salaryDeduction = Number(absenceDeduction) + Number(previousMonthAdvance);
      
      // Calculate payable salary
      const payableSalary = Number(totalSalary) - Number(salaryDeduction);
      
      // Create a date object for display
      const expenseDate = new Date(expense.month + '-01');
      
      return {
        _id: expense._id,
        monthRaw: expenseDate,
        month: expenseDate.toLocaleString('default', { month: 'long', year: 'numeric' }),
        advanceAmount: advanceAmount,
        advanceStatus: expense.advanceStatus || 'N/A',
        advancePayRequest: expense.advancePayRequest || false,
        advanceRequestDate: expense.advanceRequestDate || null,
        status: expense.status || 'unpaid',
        numberOfLeaves: transactions.numberOfLeaves || 0,
        numberOfAbsent: numberOfAbsent,
        salaryAmount: salaryAmount,
        totalSalary: totalSalary,
        previousMonthAdvance: previousMonthAdvance,
        salaryDeduction: salaryDeduction,
        payableSalary: payableSalary
      };
    });
  };

  const columns = [
    {
      field: 'month',
      headerName: 'Month',
      renderCell: (row) => (
        <div className="flex items-center gap-2">
          <span>{row.month || '-'}</span>
        </div>
      ),
    },
    {
      field: 'numberOfLeaves',
      headerName: 'Casual Leave',
      renderCell: (row) => (
        <div className="flex items-center gap-2">
          <span>{row.numberOfLeaves || '0'}</span>
        </div>
      ),
    },
    {
      field: 'numberOfAbsent',
      headerName: 'Days Absent',
      renderCell: (row) => (
        <div className="flex items-center gap-2">
          <span>{row.numberOfAbsent || '0'}</span>
        </div>
      ),
    },
    {
      field: 'advancePayRequest',
      headerName: 'Advance Request',
      renderCell: (row) => (
        <div className="flex items-center gap-2">
          <span>{row.advancePayRequest ? 'Yes' : 'No'}</span>
        </div>
      ),
    },
    {
      field: 'advanceAmount',
      headerName: 'Advance Amount',
      renderCell: (row) => (
        <div className="flex items-center gap-2">
          <IndianRupee size={16} />
          <span>{row.advanceAmount || '0'}</span>
        </div>
      ),
    },
    {
      field: 'advanceRequestDate',
      headerName: 'Advance Request Month',
      renderCell: (row) => (
        <div className="flex items-center gap-2">
          {row.advanceRequestDate ? new Date(row.advanceRequestDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '-'}
        </div>
      ),
    },
    {
      field: 'advanceStatus',
      headerName: 'Advance Status',
      renderCell: (row) => (
        <div className="flex items-center gap-2">
          <span className={`${
            row.advanceStatus === 'pending' ? 'text-yellow-500' :
            row.advanceStatus === 'approved' ? 'text-success-500' :
            row.advanceStatus === 'rejected' ? 'text-danger' : ''
          }`}>
            {row.advanceStatus || '-'}
          </span>
        </div>
      ),
    },
    {
      field: 'status',
      headerName: 'Salary Status',
      renderCell: (row) => (
        <div className="flex items-center gap-2">
          <span className={`${
            row.status === 'unpaid' ? 'text-yellow-500' : 'text-success-500'
          }`}>
            {row.status || '-'}
          </span>
        </div>
      ),
    },
    {
      field: 'salaryAmount',
      headerName: 'Base Salary',
      renderCell: (row) => (
        <div className="flex items-center gap-2">
          <IndianRupee size={16} />
          <span>{row.salaryAmount || '0'}</span>
        </div>
      ),
    },
    {
      field: 'totalSalary',
      headerName: 'Total Salary',
      note:'Total Salary = Base Salary + Advance Amount',
      renderCell: (row) => (
        <div className="flex items-center gap-2">
          <IndianRupee size={16} />
          <span>{Number(row.salaryAmount) + Number(row.advanceAmount) || '0'}</span>
        </div>
      ),
    },
    {
      field: 'salaryDeduction',
      headerName: 'Salary Deduction',
      note: 'Deduction calculated based on number of days absent',     
       renderCell: (row) => (
        <div className="flex items-center gap-2">
          <IndianRupee size={16} />
          <span>{row.salaryDeduction.toFixed(2) || '0'}</span>
        </div>
      ),
    },
    {
      field: 'payableSalary',
      headerName: 'Payable Salary',
      note:'Total Salary - Salary Deduction',
      renderCell: (row) => (
        <div className="flex items-center gap-2">
          <IndianRupee size={16} />
          <span className="font-medium text-success-500">{row.payableSalary.toFixed(2) || '0'}</span>
        </div>
      ),
    },
    {
      field: 'updateAt',
      headerName: 'Last Updated Date',
      renderCell: (row) => (
        <div className="flex items-center gap-2">
          {(row.status === 'paid' || row.advanceStatus === 'approved') ? (
            <>
              <IndianRupee size={16} />
              <span className="font-medium text-success-500">{new Date(row.updateAt).toLocaleDateString('en-GB')}</span>
            </>
          ) : (
            <span>No action taken</span>
          )}
        </div>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      renderCell: (row) => (
        <div className="flex items-center">
          <button 
            onClick={() => handleDeleteTransaction(row)}
            className="p-1 text-danger hover:   rounded-full transition-colors"
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

  // Prepare the data for the table
  const tableData = prepareTableData();

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
        <div className="mb-4 md:mb-0 text-left">
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
          data={tableData}
          checkboxSelection={false}
          extraClasses="m-4"
          onDelete={handleDeleteTransaction}
          />
          {error && (
            <div className="p-2 mb-4 text-black-200 ">
              {error}
            </div>
          )}
          {!selectedTeacher && (
            <div className="p-2 mb-4 text-black-200 ">
              Please select a teacher
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

export default AllTransaction;








// Function to prepare a flattened version of the expense data for the table
// const prepareTableData = () => {
//   if (!transactions || !transactions.expenses) {
//     return [];
//   }
  
//   // Find the previous month's advance amount (if any)
//   const getPreviousMonthAdvance = (expenses, currentMonthExpense) => {
//     if (!expenses || expenses.length <= 1) return 0;
    
//     const currentMonthDate = new Date(currentMonthExpense.month);
    
//     // Find the previous month expense
//     const previousMonth = expenses.find(exp => {
//       const expDate = new Date(exp.month);
//       // Check if it's exactly one month before
//       return expDate.getMonth() === ((currentMonthDate.getMonth() - 1 + 12) % 12) && 
//             (expDate.getMonth() === 11 ? expDate.getFullYear() === currentMonthDate.getFullYear() - 1 
//                                       : expDate.getFullYear() === currentMonthDate.getFullYear());
//     });
    
//     return (previousMonth && previousMonth.advanceAmount && previousMonth.advanceStatus === 'approved') 
//       ? previousMonth.advanceAmount 
//       : 0;
//   };
  
//   // Transform the data
//   const tableRows = transactions.expenses.map(expense => {
//     const salaryAmount = transactions.salaryAmount || 0;
//     const advanceAmount = expense.advanceAmount || 0;
//     const numberOfAbsent = transactions.numberOfAbsent || 0;
//     const previousMonthAdvance = getPreviousMonthAdvance(transactions.expenses, expense);
    
//     // Calculate total salary
//     const totalSalary = Number(salaryAmount) + Number(advanceAmount);
    
//     // Calculate salary deduction
//     // Formula: (numberOfAbsent * totalSalary/30) + previousMonthAdvance
//     const absenceDeduction = (Number(numberOfAbsent) * Number(salaryAmount) / 30);
//     const salaryDeduction = Number(absenceDeduction) + Number(previousMonthAdvance);
    
//     // Calculate payable salary
//     const payableSalary = Number(totalSalary) - Number(salaryDeduction);
    
//     // Create a date object for sorting
//     const expenseDate = new Date(expense.month + '-01');
    
//     return {
//       _id: expense._id,
//       monthRaw: expenseDate, // Raw date for sorting
//       month: expenseDate.toLocaleString('default', { month: 'long', year: 'numeric' }),
//       advanceAmount: advanceAmount,
//       advanceStatus: expense.advanceStatus || 'N/A',
//       advancePayRequest: expense.advancePayRequest || false,
//       advanceRequestDate: expense.advanceRequestDate || null,
//       status: expense.status || 'unpaid',
//       numberOfLeaves: transactions.numberOfLeaves || 0,
//       numberOfAbsent: numberOfAbsent,
//       salaryAmount: salaryAmount,
//       totalSalary: totalSalary,
//       previousMonthAdvance: previousMonthAdvance,
//       salaryDeduction: salaryDeduction,
//       payableSalary: payableSalary
//     };
//   });
  
//   // Sort the transactions by month (January to December)
//   return tableRows.sort((a, b) => {
//     // First compare by year
//     const yearDiff = a.monthRaw.getFullYear() - b.monthRaw.getFullYear();
//     if (yearDiff !== 0) return yearDiff;
    
//     // Then compare by month if in same year
//     return a.monthRaw.getMonth() - b.monthRaw.getMonth();
//   });
// };

// Function to prepare a flattened version of the expense data for the table


// const prepareTableData = () => {
//   if (!transactions || !transactions.expenses) {
//     return [];
//   }
  
//   // Get the currently selected month/year for filtering
//   const selectedMonthStr = `${selectedMonth.getFullYear()}-${String(selectedMonth.getMonth() + 1).padStart(2, '0')}`;
  
//   // Filter expenses to only show the selected month
//   const filteredExpenses = transactions.expenses.filter(expense => {
//     // Extract YYYY-MM from the expense month string for comparison
//     const expenseMonth = expense.month.substring(0, 7);
//     return expenseMonth === selectedMonthStr;
//   });
  
//   // Find the previous month's advance amount (if any)
//   const getPreviousMonthAdvance = (expenses, currentMonthExpense) => {
//     if (!expenses || expenses.length <= 1) return 0;
    
//     const currentMonthDate = new Date(currentMonthExpense.month);
    
//     // Find the previous month expense
//     const previousMonth = expenses.find(exp => {
//       const expDate = new Date(exp.month);
//       // Check if it's exactly one month before
//       return expDate.getMonth() === ((currentMonthDate.getMonth() - 1 + 12) % 12) && 
//             (expDate.getMonth() === 11 ? expDate.getFullYear() === currentMonthDate.getFullYear() - 1 
//                                       : expDate.getFullYear() === currentMonthDate.getFullYear());
//     });
    
//     return (previousMonth && previousMonth.advanceAmount && previousMonth.advanceStatus === 'approved') 
//       ? previousMonth.advanceAmount 
//       : 0;
//   };
  
//   // Transform the data - use filteredExpenses instead of all expenses
//   const tableRows = filteredExpenses.map(expense => {
//     const salaryAmount = transactions.salaryAmount || 0;
//     const advanceAmount = expense.advanceAmount || 0;
//     const numberOfAbsent = transactions.numberOfAbsent || 0;
//     const previousMonthAdvance = getPreviousMonthAdvance(transactions.expenses, expense);
    
//     // Calculate total salary
//     const totalSalary = Number(salaryAmount) + Number(advanceAmount);
    
//     // Calculate salary deduction
//     // Formula: (numberOfAbsent * totalSalary/30) + previousMonthAdvance
//     const absenceDeduction = (Number(numberOfAbsent) * Number(salaryAmount) / 30);
//     const salaryDeduction = Number(absenceDeduction) + Number(previousMonthAdvance);
    
//     // Calculate payable salary
//     const payableSalary = Number(totalSalary) - Number(salaryDeduction);
    
//     // Create a date object for sorting
//     const expenseDate = new Date(expense.month + '-01');
    
//     return {
//       _id: expense._id,
//       monthRaw: expenseDate, // Raw date for sorting
//       month: expenseDate.toLocaleString('default', { month: 'long', year: 'numeric' }),
//       advanceAmount: advanceAmount,
//       advanceStatus: expense.advanceStatus || 'N/A',
//       advancePayRequest: expense.advancePayRequest || false,
//       advanceRequestDate: expense.advanceRequestDate || null,
//       status: expense.status || 'unpaid',
//       numberOfLeaves: transactions.numberOfLeaves || 0,
//       numberOfAbsent: numberOfAbsent,
//       salaryAmount: salaryAmount,
//       totalSalary: totalSalary,
//       previousMonthAdvance: previousMonthAdvance,
//       salaryDeduction: salaryDeduction,
//       payableSalary: payableSalary
//     };
//   });
  
//   // Since we're only showing one month, we can return directly without sorting
//   return tableRows;
// };