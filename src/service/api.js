import axios from "axios";

import {
    SignupPrincipal, LoginPrincipal, SignupTeacher, LoginTeacher, GetAllTeacher, MarkTeacherAttendance,
    GetTeacherAttendance, SignupStudent,LoginStudent,GetAllStudent,CreateClass,
    GetAllClass, CreateSubject, CreateExam, GetAllExams, UploadExamTimeTable, CreateEvent, DeleteEvent,
    CreateAnnouncement,DeleteAnnouncement,CreateComplaint,GetAllComplaints,
    DeleteComplaint, GetAllEvents, GetAllAnnouncements,GetStudentByClass,
    GetStudentByID,GetAllStudentCount,GetAllTeacherCount, GetLeaderBoard,GetTeacherByID,
    GetSubjectByClass,AddMarkStudent, AddTransaction, GetTransactionsByTeacher,FilterTransaction,
     UpdateStudent, GetStudentAttendanceByID, PasswordChange,
      AddStudentTransaction,GetClassFeeTransaction,GetStudentFeeTransaction,
      AddOtherExpense,GetOtherExpense,DeleteOtherExpenseByID,GetAllTeachers, SendLeave,
      GetAllLeaveTeacher, Accept_RejectLeaveRequest,DeleteLeaveRequest, GetAllLeaves,
      GetAllClasses,DeleteClass,GetGenderRatio,ImposeFine, DeleteExam,
      AcceptRejectPayReq,GetTeacherExpense,SendAdvPayReq,GetAllSubjects,DeleteTeacher,DeleteStudent
  } from '../Frontend/Route';

export const LoginUser = async (url, payload, role) => {
  try {
    let endpoint = `${url}${LoginPrincipal}`;
    if (role === "student") {
      endpoint = `${url}${LoginStudent}`;
    } else if (role === "teacher") {
      endpoint = `${url}${LoginTeacher}`;
    }
  
    const response = await axios.post(endpoint, payload);
  
    const responseData = response.data;

    if (response.status === 200 || response.status === 201 || response.status === 204) {
      return {
        status: response.status,
        data: {
          token: role === "student"||role==="teacher" ? responseData.data.accessToken : responseData.token,
          user: role === "student" 
            ? responseData.data.user 
            : role === "teacher"
            ? responseData.data.user
            : responseData.user
        },
        message: response.data.message
      };
    } 
    else {
      return {
        status: response.status,
        data: null,
        message: response.data.message
      };
    }
  } catch (err) {
    return {
      status: err.status,
      data: null,
      message: err.response.data.message || "Network error, try after sometime"
    };
  }
};  

export const RegisterPrincipalAccount = async (url, payload) => {
  try {
    const endpoint = `${url}${SignupPrincipal}`;
    const response = await axios.post(endpoint, payload);
    
    if (response.status === 200 || response.status === 201) {
      return {
        status: response.status,
        data: response.data,
        message: response.data.message
      };
    } 
    else {
      return {
        status: response.status,
        data: null,
        message: response.data.message
      };
    }
  } 
  catch (err) {
    return {
      status: err.status,
      data: null,
      message: err.response.data.message || "Network error, try after sometime"
    };
  }
};export const RegisterTeacherAccount = async (url, token, payload) => {
  try {
    const endpoint = `${url}${SignupTeacher}`;
      const response = await axios.post(endpoint, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });    
    if (response.status === 200 || response.status === 201 || response.status === 204) {
      return {
        status: response.status,
        data: response.data,
        message: response.data.message
      };
    } else {
      return {
        status: response.status,
        data: null,
        message: response.data.message
      };
    }
  } catch (err) {
    return {
      status: err.status,
      data: null,
      message: err.response.data.message || "Network error, try after sometime"
    };
  }
};

export const RegisterStudent = async (url, payload) => {
  try {
    const endpoint = `${url}${SignupStudent}`;
    const response = await axios.post(endpoint, payload);
    
    if (response.status === 200 || response.status === 201) {
      return {
        status: response.status,
        data: response.data,
        message: response.data.message
      };
    } else {
      return {
        status: response.status,
        data: null,
        message: response.data.message
      };
    }
  } catch (err) {
    return {
      status: err.status,
      data: null,
      message: err.response.data.message || "Network error, try after sometime"
    };
  }
};

