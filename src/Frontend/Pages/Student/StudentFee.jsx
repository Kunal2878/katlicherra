
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
import Cookies from 'js-cookie'
import { useSelector, useDispatch } from "react-redux";
import { setStudentFinanceData, setCurrentPage } from "../../../Store/slice";
import { GetStudentFeeTransactionAPI, DeleteTransactionAPI } from '../../../service/api';
import Table from "../../Components/Elements/Table";
import Pagination from "../../Components/Elements/Pagination";

const MyDues = (studentData) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [displayMonth, setDisplayMonth] = useState("");
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedClassName, setSelectedClassName] = useState("");
  const [status, setStatus] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [paginationData, setPaginationData] = useState({
    currentPage: 1,
    totalItems: 0,
    totalPages: 0
  });
  const user = useSelector((state) => state.userData.user);
  const studentName = user?.name
  const studentClass = user?.className
  const dispatch = useDispatch();
  const currentPage = useSelector((state) => state.userData.CurrentPage);
  const url = import.meta.env.VITE_API_BASE_URL;
  const token = Cookies.get("token");

  // Calculate summary amounts
  const totalPaidAmount = transactions.filter(t => t.status === "paid").reduce((sum, t) => sum + (t.totalAmount || 0), 0);
  const totalPendingAmount = transactions.filter(t => t.status !== "paid").reduce((sum, t) => sum + (t.baseAmount || 0), 0);
  const pendingFine = transactions.filter(t => t.paidFine !== "paid").reduce((sum, t) => sum + (t.lateFineAmount || 0), 0);
  const totalLateFineAmount = transactions.reduce((sum, t) => sum + (t.lateFineAmount || 0), 0);
  const totalAmount = transactions.reduce((sum, t) => sum + (t.baseAmount || 0), 0);

  useEffect(() => {
    document.title = "Student Finance";
    dispatch(setCurrentPage(1));
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await GetStudentFeeTransactionAPI(url, token, user?._id);
      if (response.status === 200 || response.status === 204 || response.status === 201) {
        const monthOrder = {
          'January': 1,
          'February': 2,
          'March': 3,
          'April': 4,
          'May': 5,
          'June': 6,
          'July': 7,
          'August': 8,
          'September': 9,
          'October': 10,
          'November': 11,
          'December': 12
        };
        
        // Sort the transactions by month
        const sortedTransactions = [...response.data].sort((a, b) => {
          return monthOrder[a.month] - monthOrder[b.month];
        });
        setTransactions(sortedTransactions)
        setPaginationData({
          currentPage: response.data.currentPage || 1,
          totalItems: response.data.totalItems || 0,
          totalPages: response.data.totalPages || 0
        });
      } else {
        setTransactions([])
        setError(response.message);
      }
    } catch (err) {
      setTransactions([])
      setError(err.message || "Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchTransactions()
  }, [])

  const handlePageChange = (newPage) => {
    dispatch(setCurrentPage(newPage));
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
      field: 'baseAmount',
      headerName: 'Base Amount',
      renderCell: (row) => (
        <div className="flex items-center gap-2">
          <span>₹{row.baseAmount || '-'}</span>
        </div>
      ),
    },
    {
      field: 'lateFineAmount',
      headerName: 'Late Fine Amount',
      renderCell: (row) => (
        <div className="flex items-center gap-2">
          <span>₹{row.lateFineAmount || '0'}</span>
        </div>
      ),
    },
    {
      field: 'totalAmount',
      headerName: 'Total Amount',
      renderCell: (row) => (
        <div className="flex items-center gap-2">
          <span>₹{row.totalAmount || '-'}</span>
        </div>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      renderCell: (row) => (
        <div className={`px-2 py-1 rounded-full text-sm ${
          row.status === 'paid' ? 'text-success-500' : 'text-danger'
        }`}>
          {row.status || '-'}
        </div>
      ),
    },
    {
      field: 'paidFine',
      headerName: 'Pay Fine',
      renderCell: (row) => (
        <div className={`px-2 py-1 rounded-full text-sm ${
          row.lateFine ? (row.finePaid ? ' text-success-500' : ' text-danger') : 'text-gray-800'
        }`}>
          {row.lateFine ? (row.finePaid ? 'paid' : 'not paid') : 'No due fine'}
        </div>
      ),
    },
    {
      field: 'paymentDate',
      headerName: 'Date of Payment',
      renderCell: (row) => (
        <div className="flex items-center gap-2">
          <span>{row.paymentDate ? new Date(row.paymentDate).toLocaleDateString('en-GB') : 'Pending'}</span>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="sm:px-16 px-6 sm:py-8 py-6">
        <div className="bg-white p-2 rounded-md flex items-center justify-center h-40">
          <Loader className="h-12 w-12 animate-spin text-purpleColor" />
        </div>
      </div>
    );
  }

  return (
    <div className="sm:px-16 px-6 sm:py-8 py-6">
      {/* Student Info and Summary Section */}
      <div className="bg-white p-4 rounded-md mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-3 border rounded-md">
            <p className="text-gray-500 text-sm">Student Name</p>
            <p className="font-semibold text-black-300">{studentName}</p>
          </div>
          {/* <div className="p-3 border rounded-md">
            <p className="text-gray-500 text-sm">Class</p>
            <p className="font-semibold text-black-300">{studentClass}</p>
          </div> */}
          <div className="p-3 border rounded-md">
            <p className="text-gray-500 text-sm">Total Base Amount</p>
            <p className="font-semibold text-black-300">₹{totalAmount}</p>
          </div>
          <div className="p-3 border rounded-md md:col-span-1">
            <p className="text-gray-500 text-sm">Total Late Fine</p>
            <p className="font-semibold text-amber-600">₹{totalLateFineAmount}</p>
          </div>
          <div className="p-3 border rounded-md md:col-span-1">
            <p className="text-gray-500 text-sm">Total Payable Amount</p>
            <p className="font-semibold text-blue-600">₹{totalAmount+totalLateFineAmount}</p>
          </div>

          <div className="p-3 border rounded-md">
            <p className="text-gray-500 text-sm">Total Paid</p>
            <p className="font-semibold text-green-600">₹{totalPaidAmount+pendingFine}</p>
          </div>
          <div className="p-3 border rounded-md">
            <p className="text-gray-500 text-sm">Total Pending</p>
            <p className="font-semibold text-red-600">₹{totalPendingAmount}</p>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row text-black justify-between items-start md:items-center mb-4 p-2">
        <div>
          <h2 className="text-xl font-bold mb-2">Fee History</h2>
        </div>
      </div>

      {/* Fee Table */}
      <div className="bg-white p-2 rounded-md">
        {/* Error display */}

        {/* Table Component */}
        <Table
          columns={columns}
          data={transactions || []}
          checkboxSelection={false}
          extraClasses="m-4 shadow-none "
          />
          {error && (
            <div className="p-2 mb-4 text-danger    rounded">
              {error}
            </div>
          )}

        {transactions.length === 0 && (
          <div className="flex justify-center items-center p-4 text-gray-500">
            No transactions available for the student
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

export default MyDues;