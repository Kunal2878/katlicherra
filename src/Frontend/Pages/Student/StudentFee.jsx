
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
import Cokkies from 'js-cookie'
import { useSelector, useDispatch } from "react-redux";
import { setStudentFinanceData, setCurrentPage } from "../../../Store/slice";
import {  GetStudentFeeTransactionAPI, FilterTransactionAPI, DeleteTransactionAPI } from '../../../service/api';
import Table from "../../Components/Elements/Table";
import Pagination from "../../Components/Elements/Pagination";

const MyDues = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [displayMonth, setDisplayMonth] = useState("");
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedClassName, setSelectedClassName] = useState("");
  const [status, setStatus] = useState("");
  const [paginationData, setPaginationData] = useState({
    currentPage: 1,
    totalItems: 0,
    totalPages: 0
  });
  
  const dispatch = useDispatch();
  const transactions = useSelector((state) => state.userData.StudentFinanceData);
  const user = useSelector((state) => state.userData.user);
  const currentPage = useSelector((state) => state.userData.CurrentPage);
  const url = import.meta.env.VITE_API_BASE_URL;
  const token = Cokkies.get("token");

  useEffect(() => {
    document.title = "My Dues";
    dispatch(setCurrentPage(1));

  }, []);

 

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await GetStudentFeeTransactionAPI(url, token,user._id);
      if (response.status === 200 || response.status === 204 || response.status === 201) {
        dispatch(setStudentFinanceData(response.data));
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
useEffect(()=>{
    fetchTransactions()
},[])

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
   
      

      {/* Header */}
      <div className="flex flex-col md:flex-row text-black justify-between items-start md:items-center mb-[32px] p-2">
        <div className="mb-4 md:mb-0">
          <h2 className="h2 mb-2">My Dues</h2>
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

export default MyDues;