export const AcceptRejectPayReqAPI = async (url,payload, type) => {
  try {
    const endpoint = `${url}${AcceptRejectPayReq}/?type=${type}`;
    const response = await axios.post(endpoint,payload );
    
    if (response.status === 200 || response.status === 201 || response.status === 204) {
      return {
        status: response.status,
        data: response.data,
        message: response.data.message
      };
    } else {
      return {
        status: response.status,
        data: null,
        message: response.data.message
      };
    }
  } catch (err) {
    console.log(err)
    return {
      status: err.status,
      data: null,
      message: err.response.data.message || "Network error, try after sometime"
    };
  }
};
export const GetTeacherExpenseApi = async (url,teacherID,month) => {

  console.log(teacherID,month)
  try {
    const endpoint = `${url}${GetTeacherExpense}/${teacherID}/${month}`;
    const response = await axios.get(endpoint);
    console.log(response.data.data)
    if (response.status === 200 || response.status === 201 || response.status === 204) {
      return {
        status: response.status,
        data: response.data.data,
        message: response.data.message
      };
    } else {
      return {
        status: response.status,
        data: null,
        message: response.data.message
      };
    }
  } catch (err) {
    console.log(err)
    return {
      status: err.status,
      data: null,
      message: err.response.data.message || "Network error, try after sometime"
    };
  }
};





export const GetTeachersPages = async (url,currentpage) => {
  try {
    const endpoint = `${url}${GetAllTeacher}/?page=${currentpage}`;
    const response = await axios.get(endpoint);
    
    if (response.status === 200 || response.status === 201 || response.status === 204) {
      return {
        status: response.status,
        data: response.data.data,
        message: response.data.message
      };
    } else {
      return {
        status: response.status,
        data: null,
        message: response.data.message
      };
    }
  } catch (err) {
    return {
      status: err.status,
      data: null,
      message: err.response.data.message || "Network error, try after sometime"
    };
  }
};

export const GetTeachers = async (url) => {
  try {
    const endpoint = `${url}${GetAllTeacher}`;
    const response = await axios.get(endpoint);
    
    if (response.status === 200 || response.status === 201 || response.status === 204) {
      return {
        status: response.status,
        data: response.data.data,
        message: response.data.message
      };
    } else {
      return {
        status: response.status,
        data: null,
        message: response.data.message
      };
    }
  } catch (err) {
    return {
      status: err.status,
      data: null,
      message: err.response.data.message || "Network error, try after sometime"
    };
  }
};

export const GetAllTeachersAPI = async (url) => {
  try {
    const endpoint = `${url}${GetAllTeachers}`;
    const response = await axios.get(endpoint);
    
    if (response.status === 200 || response.status === 201 || response.status === 204) {
      return {
        status: response.status,
        data: response.data.data,
        message: response.data.message
      };
    } else {
      return {
        status: response.status,
        data: null,
        message: response.data.message
      };
    }
  } catch (err) {
    return {
      status: err.status,
      data: null,
      message: err.response.data.message || "Network error, try after sometime"
    };
  }
};

export const DeleteTeacherAPI = async (url,payload,token)=>{

  try{
    const endpoint = `${url}${DeleteTeacher}`;
    const response = await axios.delete(endpoint, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      data: payload
    });
    
    if (response.status === 200 || response.status === 201 || response.status === 204) {
      
      return {
        status: response.status,
        data: response.data.data,
        message: response.data.message
      };
    } else {
      return {
        status: response.status,
        data: null,
        message: response.data.message
      };
    }
  }
  catch(err){
    console.log(err)
    return {
      status: err.status,
      data: null,
      message: err.response.data.message || "Network error, try after sometime"
    };
  }
}


export const SendAdvPayReqApi = async (url, payload) => {

try {
    const endpoint = `${url}${SendAdvPayReq}`;
    const response = await axios.post(endpoint, payload);
    
    if (response.status === 200 || response.status === 201) 
      {

      return {
        status: response.status,
        data: response.data,
        message: response.data.message
      };
    } else {
      return {
        status: response.status,
        data: null,
        message: response.data.message
      };
    }
  } catch (err) {
    console.log(err)
    return {
      status: err.status,
      data: null,
      message: err.response.data.message || "Network error, try after sometime"
    };
  }
};


export const SendLeaveAPI = async (url, payload) => {
  try {
    const endpoint = `${url}${SendLeave}`;
    const response = await axios.post(endpoint, payload);
    
    if (response.status === 200 || response.status === 201) {
      return {
        status: response.status,
        data: response.data,
        message: response.data.message
      };
    } else {
      return {
        status: response.status,
        data: null,
        message: response.data.message
      };
    }
  } catch (err) {
    console.log(err)
    return {
      status: err.status,
      data: null,
      message: err.response.data.message || "Network error, try after sometime"
    };
  }
};
export const GetAllLeaveTeacherAPI = async (url, id) => {

  try {
    // const endpoint = `${url}${GetAllLeaveTeacher}?email=${email}`;
    const endpoint = `${url}${GetAllLeaveTeacher}/${id}`;
    const response = await axios.get(endpoint);
    if (response.status === 200 || response.status === 201 || response.status === 204) {
      return {
        status: response.status,
        count:response.data.count,
        data: response.data.data,
        message: response.data.message
      };
    } else {
      return {
        status: response.status,
        data: null,
        message: response.data.message
      };
    }
  } catch (err) {
    console.log(err)
    return {
      status: err.status,
      data: null,
      message: err.response.data.message || "Network error, try after sometime"
    };
  }
};

