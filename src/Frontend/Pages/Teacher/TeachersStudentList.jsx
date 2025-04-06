import React, { useState, useEffect } from "react";
import {

  Loader,
  GraduationCap

} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { setStudentByClassData, setCurrentPage } from "../../../Store/slice";
import {GetStudentByClassAPI } from '../../../service/api';
import Table from "../../Components/Elements/Table";


  const TeachersStudentDetails = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const students = useSelector((state) => state.userData.StudentByClassData);
  const user=useSelector((state) => state.userData.user);
  const url = import.meta.env.VITE_API_BASE_URL;
  const dispatch = useDispatch();


  useEffect(() => {
    document.title = "Student Details";
    dispatch(setCurrentPage(1));
  }, []);

  useEffect(() => {
 const fetchStudents = async () => {
    setLoading(true)
    const response = await GetStudentByClassAPI(url, user?.classTeacher);
    if (response.status === 200 || response.status === 201 || response.status === 204) {
      dispatch(setStudentByClassData((response.data.students)))
       
    } else {
   setError("No Student Data Available")
    }
    setLoading(false)
  }
if(user?.classTeacher){
    
    fetchStudents();
}

  }, []);

console.log(students)


  // Table columns definition
  const columns = [
    {
      field: 'name',
      headerName: "Student's Name",
      renderCell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-lamaPurpleLight rounded-full overflow-hidden flex flex-row justify-center items-center">
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
    // {
    //   field: 'studentClass',
    //   headerName: 'Class',
    //   renderCell: (row) => row.studentClass?.className || "-",
    // },
    {
      field: 'parentName',
      headerName: 'Parent Name',
    },
    {
      field: 'parentContact',
      headerName: 'Parent Contact',
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

  if (!user?.classTeacher || error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-2xl text-black-200">
        {error}
      </div>
    );
  }

  return (
    <div className="sm:px-16 px-6 sm:py-16 py-10 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row text-black justify-between items-start md:items-center mb-[32px] p-2">
        <div className="mb-4 md:mb-0">
          <h2 className="h2 mb-2">Student List</h2>
          <div className="flex items-center subtitle-2">
            <span className="">Students Details / </span>
            <span>Student List</span>
          </div>
        </div>

      </div>
      <div className="bg-white p-2 rounded-md shadow-lg">
        {/* Table Component */}
        < Table
          columns={columns}
          data={students || []}
          checkboxSelection={false}
          actions={false}
          extraClasses="m-4"
        />
      
      </div>

     
    </div>
  );
};

// Add custom animation class
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

export default TeachersStudentDetails;