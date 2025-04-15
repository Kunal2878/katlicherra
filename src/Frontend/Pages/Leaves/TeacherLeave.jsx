import React, { useState, useEffect } from "react";
import { Loader, X, Trash } from "lucide-react";
import AddLeaves from "./AddLeave";
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from "react-redux";
import { setLeaveData, setCurrentPage,setShowConfirmationModel,setConfirmRequest,setStatus, setAddText  } from "../../../Store/slice";
import { GetAllLeaveTeacherAPI,DeleteLeaveRequestAPI } from '../../../service/api';
import Pagination from "../../Components/Elements/Pagination";
import Confirmation from "../../Components/Elements/ConfirmationModel"
const TeacherLeaves = () => {
  const [loading, setLoading] = useState(true);
  const [showLeave, setShowLeave] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedLeaves, setSelectedLeaves] = useState([]);
  const [paginationData, setPaginationData] = useState({
    currentPage: 1,
    totalItems: 0,
    totalPages: 0
  });
  
  const user = useSelector((state) => state.userData.user);
  const leaves = useSelector((state) => state.userData.LeaveData);
  const currentPage = useSelector((state) => state.userData.CurrentPage);
  const url = import.meta.env.VITE_API_BASE_URL;
  const showConfirmation = useSelector((state) => state.userData.showConfirmationModel);
  const confirmRequest = useSelector((state) => state.userData.confirmRequest);
  const dispatch = useDispatch();

  useEffect(() => {
    document.title = "Leave Records";
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


  const fetchLeaves = async () => {
    setLoading(true);
    const response = await GetAllLeaveTeacherAPI(url, user?.id);
    
    if (response.status === 200 || response.status === 204 || response.status === 201) {
      dispatch(setLeaveData(response.data));
      
      // Update pagination data from API response
      setPaginationData({
        currentPage: response.data?.pagination?.currentPage || 1,
        totalItems: response.data?.pagination?.totalItems,
        totalPages: response.data?.pagination?.totalPages,
        totalItemsPerPage: response.data?.pagination?.studentsPerPage || 10
      });
    } else {
      dispatch(setLeaveData([]))
      setToastMessage(response.message);
      setToastType("error");
      setShowToast(true);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  // Handle page change
  const handlePageChange = (newPage) => {
    dispatch(setCurrentPage(newPage));
  };

  // Filter leaves based on status
  const filteredLeaves = leaves?.filter(leave => 
    statusFilter === "all" ? true : leave.status === statusFilter
  );

  // Handle checkbox selection
  const handleCheckboxChange = (leaveId) => {
    setSelectedLeaves(prev => {
      if (prev.includes(leaveId)) {
        return prev.filter(id => id !== leaveId);
      } else {
        return [...prev, leaveId];
      }
    });
  };

  // Handle delete selected leaves
  const handleDeleteSelected = async () => {
    if (selectedLeaves.length === 0) {
      toast.info("No leaves selected for deletion");
      return;
    }
    dispatch(setShowConfirmationModel(true));

    
  };

const DeleteLeaves = async ()=>{
  if (selectedLeaves.length === 0) return;


       // Process one by one since API requires individual expense ID
       for (const leaveId of selectedLeaves) {
        var response = await DeleteLeaveRequestAPI(url, leaveId);
       }
       if(response.status===200|| response.status===201||response.status===204)
       {
           await fetchLeaves();
           dispatch(setStatus("success"))
           dispatch(setAddText(response.message))

       }
       
     else  {
      
       dispatch(setStatus("error"))
       dispatch(setAddText(response.message))
     } 
       setLoading(false);
       setTimeout(() => {
         dispatch(setStatus(''));
         dispatch(setAddText(''));
         dispatch(setShowConfirmationModel(false));
         dispatch(setConfirmRequest(false));

       }, 3000);
   setSelectedLeaves(null)

}

useEffect( ()=>{
    if(confirmRequest)
      {
      DeleteLeaves()
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

  return (
    <div className="sm:px-16 px-6 sm:py-16 py-10 min-h-screen">
      {/* Add Leave Modal */}
      <div
        className={`
          fixed inset-0 flex items-center justify-center 
          bg-black bg-opacity-50 z-50 
          ${
            showLeave
              ? "opacity-100 visible"
              : "opacity-0 invisible pointer-events-none"
          }
          transition-all duration-300 ease-in-out
        `}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowLeave(false);
          }
        }}
      >
        {showLeave && (
          <div
            className={`
              relative rounded-xl w-auto max-h-[90vh] overflow-y-auto 
              bg-white
              custom-scrollbar
              ${
                showLeave
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-95 -translate-y-4 pointer-events-none"
              }
              transition-all duration-300 ease-in-out
              transform origin-center
            `}
          >
            <button
              onClick={() => {
                setShowLeave(false);
              }}
              className="absolute top-6 right-4 p-2 bg-white rounded-full text-black-300 transition-colors duration-200 transform hover:scale-110"
            >
              <X size={24} />
            </button>
            <AddLeaves 
              onClose={() => {
                setShowLeave(false);
              }} 
            />
          </div>
        )}
      </div>
      

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
          
            }
          }}
        >
          <Confirmation 
            message={`Are you sure you want to delete the selected leaves? This action cannot be undone.`}
            note=""/>
        </div>
      )}



      {/* Header */}
      <div className="flex flex-col md:flex-row text-black justify-between items-start md:items-center mb-[32px] p-2">
        <div className="mb-4 md:mb-0 text-left">
          <h2 className="h2 mb-2 text-left">Leave Records</h2>
          <div className="flex items-center subtitle-2 text-left">
            <span className="">Attendance / </span>
            <span>Leave Records</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowLeave(true)}
            className="px-4 py-2 bg-purpleColor text-white rounded-md hover:bg-opacity-90 transition-all"
          >
            Add Leave
          </button>
          {selectedLeaves.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-opacity-90 transition-all flex items-center"
            >
              <Trash size={16} className="mr-2" />
              Delete Selected ({selectedLeaves.length})
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-md shadow-lg mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <div className="text-gray-700 mb-2 sm:mb-0">
            Filter by Status:
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purpleColor"
          >
            <option value="all">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Leaves List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {filteredLeaves?.length > 0 ? (
          <div className="space-y-4 p-4">
            {filteredLeaves.map((leave, index) => (
              <div 
                key={leave._id || index} 
                className={`p-4 rounded-lg text-left flex items-center ${
                  index % 3 === 0
                    ? "bg-lamaPurpleLight"
                    : index % 3 === 1
                    ? "bg-lamaYellowLight"
                    : "bg-lamaSkyLight"
                }`}
              >
                <input
  type="checkbox"
  checked={selectedLeaves.includes(leave._id)}
  onChange={() => handleCheckboxChange(leave._id)}
  className="mr-4 appearance-none border-2 border-black-300 rounded-full h-5 w-5 checked:bg-purpleColor checked:border-purpleColor relative flex items-center justify-center transition-all duration-200"
  style={{
    backgroundImage: selectedLeaves.includes(leave._id) 
      ? `url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e")` 
      : 'none'
  }}
/>
                <div className=" flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
        
                  <div>
                    <p className="text-gray-700">
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                        leave.leaveStatus === "Approved" ? "bg-green-100 text-green-800" :
                        leave.leaveStatus === "Rejected" ? "bg-red-100 text-red-800" :
                        "bg-yellow-100 text-yellow-800"
                      }`}>
                        {leave.leaveStatus || "pending"}
                      </span>
                    </p>
                    <p className="text-gray-700 text-sm mt-2">
                      {leave.type || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-6 text-gray-500">
            No leaves found matching the selected filter
          </div>
        )}
      </div>

      {/* Pagination Component */}
      {paginationData.totalPages > 0 && (
        <div className="mt-6">
          <Pagination
            currentPage={paginationData.currentPage}
            totalPages={paginationData.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default TeacherLeaves;