export const Accept_RejectLeaveRequestAPI = async (url,id, payload) => {
  console.log(id,payload)
  try {
    const endpoint = `${url}${Accept_RejectLeaveRequest}/${id}`;
    const response = await axios.post(endpoint, payload);
    
    if (response.status === 200 || response.status === 201) {
      return {
        status: response.status,
        data: response.data,
        message: response.data.message
      };
    } else {
      return {
        status: response.status,
        data: null,
        message: response.data.message
      };
    }
  } catch (err) {
    console.log(err)
    return {
      status: err.status,
      data: null,
      message: err.response.data.message || "Network error, try after sometime"
    };
  }
};

export const DeleteLeaveRequestAPI = async (url, id) => {
  console.log(id)
  try {
    const endpoint = `${url}${DeleteLeaveRequest}/${id}`;
    const response = await axios.delete(endpoint);
    if (response.status === 200 || response.status === 201) {
      return {
        status: response.status,
        data: response.data,
        message: response.data.message
      };
    } else {
      return {
        status: response.status,
        data: null,
        message: response.data.message
      };
    }
  } catch (err) {
    console.log(err)
    return {
      status: err.status,
      data: null,
      message: err.response.data.message || "Network error, try after sometime"
    };
  }
};

export const GetAllLeavesAPI = async (url) => {
  try {
    const endpoint = `${url}${GetAllLeaves}`;
    const response = await axios.get(endpoint);
    console.log(response.data)
    if (response.status === 200 || response.status === 201 || response.status === 204) {
      return {
        status: response.status,
        data: response.data.data,
        message: response.data.message
      };
    } else {
      console.log(response.data)
      return {
        status: response.status,
        data: null,
        message: response.data.message
      };
    }
  } catch (err) {

    return {
      status: err.status,
      data: null,
      message: err.response.data.message || "Network error, try after sometime"
    };
  }
};




export const GetAllTeacherCountAPI = async (url) => {
  try {
    const endpoint = `${url}${GetAllTeacherCount}`;
    const response = await axios.get(endpoint);
    
    if (response.status === 200 || response.status === 201 || response.status === 204) {
      return {
        status: response.status,
        data: response.data,
        message: response.data.message
      };
    } else {
      return {
        status: response.status,
        data: null,
        message: response.data.message
      };
    }
  } catch (err) {
    return {
      status: err.status,
      data: null,
      message: err.response.data.message || "Network error, try after sometime"
    };
  }
};

export const MarkTeacherAttendanceAPI = async (url, payload) => {
  try {
    const endpoint = `${url}${MarkTeacherAttendance}`;
    const response = await axios.post(endpoint, payload);
    
    if (response.status === 200 || response.status === 201) {
      return {
        status: response.status,
        data: response.data,
        message: response.data.message
      };
    } else {
      return {
        status: response.status,
        data: null,
        message: response.data.message
      };
    }
  } catch (err) {
    return {
      status: err.status,
      data: null,
      message: err.response.data.message || "Network error, try after sometime"
    };
  }
};

export const GetTeacherByIDAPI = async (url,teacherID) => {
  try {
    const endpoint = `${url}${GetTeacherByID}/${teacherID}`;
    const response = await axios.get(endpoint);
    
    if (response.status === 200 || response.status === 201 || response.status === 204) {
      return {
        status: response.status,
        data: response.data.data,
        message: response.data.message
      };
    } else {
      return {
        status: response.status,
        data: null,
        message: response.data.message
      };
    }
  } catch (err) {
    return {
      status: err.response.status,
      data: null,
      message: err.response.data.message || "Network error, try after sometime"
    };
  }
};

export const GetTeacherAttendanceAPI = async (url) => {
  try {
    const endpoint = `${url}${GetTeacherAttendance}`;
    const response = await axios.get(endpoint);
    
    if (response.status === 200 || response.status === 201 || response.status === 204) {
      return {
        status: response.status,
        data: response.data,
        message: response.data.message
      };
    } else {
      return {
        status: response.status,
        data: null,
        message: response.data.message
      };
    }
  } catch (err) {
    return {
      status: err.status,
      data: null,
      message: err.response.data.message || "Network error, try after sometime"
    };
  }
};

