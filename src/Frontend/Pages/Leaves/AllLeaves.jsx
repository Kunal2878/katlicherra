import React, { useState, useEffect } from "react";
import {
  Loader,
  GraduationCap,
  X,
  CheckCircle,
  XCircle
} from "lucide-react";
import AddLeaves from "./AddLeave";
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from "react-redux";
import { setLeaveData, setCurrentPage,setShowConfirmationModel,setConfirmRequest,setStatus, setAddText } from "../../../Store/slice";
import { GetAllLeavesAPI, Accept_RejectLeaveRequestAPI } from '../../../service/api';
import Table from "../../Components/Elements/Table";
import Pagination from "../../Components/Elements/Pagination";
import Confirmation from "../../Components/Elements/ConfirmationModel"


const AllLeaveDetails = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showLeave, setShowLeave] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [processing, setProcessing] = useState(false);
  const[leaveStatus, setLeaveStatus] = useState('')
  const[selectedLeave, setSelectedLeave] = useState('')
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
    document.title = "Leave Details";
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
    const response = await GetAllLeavesAPI(url);
    
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
      dispatch(setLeaveData([]));
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

  // Handle accept/reject leave request
  const handleLeaveAction = async (leaveId, status) => {
    if (processing) return;
    setLeaveStatus(status);
    setSelectedLeave(leaveId);
    dispatch(setShowConfirmationModel(true));
    

  };

const AcceptRejectLeaves = async()=>{
    const payload={
        leaveStatus:leaveStatus,
    }
    const response = await Accept_RejectLeaveRequestAPI(url, selectedLeave, payload);
    if(response.status===200|| response.status===201 ||response.status===204 )
    {
        dispatch(setStatus("success"))
        dispatch(setAddText(response.message))
        await fetchLeaves();

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
          
     
}

useEffect( ()=>{
    if(confirmRequest)
      {
      AcceptRejectLeaves()
      }
  },[confirmRequest])

  // Table columns definition
  const columns = [
    {
      field: 'teacherName',
      headerName: "Teacher Name",
      renderCell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-lamaPurpleLight rounded-full overflow-hidden flex flex-row justify-center items-center">
            <GraduationCap size={20} />
          </div>
          <span>{row.teacherName}</span>
        </div>
      ),
    },
    {
      field: 'type',
      headerName: 'Leave type',
      renderCell: (row) => row.type || "-",
    },
    {
      field: 'leaveStatus',
      headerName: 'Status',
      renderCell: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          row.leaveStatus === "Approved" ? "bg-green-100 text-green-800" :
          row.leaveStatus === "Rejected" ? "bg-red-100 text-red-800" :
          "bg-yellow-100 text-yellow-800"
        }`}>
          {row.leaveStatus || "pending"}
        </span>
      ),
    },

    {
      field: 'action',
      headerName: "Actions",
      renderCell: (row) => (
        <div className="flex items-center gap-3">
          {/* Only show action buttons if status is not already approved or rejected */}
          {row.status !== "approved" && row.status !== "rejected" ? (
            <>
              <button 
                onClick={() => handleLeaveAction(row._id, 'Approved')}
                className="w-10 h-10 hover:text-green-600 rounded-lg overflow-hidden flex flex-row justify-center items-center group relative"
                disabled={processing}
              >
                <CheckCircle size={20} className="text-green-500 hover:text-green-600" />
                <span className="absolute -bottom-6 left-50 transform -translate-x-1/2 bg-gray-800 text-success-500 text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  Accept
                </span>
              </button>
              <button 
                onClick={() => handleLeaveAction(row._id, 'Rejected')}
                className="w-10 h-10 hover:text-red-600 rounded-lg overflow-hidden flex flex-row justify-center items-center group relative"
                disabled={processing}
              >
                <XCircle size={20} className="text-danger hover:text-red-600" />
                <span className="absolute -bottom-6 left-50 transform -translate-x-1/2 bg-gray-800 text-danger text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  Reject
                </span>
              </button>
            </>
          ) : (
            <span className="text-gray-500 text-sm italic">
              {row.status === "approved" ? "Approved" : "Rejected"}
            </span>
          )}
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
      {/* AddLeave Modal */}
     
      
      {/* Header */}
      <div className="flex flex-col md:flex-row text-black justify-between items-start md:items-center mb-[32px] p-2">
        <div className="mb-4 md:mb-0 text-left">
          <h2 className="h2 mb-2 text-left">Leave Records</h2>
          <div className="flex items-center subtitle-2 text-left">
            <span className="">Attendance / </span>
            <span>Leave Records</span>
          </div>
        </div>
      </div>

      {/* Filters and Table */}
      <div className="bg-white p-2 rounded-md shadow-lg">
        {/* Search option can be added here if needed */}
        
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
            message={`Are you sure you want to ${leaveStatus} the leave? This action cannot be undone.`}
            note=""/>
        </div>
      )}


        {/* Table Component */}
        <Table
          columns={columns}
          data={leaves || []}
          checkboxSelection={false}
          actions={false}
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

export default AllLeaveDetails;