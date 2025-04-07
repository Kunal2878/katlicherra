import React, { useState, useEffect } from "react";
import {
  Search,
  GraduationCap,
  Plus,
  Loader,
  X,
} from "lucide-react";
import AddTeachers from "../../Pages/Teacher/AddTeacher";
import { useSelector, useDispatch } from "react-redux";
import { setTeacherData,setCurrentPage,setTransactionData } from "../../../Store/slice";
import { GetTeachers,GetTeachersPages, GetTransactionsByTeacherAPI } from '../../../service/api';
import Table from "../../Components/Elements/Table";
import Pagination from "../../Components/Elements/Pagination";
import SelectDropdown from "../../Components/Elements/SelectDropDownList"; 
const AllTransactions = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddTeacher, setShowAddTeacher] = useState(false);

  const [paginationData, setPaginationData] = useState({
    currentPage: 1,
    totalItems: 0,
    totalPages: 0
  });
  const url = import.meta.env.VITE_API_BASE_URL;
  const token = Cookies.get("token");
  const currentpage = useSelector((state) => state.userData.CurrentPage);
  const teachers = useSelector((state) => state.userData.TeacherData);
  const transactionData = useSelector((state) => state.userData.TransactionData);
  const dispatch = useDispatch();


  useEffect(() => {
    document.title = "Transactions";
dispatch(setCurrentPage(1));
  }, []);

 useEffect(() => {
    const fetchTeachers = async () => {
      const response = await GetTeachers(url);
      if (response.status === 200 || response.status === 204 || response.status === 201) {
        dispatch(setTeacherData(response.data.teachers));
      } else {
        setError(response.message);
      }
    };
    if (teachers?.length === 0) {
      fetchTeachers();
    }
  }, []);

const fetchTransactions = async ()=>{
  const response = await GetTransactionsByTeacherAPI(url);
  if (response.status === 200 || response.status === 204 || response.status === 201) {
    dispatch(setTeacherData(response.data.teachers));
  } else {
    setError(response.message);
  }
}

useEffect(()=>{

  fetchTransactions()

},[])


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
  ];

  const handleEditTeacher = (teacher) => {
    console.log("Edit teacher:", teacher);
  };

  const handleDeleteTeacher = (teacher) => {
    console.log("Delete teacher:", teacher);
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
        <div className="mb-4 md:mb-0">
          <h2 className="h2 text-2xl font-medium mb-2">All Teachers </h2>
          <div className="flex items-center text-sm subtitle-2">
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

      <div className="bg-white rounded-lg shadow-lg p-4">
        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md bg-slate-100 text-gray-600">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by name"
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border rounded-lg outline-none bg-primary-300 text-black-300 border-lamaSkyLight transition-all duration-200"
            />
          </div>
        </div>

        {/* Table Component */}
        <Table
          columns={columns}
          data={teachers || []}
          checkboxSelection={false}
          actions={true}
          onEdit={handleEditTeacher}
          onDelete={handleDeleteTeacher}
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

export default AllTransactions;