export const PasswordChangeAPI = async (url,payload,token) => {
  try {
    const endpoint = `${url}${PasswordChange}`;
    const response = await axios.post(endpoint, payload,{
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.status === 200 || response.status === 201 || response.status === 204) {
      return {
        status: response.status,
        data: response.data,
        message: response.data.message
      };
    } else {
      return {
        status: response.status,
        data: null,
        message: response.data.message
      };
    }
  } catch (err) {
    return {
      status: err.response.status,
      data: null,
      message: err.response.data.message || "Network error, try after sometime"
    };
  }
};

export const GetStudents = async (url,page) => {
  try {
    const endpoint = `${url}${GetAllStudent}/?page=${page}`;
    const response = await axios.get(endpoint);
    
    if (response.status === 200 || response.status === 201 || response.status === 204) {
      return {
        status: response.status,
        data: response.data.data,
        message: response.data.message
      };
    } else {
      return {
        status: response.status,
        data: null,
        message: response.data.message
      };
    }
  } catch (err) {
    return {
      status: err.status,
      data: null,
      message: err.response.data.message || "Network error, try after sometime"
    };
  }
};
export const GetStudentByClassAPI = async (url,classId) => {
  try {
    const endpoint = `${url}${GetStudentByClass}/${classId}`;
    const response = await axios.get(endpoint);
    
    if (response.status === 200 || response.status === 201 || response.status === 204) {
     
      return {
        status: response.status,
        data: response.data.data,
        message: response.data.message
      };
    } else {
      return {
        status: response.status,
        data: null,
        message: response.data.message
      };
    }
  } catch (err) {

    return {
      status: err.status,
      data: null,
      message: err.response.data.message|| "Network Error, try after sometime"
    };
  }
};
export const GetStudentByIDAPI = async (url,studentID) => {
  try {
    const endpoint = `${url}${GetStudentByID}/${studentID}`;
    const response = await axios.get(endpoint);
    
    if (response.status === 200 || response.status === 201 || response.status === 204) {
     
      return {
        status: response.status,
        data: response.data.data,
        message: response.data.message
      };
    } else {
      return {
        status: response.status,
        data: null,
        message: response.data.message
      };
    }
  } catch (err) {
   
    return {
      status: err.status,
      data: null,
      message: err.response.data.message || "Network Error, try after sometime"
    };
  }
};

export const GetAllStudentCountAPI = async (url) => {
  try {
    const endpoint = `${url}${GetAllStudentCount}`;
    const response = await axios.get(endpoint);
    
    if (response.status === 200 || response.status === 201 || response.status === 204) {
      return {
        status: response.status,
        data: response.data,
        message: response.data.message
      };
    } else {
 
      return {
        status: response.status,
        data: null,
        message: response.data.message
      };
    }
  } catch (err) {
    return {
      status: err.status,
      data: null,
      message:  err.response.data.message || "Network Error, try after sometime"
    };
  }
};

export const GetStudentAttendanceByIDAPI = async (url, studentID) => {
  try {
    const endpoint = `${url}${GetStudentAttendanceByID}/${studentID}/attendance-history`;
    const response = await axios.get(endpoint);
    
    if (response.status === 200 || response.status === 201 || response.status === 204) {
      return {
        status: response.status,
        data: response.data.attendanceHistory,
        message: response.data.message
      };
    } else {
   
      return {
        status: response.status,
        data: null,
        message: response.data.message
      };
    }
  } catch (err) {
   
    return {
      status: err.status,
      data: null,
      message: err.response.data.message || "Network error, try after sometime"
    };
  }
};

export const DeleteStudentAPI = async (url, payload, token) => {
 
  try {
    const endpoint = `${url}${DeleteStudent}`;
    const response = await axios.delete(endpoint,{
      
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: payload
    
    });
    
    if (response.status === 200 || response.status === 201 || response.status === 204) {
      return {
        status: response.status,
        data: response.data,
        message: response.data.message || "Student deleted successfully"
      };
    } else {
      return {
        status: response.status,
        data: null,
        message: response.data.message || "Failed to delete student"
      };
    }
  } catch (err) 
  {
  
    return {
      status: err.status,
      data: null,
      message: err.response.data.message || "Network error, try after sometime"
    };
  }
};

export const GetGenderRatioAPI = async (url, token) => {
  try {
    const endpoint = `${url}${GetGenderRatio}`;

      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    if (response.status === 200 || response.status === 201 || response.status === 204) {
      return {
        status: response.status,
        data: response.data.data,
        message: response.data.message || "Gender ratio retrieved successfully"
      };
    } 
    
    else {

      return {
        status: response.status,
        data: null,
        message: response.data.message || "Failed to retrieve gender ratio"
      };
    }
  } catch (err) {
   
    return {
      status: err.status,
      data: null,
      message: err.response.data.message || "Network error, try after sometime"
    };
  }
};








export const GetLeaderBoardAPI = async (url, classID) => {
  try {
    const endpoint = `${url}${GetLeaderBoard}/${classID}`;

    const response = await axios.get(endpoint);
    console.log(response.data)
    if (response.status === 200 || response.status === 201 || response.status === 204) {
      return {
        status: response.status,
        data: response.data.data,
        message: response.data.message || "Leaderboard data retrieved successfully"
      };
    } 
    
    else {

      return {
        status: response.status,
        data: null,
        message: response.data.message || "Failed to retrieve leaderboard data"
      };
    }
  } catch (err) {
    console.log(err);
    return {
      status: err.status,
      data: null,
      message: err.response.data.message || "Network error, try after sometime"
    };
  }
};

export const AddMarkStudentAPI = async (url, payload, token) => {
  try {
    const endpoint = `${url}${AddMarkStudent}`;
    const response = await axios.post(endpoint, payload, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.status === 200 || response.status === 201 || response.status === 204) {
      return {
        status: response.status,
        data: response.data,
        message: response.data.message
      };
    }
      else {
        return {
          status: response.status,
          data: null,
          message: response.data.message
        };
    } 
  } catch (err) {
 
    return {
      status: err.status,
      data: null,
      message: err.response.data.message || "Network error, try after sometime"
    };
  }
};





export const CreateClassAPI = async (url, payload,token) => {
  try {
    const endpoint = `${url}${CreateClass}`;
      const response = await axios.post(endpoint, payload, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });    
    if (response.status === 200 || response.status === 201  || response.status === 204) {
      return {
        status: response.status,
        data: response.data,
        message: response.data.message
      };
    } 
    else if (response.status === 401) {
      return {
        status: response.status,
        data: null,
        message: response.data.message
      };
    }
    else {
      return {
        status: response.status,
        data: null,
        message: response.data.message
      };
    }
  } catch (err) {
    console.log(err);
    return {
      status: err.status,
      data: null,
      message: err.response.data.message || "Network error, try after sometime"
    };
  }
};

