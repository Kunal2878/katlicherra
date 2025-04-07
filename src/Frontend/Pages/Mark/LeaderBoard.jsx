import React, { useState, useEffect } from "react";
import {
  Loader,
  Plus,
  X,School2
} from "lucide-react";

import AddMark from "./AddMark";
import Cookies from "js-cookie";
import {setLeaderBoard,setClassData,setIsLeaderBoardUpdate} from '../../../Store/slice'
import {GetLeaderBoardAPI, GetAllClassesAPI  ,GetStudentByIDAPI} from '../../../service/api'
import {useSelector, useDispatch} from 'react-redux'
import SelectDropdown from '../../Components/Elements/SelectDropDownList'
import { toast } from 'react-toastify';
const LeaderBoard = () => {
  const [selectedClass, setSelectedClass] = useState("");
  const [loading, setLoading] = useState(true); 
  const [showAddMark, setShowAddMark] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [studentData, setStudentData] = useState({});
  const [showFailure, setShowFailure] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");
  const classes = useSelector((state) => state.userData.ClassData);
  const leaderboardData = useSelector((state) => state.userData.LeaderBoardData);
  const isLeaderboardUpdate = useSelector((state) => state.userData.isLeaderboardUpdate);
  const dispatch = useDispatch();
  const studentsPerPage = 6;

  const url = import.meta.env.VITE_API_BASE_URL;
  const token = Cookies.get("token");

  useEffect(() => {
    document.title = "All Classes";
  }, []);

  useEffect(() => {
    if (showToast) {
      toast[toastType](toastMessage, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setShowToast(false);
    }
  }, [showToast,toastType,toastMessage]);


  const fetchClasses = async () => {
    const response = await GetAllClassesAPI(url);
    if (response.status === 200 || response.status === 204 || response.status === 201) {
      dispatch(setClassData(response.data.classes));
      setSelectedClass(response.data?.classes[0]?._id);
    } else {
      
    }
    setLoading(false);
  };

  const fetchStudentData = async (studentId) => {
    const response = await GetStudentByIDAPI(url, studentId);
    if (response.status === 200 || response.status === 201 || response.status === 204) {
      setStudentData(prev => ({...prev, [studentId]: response.data.student}));
      // showToastMessage(response.message, "success");
    }
    else{
    
        dispatch(setLeaderBoard([]));
        setShowToast(true);
        setToastMessage(response.message);
        setToastType("error");
    
    }
  };

useEffect(()=>{
fetchClasses()
},)
  useEffect(()=>{
    if(classes.length === 0 || leaderboardData.length===0) {
      setShowFailure(true);
    } else {
      
      setShowFailure(false);
    }
  },[classes, leaderboardData])


  const fetchLeaderboard = async () => {
      setLoading(true);
      const response = await GetLeaderBoardAPI(url, selectedClass);

      if (response.status === 200 || response.status === 201 || response.status === 204) 
        {
        dispatch(setLeaderBoard(response.data));
        response.data.forEach(item => {
        fetchStudentData(item.student);
        });
    
      } 
      
      else {
        dispatch(setLeaderBoard([]));
        setShowToast(true);
        setToastMessage(response.message);
        setToastType("error");
      }
      setLoading(false);
  };

  useEffect(() => {
    if(selectedClass!=="") { 
      fetchLeaderboard();
    }
  }, [selectedClass]);

  useEffect(() => {
    if(isLeaderboardUpdate) { 
      fetchLeaderboard();
      dispatch(setIsLeaderBoardUpdate(!isLeaderboardUpdate))
    }
  }, [isLeaderboardUpdate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="h-12 w-12 animate-spin text-purpleColor" />
      </div>
    );
  }

  return (
    <div className="sm:px-16 px-6 sm:py-16 py-10 min-h-screen">
      <div
        className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-all duration-300 ease-in-out ${
          showAddMark
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowAddMark(false);
          }
        }}
      >
        {showAddMark && (
          <div
            className={`relative rounded-lg w-auto max-h-[90vh] overflow-y-auto bg-white custom-scrollbar ${
              showAddMark
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-95 -translate-y-4 pointer-events-none"
            } transition-all duration-300 ease-in-out transform origin-center`}
          >
            <button
              onClick={() => setShowAddMark(false)}
              className="absolute top-6 lg:top-6 right-6 p-2 bg-white rounded-full text-black-300 hover:text-gray-800 transition-colors duration-200 transform hover:scale-110"
            >
              <X size={24} />
            </button>
            <AddMark onClose={() => setShowAddMark(false)} />
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row text-black justify-between items-start md:items-center mb-6 p-2">
      <div className="mb-4 md:mb-0 text-left">
          <h2 className="h2 mb-2">Student Leaderboard</h2>
          <div className="flex items-center subtitle-2 text-left">
            <span className="">Students Details / </span>
            <span>Student Leaderboard</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-2 rounded-md shadow-lg">
        <div className="flex flex-col md:flex-row justify-end items-stretch md:items-center gap-4 mb-6 bg-white">
        <SelectDropdown
                options={classes || []}
                selectedValue={selectedClass}
                onSelect={setSelectedClass}
                displayField="className"
                valueField="_id"
                placeholder="Select Class"
                icon={<School2 size={20} />}
                required={true}
              />
        </div>

        <div className="overflow-x-auto text-black-300 text-base bg-white m-4">
          <table className="w-full min-w-[768px] pb-10">
            <thead>
              <tr className="border-b bg-lamaPurpleLight">
                <th className="px-6 py-4 text-left">SL No</th>
                <th className="px-6 py-4 text-left">Student's Name</th>
                <th className="px-6 py-4 text-left">Marks Obtained</th>
                <th className="px-6 py-4 text-left">Total Marks</th>
                <th className="px-6 py-4 text-left">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData?.length > 0 ? (
                leaderboardData?.map((student, index) => (
                  <tr
                    key={student._id}
                    className="border-b hover:bg-gray-50 transition-colors duration-150 animate-fade-in">
                    <td className="px-6 py-4 text-left">{index + 1}</td>
                    <td className="px-6 py-4 text-left">{studentData[student.student]?.name}</td>
                    <td className="px-6 py-4 text-left">{student.totalObtained}</td>
                    <td className="px-6 py-4 text-left">{student.totalMax}</td>
                    <td className="px-6 py-4 text-left">{student.percentage.toFixed(2)}%</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-8">{selectedClass?'No data found for this class':'Select your class'}</td>
                </tr>
              )}
            </tbody>
          </table>
       
        </div>      
        </div>    
      </div>
  );
};

export default LeaderBoard;