import { createSlice } from '@reduxjs/toolkit'
import { set } from 'react-hook-form'

const dataSlice = createSlice({
  name: 'userData',
  initialState: {
    role:'',
    StudentCount:'',
    TeacherCount:'',
    CurrentPage:1,
    eventsChanged:'',
    isStudentUpdate:false,
    isTeacherUpdate:false,
    isLeaderboardUpdate:false,
    showLogoutConfirm:false,
    showConfirmationModel:false,
    confirmRequest:false,
    transactionUpdate:false,
    status:'',
    addText:'',
    user:[],
    LoginData:[],
    ClassData:[],
    StudentData:[],
    StudentByClassData:[],
    TeacherData:[],
    SubjectData:[],
    EventData:[],
    AnnouncementData:[],
    LeaderBoardData:[],
    TransactionData:[],
    StudentFinanceData:[],
    OtherExpenseData:[],
    TeacherAttendanceData:[],
    StudentAttendanceData:[],
    GenderRatio:[],
    LeaveData:[]

  },
  reducers: {
  
    setRole: (state,action) => {
      // state.id = action.payload.id,
      state.role = action.payload
    },
    setUser:(state,action) => {
      state.user=action.payload
    },
    setIsLeaderBoardUpdate:(state,action)=>{
state.isLeaderboardUpdate= action.payload
    },
    setLoginData:(state,action) => {
      state.LoginData=action.payload
    },
    setClassData:(state,action) => {
      state.ClassData=action.payload
    },
    setStudentData:(state,action) => {
      state.StudentData=action.payload
    },
    setTeacherData:(state,action) => {
      state.TeacherData=action.payload
    },
    setSubjectData:(state,action) => {
      state.SubjectData=action.payload
    },
    setEventData:(state,action) => {
      state.EventData=action.payload
    },
    setAnnouncementData:(state,action) => {
      state.AnnouncementData=action.payload
    },
   setStudentCount:(state,action) => {
      state.StudentCount=action.payload
    },
    setTeacherCount:(state,action) => {
      state.TeacherCount=action.payload
    },
    setLeaderBoard:(state,action) => {
      state.LeaderBoardData=action.payload
    },
    setCurrentPage:(state,action) => {
      state.CurrentPage=action.payload
    },
    setTransactionData:(state,action) => {
      state.TransactionData=action.payload
    },
    setStudentFinanceData:(state,action) => {
      state.StudentFinanceData=action.payload
    },
    setOtherExpenseData:(state,action) => {
      state.OtherExpenseData=action.payload
    },
    setStudentByClassData:(state,action)=>{
      state.StudentByClassData = action.payload
    },
    setIsStudentUpdate:(state,action)=>{
      state.isStudentUpdate=action.payload
    },
    setIsTeacherUpdate:(state,action)=>{
      state.isTeacherUpdate=action.payload
    },
    setTeacherAttendanceData:(state,action)=>{
      state.TeacherAttendanceData = action.payload
    },
    setStudentAttendanceData:(state,action)=>{
      state.StudentAttendanceData =action.payload
    },
    updateStudentAttendance: (state, action) => {
      const { studentId, status } = action.payload;
      
      // Find existing student attendance
      const existingIndex = state.StudentAttendanceData.findIndex(
        (item) => item.student === studentId
      );
      
      if (existingIndex !== -1) {
        // Update existing student's status
        state.StudentAttendanceData[existingIndex] = { 
          ...state.StudentAttendanceData[existingIndex], 
          status 
        };
      } else {
        // Add new student attendance
        state.StudentAttendanceData.push({ 
          student: studentId, 
          status 
        });
      }
    },
    
setGenderRatio:(state,action)=>{
      state.GenderRatio = action.payload
},

setShowLogoutConfirm:(state,action) =>{
  state.showLogoutConfirm=action.payload
},
setShowConfirmationModel:(state,action) =>{
  state.showConfirmationModel=action.payload
},
setStatus:(state,action) =>{
  state.status=action.payload
},
setAddText:(state,action) =>{
  state.addText=action.payload
},
setConfirmRequest:(state,action) =>{
  state.confirmRequest=action.payload
},
setLeaveData:(state,action) =>{
  state.LeaveData=action.payload
},
setEventsChanged:(state,action) =>{
  state.eventsChanged=action.payload
},
setTransactionUpdate:(state,action) =>{
  state.transactionUpdate=action.payload
},

}
})

export const {setRole,setUser,setLoginData,setClassData,setStudentData,setTeacherData,setSubjectData,
  setEventData,setAnnouncementData,setStudentCount,setTeacherCount,
  setLeaderBoard,setCurrentPage,setTransactionData,setStudentFinanceData,
  setOtherExpenseData,setStudentByClassData,setIsStudentUpdate,setIsTeacherUpdate,setTeacherAttendanceData,
  setStudentAttendanceData ,updateStudentAttendance,setIsLeaderBoardUpdate,setGenderRatio,setShowLogoutConfirm,
  setShowConfirmationModel,setStatus,setAddText,setConfirmRequest,setLeaveData,
  setEventsChanged,setTransactionUpdate}
 = dataSlice.actions
export default dataSlice.reducer