export const GetClasses = async (url) => {
  try {
    const endpoint = `${url}${GetAllClass}`;
    const response = await axios.get(endpoint);
    
    if (response.status === 200) {
      return {
        status: response.status,
        data: response.data.data,
        message: response.data.message
      };
    } else {
      return {
        status: response.status,
        data: null,
        message: response.data.message
      };
    }
  } catch (err) {
    console.log(err);
    return {
      status: err.status,
      data: null,
      message: err.response.data.message || "Network error, try after sometime"
    };
  }
};

export const GetAllClassesAPI = async (url) => {
  try {
    const endpoint = `${url}${GetAllClasses}`;
    const response = await axios.get(endpoint);
    
    if (response.status === 200 || response.status === 201||response.status === 204) {
      return {
        status: response.status,
        data: response.data.data,
        message: response.data.message
      };
    } else {
      return {
        status: response.status,
        data: null,
        message: response.data.message
      };
    }
  } catch (err) {
    return {
      status: err.status,
      data: null,
      message: err.response.data.message || "Network error, try after sometime"
    };
  }
};


export const DeleteClassAPI = async (url, token, classID) => {
  try {
    const endpoint = `${url}${DeleteClass}/${classID}`;
    const response = await axios.delete(endpoint, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.status === 200 || response.status === 204) {
      return {
        status: response.status,
        data: response.data,
        message: response.data.message
      };
    } else {
      return {
        status: response.status,
        data: null,
        message: response.data.message
      };
    }
  } catch (err) {
    return {
      status: err.status,
      data: null,
      message: err.response.data.message || "Network error, try after sometime"
    };
  }
};

export const CreateSubjectAPI = async (url, payload,token) => {
  try {
    const endpoint = `${url}${CreateSubject}`;
      const response = await axios.post(endpoint, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });    
    if (response.status === 200 || response.status === 201) {
      return {
        status: response.status,
        data: response.data,
        message: response.data.message
      };
    } else {
      return {
        status: response.status,
        data: null,
        message: response.data.message
      };
    }
  } catch (err) {
    return {
      status: err.status,
      data: null,
      message: err.response.data.message || "Network error, try after sometime"
    };
  }
};

export const GetSubjects = async (url) => {
  try {
    const endpoint = `${url}${GetAllSubject}`;
    const response = await axios.get(endpoint);
    
    if (response.status === 200) {
      return {
        status: response.status,
        data: response.data,
        message: response.data.message
      };
    } else {
      return {
        status: response.status,
        data: null,
        message: response.data.message
      };
    }
  } catch (err) {
    return {
      status: err.status,
      data: null,
      message: err.response.data.message || "Network error, try after sometime"
    };
  }
};

export const GetSubjectByClassAPI = async (url, classId) => {
  try {
    const endpoint = `${url}${GetSubjectByClass}/${classId}`;
    const response = await axios.get(endpoint);
    
    if (response.status === 200 || response.status === 201 || response.status === 204) {
      return {
        status: response.status,
        data: response.data,
        message: response.data.message
      };
    } else {
      return {
        status: response.status,
        data: null,
        message: response.data.message
      };
    }
  } catch (err) {
    return {
      status: err.status,
      data: null,
      message: err.response.data.message || "Network error, try after sometime"
    };
  }
};
export const GetAllSubjectsAPI = async (url) => {
  try {
    const endpoint = `${url}${GetAllSubjects}`;
    const response = await axios.get(endpoint);
    
    if (response.status === 200) {
      return {
        status: response.status,
        data: response.data,
        message: response.data.message
      };
    } else {
      return {
        status: response.status,
        data: null,
        message: response.data.message
      };
    }
  } catch (err) {
    return {
      status: err.status,
      data: null,
      message: err.response.data.message || "Network error, try after sometime"
    };
  }
};





export const CreateExamAPI = async (url, payload) => {
  try {
    const endpoint = `${url}${CreateExam}`;
    const response = await axios.post(endpoint, payload);
    
    if (response.status === 200 || response.status === 201) {
      return {
        status: response.status,
        data: response.data,
        message: response.data.message
      };
    } else {
      return {
        status: response.status,
        data: null,
        message: response.data.message
      };
    }
  } catch (err) {
    return {
      status: err.status,
      data: null,
      message: err.response.data.message || "Network error, try after sometime"
    };
  }
};

export const GetExamsAPI = async (url) => {
  try {
    const endpoint = `${url}${GetAllExams}`;
    const response = await axios.get(endpoint);
    
    if (response.status === 200) {
      return {
        status: response.status,
        data: response.data.data,
        message: response.data.message
      };
    } else {
      return {
        status: response.status,
        data: null,
        message: response.data.message
      };
    }
  } catch (err) {
    return {
      status: err.status,
      data: null,
      message: err.response.data.message || "Network error, try after sometime"
    };
  }
};


export const DeleteExamAPI = async (url, token, examId) => {
  try {
    const endpoint = `${url}${DeleteExam}/${examId}`;
    const response = await axios.delete(endpoint, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.status === 200 || response.status === 204) {
      return {
        status: response.status,
        data: response.data,
        message: response.data.message
      };
    } else {
      return {
        status: response.status,
        data: null,
        message: response.data.message
      };
    }
  } catch (err) {
    return {
      status: err.status,
      data: null,
      message: err.response.data.message || "Network error, try after sometime"
    };
  }
};




export const UploadExamTimeTableAPI = async (url, payload) => {
  try {
    const endpoint = `${url}${UploadExamTimeTable}`;
    const response = await axios.post(endpoint, payload);
    
    if (response.status === 200 || response.status === 201) {
      return {
        status: response.status,
        data: response.data,
        message: response.data.message
      };
    } else {
      return {
        status: response.status,
        data: null,
        message: response.data.message
      };
    }
  } catch (err) {
    return {
      status: err.status,
      data: null,
      message: err.response.data.message || "Network error, try after sometime"
    };
  }
};

export const CreateEventAPI = async (url, payload,token) => {
  try {
    const endpoint = `${url}${CreateEvent}`;
      const response = await axios.post(endpoint, payload, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });    
    if (response.status === 200 || response.status === 201 || response.status === 204) {
      return {
        status: response.status,
        data: response.data,
        message: response.data.message
      };
    } else if (response.status === 401) {
      return {
        status: response.status,
        data: null,
        message: response.data.message
      };
    } else {
      return {
        status: response.status,
        data: null,
        message: response.data.message
      };
    }
  } catch (err) {
    return {
      status: err.status,
      data: null,
      message: err.response.data.message || "Network error, try after sometime"
    };
  }
};export const GetAllEventsAPI = async (url,token) => {
  try {
    const endpoint = `${url}${GetAllEvents}`;
      const response = await axios.get(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });    
    if (response.status === 200 || response.status === 201 || response.status === 204) {
      return {
        status: response.status,
        data: response.data.data,
        message: response.data.data.message || "Events retrieve successfully."
      };
    } else if (response.status === 401) {
      return {
        status: response.status,
        data: null,
        message: "Token expired, ReLogin to use the services"
      };
    } else {
      return {
        status: response.status,
        data: null,
        message: "Failed to retrieve events."
      };
    }
  } catch (err) {
    return {
      status: err.status,
      data: null,
      message:  err.response.data.message || "Failed to retrieve events."
    };
  }
};

export const DeleteEventAPI = async (url, eventIds,token) => {
  try {
    const endpoint = `${url}${DeleteEvent}`;
    const response = await axios.delete(endpoint,{
      headers: {
        'Authorization': `Bearer ${token}`
      },
      data:eventIds
    });
    
    if (response.status === 200 || response.status === 201 || response.status === 204) {
      return {
        status: response.status,
        data: response.data.data,
        message: "Event deleted successfully!"
      };
    } else if (response.status === 401) {
      return {
        status: response.status,
        data: null,
        message: "Token expired, ReLogin to use the services"
      };
    } else {
      return {
        status: response.status,
        data: null,
        message: "Failed to delete event."
      };
    }
  } catch (err) {
    return {
      status: err.status,
      data: null,
      message:  err.response.data.message || "Failed to delete event."
    };
  }
};

export const CreateAnnouncementAPI = async (url, payload, token) => {
  try {
    const endpoint = `${url}${CreateAnnouncement}`;
    const response = await axios.post(endpoint, payload, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.status === 200 || response.status === 201 || response.status === 204) {
      return {
        status: response.status,
        data: response.data,
        message: response.data.data.message
      };
    } else if (response.status === 401) {
      return {
        status: response.status,
        data: null,
        message: "Token expired, ReLogin to use the services"
      };
    } else {
      return {
        status: response.status,
        data: null,
        message: "Failed to create announcement."
      };
    }
  } catch (err) {
    return {
      status: err.status,
      data: null,
      message:  err.response.data.message 
    };
  }
};
export const GetAllAnnouncementsAPI = async (url, token) => {
  try {
    const endpoint = `${url}${GetAllAnnouncements}`;
    const response = await axios.get(endpoint, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.status === 200 || response.status === 201 || response.status === 204) {
      return {
        status: response.status,
        data: response.data.data,
        message: response.data.message || "Announcements retrieved successfully!"
      };
    } else if (response.status === 401) {
      return {
        status: response.status,
        data: null,
        message: response.data.message
      };
    } else {
      return {
        status: response.status,
        data: null,
        message: response.data.message
      };
    }
  } catch (err) {
    return {
      status: err.status,
      data: null,
      message: err.response.data.message || "Network error, try after sometime"
    };
  }
};

export const DeleteAnnouncementAPI = async (url, announcementIds, token) => {
  try {
    const endpoint = `${url}${DeleteAnnouncement}`;
    const response = await axios.delete(endpoint, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      data:announcementIds
    });
    
    if (response.status === 200 || response.status === 201 || response.status === 204) {
      return {
        status: response.status,
        data: response.data,
        message: response.data.message
      };
    } else if (response.status === 401) {
      return {
        status: response.status,
        data: null,
        message: response.data.message
      };
    } else {
      return {
        status: response.status,
        data: null,
        message: response.data.message
      };
    }
  } 
  catch (err) {
    return {
      status: err.status,
      data: null,
      message: err.response.data.message || "Network error, try after sometime"
    };
  }}
  export const AddTransactionAPI = async (url, transactionData, token) => {
    try {
      const endpoint = `${url}${AddTransaction}`;
      const response = await axios.post(endpoint, transactionData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 200 || response.status === 201) {
        return {
          status: response.status,
          data: response.data,
          message: response.data.message
        };
      } else if (response.status === 401) {
        return {
          status: response.status,
          data: null,
          message: response.data.message
        };
      } else {
        return {
          status: response.status,
          data: null,
          message: response.data.message
        };
      }
    } catch (err) {
      return {
        status: err.status,
        data: null,
        message: err.response.data.message || "Network error, try after sometime"
      };
    }
  };
  
  export const GetTransactionsByTeacherAPI = async (url, token,teacherId,month) => {
    try {
      const endpoint = `${url}${GetTransactionsByTeacher}/${teacherId}?month=${month}`;
      const response = await axios.get(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.status === 200 || response.status === 201 ||response.status === 204 ) {
        return {
          status: response.status,
          data: response.data.data,
          message: response.data.message
        };
      } else if (response.status === 401) {
        return {
          status: response.status,
          data: null,
          message: response.data.message
        };
      } else {
        return {
          status: response.status,
          data: null,
          message: response.data.message
        };
      }
    } catch (err) {
      return {
        status: err.status,
        data: null,
        message: err.response.data.message || "Network error, try after sometime"
      };
    }
  };
  export const FilterTransactionAPI = async (url, token,month, status) => {
    try {
      const endpoint = `${url}${FilterTransaction}?month=${month}&status=${status}`;
      const response = await axios.get(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
     
      if (response.status === 200 || response.status === 201 || response.status === 204) {
        return {
          status: response.status,
          data: response.data.data,
          message: response.data.message
        };
      } else if (response.status === 401) {
        return {
          status: response.status,
          data: null,
          message: response.data.message
        };
      } else {
        return {
          status: response.status,
          data: null,
          message: response.data.message
        };
      }
    } catch (err) {
      return {
        status: err.status,
        data: null,
        message: err.response.data.message || "Network error, try after sometime"
      };
    }
  };
  export const DeleteTransactionAPI = async (url, token,transactionID) => {
    try {
      const endpoint = `${url}${FilterTransaction}/${transactionID}`;
      const response = await axios.get(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 200 || response.status === 201 || response.status === 204) {
        return {
          status: response.status,
          data: response.data.data,
          message: response.data.message
        };
      } else if (response.status === 401) {
        return {
          status: response.status,
          data: null,
          message: response.data.message
        };
      } else {
        return {
          status: response.status,
          data: null,
          message: response.data.message
        };
      }
    } catch (err) {
      return {
        status: err.status,
        data: null,
        message: err.response.data.message || "Network error, try after sometime"
      };
    }
  };

  export const AddOtherExpenseAPI = async (url, transactionData, token) => {
    try {
      const endpoint = `${url}${AddOtherExpense}`;
      const response = await axios.post(endpoint, transactionData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 200 || response.status === 201) {
        return {
          status: response.status,
          data: response.data,
          message: response.data.message
        };
      } else if (response.status === 401) {
        return {
          status: response.status,
          data: null,
          message: response.data.message
        };
      } else {
        return {
          status: response.status,
          data: null,
          message: response.data.message
        };
      }
    } catch (err) {
      return {
        status: err.status,
        data: null,
        message: err.response.data.message || "Network error, try after sometime"
      };
    }
  };

  export const GetOtherExpenseAPI = async (url) => {
    try {
      const endpoint = `${url}${GetOtherExpense}`;
      const response = await axios.get(endpoint);
      if (response.status === 200 || response.status === 201 ||response.status === 204 ) {
        return {
          status: response.status,
          data: response.data.data,
          message: response.data.message
        };
      } else if (response.status === 401) {
        return {
          status: response.status,
          data: null,
          message: response.data.message
        };
      } else {
        return {
          status: response.status,
          data: null,
          message: response.data.message
        };
      }
    } catch (err) {
      return {
        status: err.status,
        data: null,
        message: err.response.data.message || "Network error, try after sometime"
      };
    }
  };

  export const DeleteOtherExpenseByIDAPI = async (url, expenseID,token) => {
    try {
      const endpoint = `${url}${DeleteOtherExpenseByID}/${expenseID}`;
      const response = await axios.delete(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 200 || response.status === 201 || response.status === 204) {
        return {
          status: response.status,
          data: response.data.data,
          message: response.data.message
        };
      } else if (response.status === 401) {
        return {
          status: response.status,
          data: null,
          message: response.data.message
        };
      } else {
        return {
          status: response.status,
          data: null,
          message: response.data.message
        };
      }
    } catch (err) {
      return {
        status: err.status,
        data: null,
        message: err.response.data.message || "Network error, try after sometime"
      };
    }
  };

  export const AddStudentTransactionAPI = async (url, transactionData, token) => {
    try {
      const endpoint = `${url}${AddStudentTransaction}`;
      const response = await axios.post(endpoint, transactionData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 200 || response.status === 201) {
        return {
          status: response.status,
          data: response.data,
          message: response.data.message
        };
      } else if (response.status === 401) {
        return {
          status: response.status,
          data: null,
          message: response.data.message
        };
      } else {
        return {
          status: response.status,
          data: null,
          message: response.data.message
        };
      }
    } catch (err) {
      return {
        status: err.status,
        data: null,
        message: err.response.data.message || "Network error, try after sometime"
      };
    }
  };
  export const ImposeFineAPI = async (url,payload, token) => {
    console.log(payload)
    try {
      const endpoint = `${url}${ImposeFine}`;
      const response = await axios.post(endpoint, payload, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 200 || response.status === 201 || response.status === 204) {  
        return {
          status: response.status,
          data: response.data,
          message: response.data.message
        };
      } else if (response.status === 401) {
        return {
          status: response.status,
          data: null,
          message: response.data.message
        };
      } else {
        return {
          status: response.status,
          data: null,
          message: response.data.message
        };
      }
    } catch (err) {
      console.log(err)
      return {
        status: err.status,
        data: null,
        message: err.response.data.message || "Network error, try after sometime"
      };
    }
  };

  export const GetStudentFeeTransactionAPI = async (url,token,studentID) => {
    try {
      const endpoint = `${url}${GetStudentFeeTransaction}/${studentID}`;
      const response = await axios.get(endpoint,{
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.status === 200 || response.status === 201 ||response.status === 204 ) {
        return {
          status: response.status,
          data: response.data.data,
          message: response.data.message
        };
      } else if (response.status === 401) {
        return {
          status: response.status,
          data: null,
          message: response.data.message
        };
      } else {
        return {
          status: response.status,
          data: null,
          message: response.data.message
        };
      }
    } catch (err) {
      return {
        status: err.status,
        data: null,
        message: err.response.data.message || "Network error, try after sometime"
      };
    }
  };
  export const GetClassFeeTransactionAPI = async (url,token,classID,month) => {
    try {
      const endpoint = `${url}${GetClassFeeTransaction}/${classID}?month=${month}`;
      const response = await axios.get(endpoint,{
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
 
      if (response.status === 200 || response.status === 201 ||response.status === 204 ) {
        return {
          status: response.status,
          data: response.data.data,
          message: response.data.message
        };
      } else if (response.status === 401) {
        return {
          status: response.status,
          data: null,
          message: response.data.message
        };
      } else {
        return {
          status: response.status,
          data: null,
          message: response.data.message
        };
      }
    } catch (err) {
      console.log(err)
      return {
        status: err.status,
        data: null,
        message: err.response.data.message || "Network error, try after sometime"
      };
    }
  };