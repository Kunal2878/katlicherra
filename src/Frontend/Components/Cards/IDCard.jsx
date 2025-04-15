import React, { useState, useEffect, useRef } from "react";
import { User } from 'lucide-react';
import { Document, Page, Image, pdf, StyleSheet } from '@react-pdf/renderer';
import domToImage from 'dom-to-image';
import { useSelector, useDispatch } from "react-redux";
import { setClassData } from "../../../Store/slice";
import { GetClasses,GetAllClassesAPI, GetStudentByClassAPI, GetStudentByIDAPI } from '../../../service/api';
import Table from "../../Components/Elements/Table";

const IDCardGenerator = () => {
  const classes = useSelector((state) => state.userData.ClassData);
  const [selectedClass, setSelectedClass] = useState("");
  const [students, setStudents] = useState([]);
  const [student, setStudent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [userPhoto, setUserPhoto] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const idCardRef = useRef(null);
  const url = import.meta.env.VITE_API_BASE_URL;
  const dispatch = useDispatch();
  const [paginationData, setPaginationData] = useState({
    currentPage: 1,
    totalItems: 0,
    totalPages: 0
  });

  useEffect(() => {
    document.title = "Generate ID Card";
  }, []);

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchStudents(selectedClass);
    }
  }, [selectedClass]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const fetchClasses = async () => {
    setLoading(true);
    const response = await GetAllClassesAPI(url);
    if (response.status === 200 || response.status === 204 || response.status === 201) {
      dispatch(setClassData(response.data.classes));
      setPaginationData({
        currentPage: 1,
        totalItems: response.data.classes.length,
        totalPages: Math.ceil(response.data.classes.length / 10)
      });
    } else {
      setMessage(response.message);
    }
    setLoading(false);
  };

  const fetchStudents = async (classId) => {
    setLoading(true);
    const response = await GetStudentByClassAPI(url, classId);
    if (response.status === 200 || response.status === 204 || response.status === 201) {
      setStudents(response.data.students);
    } else {
      setMessage(response.message);
      setStudents([]);
    }
    setLoading(false);
  };

  const fetchStudentById = async (studentId) => {
    setLoading(true);
    const response = await GetStudentByIDAPI(url, studentId);
    if (response.status === 200 || response.status === 204 || response.status === 201) {
      setStudent(response.data.student);
    } else {
      setMessage(response.message);
      setStudents([]);
    }
    setLoading(false);
  };

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
  };

  const handleCheckboxChange = (student) => {
    setSelectedStudents((prev) => {
      const isSelected = prev.some((s) => s._id === student._id);
      if (isSelected) {
        return prev.filter((s) => s._id !== student._id);
      } else {
        return [...prev, student];
      }
    });
  };

  const styles = StyleSheet.create({
    page: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    idCard: {
      width: '800px',
      height: '1160px',
      alignSelf: 'center',
    }
  });
  
  const generateIDCard = async (student) => {
    setIsLoading(true);
    try {
      console.log(student._id)
      await fetchStudentById(student._id);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!idCardRef.current) return;
      
      const dataUrl = await domToImage.toPng(idCardRef.current, {
        quality: 1.0,
        width: idCardRef.current.offsetWidth,
        height: idCardRef.current.offsetHeight,
        style: {
          transformOrigin: 'top left'
        }
      });
      
      const MyDocument = () => (
        <Document>
          <Page size="A4" style={styles.page}>
            <Image src={dataUrl} style={styles.idCard} />
          </Page>
        </Document>
      );
      
      const blob = await pdf(React.createElement(MyDocument)).toBlob();
      
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
      
      setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsLoading(false);
    }
  };

 
  // Define columns for the Table component
  const columns = [
    {
      field: 'index',
      headerName: '#',
      renderCell: (row, index) => index + 1
    },
    {
      field: 'email',
      headerName: 'Email',
    },
    {
      field: 'rollNumber',
      headerName: 'Roll Number',
    },
    {
      field: 'name',
      headerName: 'Name',
    }
  ];

  // Custom row render function that includes our checkbox logic
  const customRowRender = (student, index) => (
    <tr
      key={student._id}
      className="border-b hover:bg-gray-50 transition-colors duration-150 animate-fade-in"
    >
      <td className="px-6 py-4">
        <input
          type="checkbox"
          className="w-4 h-4 rounded border-gray-300"
          checked={selectedStudents.some(s => s._id === student._id)}
          onChange={() => handleCheckboxChange(student)}
        />
      </td>
      <td className="px-6 py-4 text-left">{index + 1}</td>
      <td className="px-6 py-4 text-left">{student.email || "-"}</td>
      <td className="px-6 py-4 text-left">{student.rollNumber || "-"}</td>
      <td className="px-6 py-4 text-left">{student.name}</td>
      <td className="px-6 py-4 text-left">
        <button 
          className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors"
          onClick={() => generateIDCard(student)}
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : 'Generate'}
        </button>
      </td>
    </tr>
  );

  return (
    <div className="sm:px-16 px-6 sm:py-16 py-10 min-h-screen">
      <div className="flex flex-col md:flex-row text-black justify-between items-start md:items-center mb-6 p-2">
        <div className="mb-4 md:mb-0">
          <h2 className="h2 text-2xl font-semibold mb-2">Generate ID Card</h2>
          <div className="flex items-center text-sm subtitle-2">
            <span className="mr-2">Students /</span>
            <span>ID Cards</span>
          </div>
        </div>
        <div>
        </div>
      </div>

      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
          {message}
        </div>
      )}

      <div className="bg-white p-4 rounded-lg shadow-lg m-4">
        <div className="max-w-xs">
          <label className="text-left block text-sm font-medium text-gray-700 mb-1">
            Class <span className="text-danger">*</span>
          </label>
          <select
            className="w-full p-2 rounded-lg text-xs outline-none bg-primary-300 text-black-300 border-lamaSkyLight"
            value={selectedClass}
            onChange={handleClassChange}
          >
            <option value="">Select Class</option>
            {classes.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.className} 
              </option>
            ))}
          </select>
        </div>

        {selectedClass && (
          <div className="mt-4">
            <h2 className="text-lg font-medium mb-4">Student List</h2>

            {loading ? (
              <div className="text-center py-4 text-black-200">Loading...</div>
            ) : students.length === 0 ? (
              <div className="px-6 py-4 text-left text-black-200">No students found</div>
            ) : (
              <Table
                columns={columns}
                data={students}
                checkboxSelection={true}
                actions={true}
                customRowRender={customRowRender}
                extraClasses="m-4"
              />
            )}
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">ID Card Preview</h2>
          <div 
          ref={idCardRef}
          className="border rounded-md p-4 bg-gray-50 flex flex-col justify-center items-center gap-8">
            

            <div
            
              className="relative w-full max-w-sm aspect-[9/13] bg-white text-black"
              style={{
                backgroundImage: "url('/IDCard.png')",
                backgroundSize: '100% 100%',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                fontFamily: "'Roboto', sans-serif"
              }}
              >
              {/* Organization Logo */}
              <div className="absolute" style={{ top: '5%', left: '5%' }}>
                {/* Logo will be part of the background image */}
              </div>
              
              {/* Profile Photo */}
              <div className="absolute" style={{ top: '22%', left: '50%', transform: 'translateX(-50%)' }}>
                {userPhoto ? (
                  <img 
                    src={userPhoto} 
                    alt="Profile Photo" 
                    className="rounded-full w-20 h-20 object-cover border-4 border-blue-600" 
                  />
                ) : (
                  <div className="rounded-full w-20 h-20 bg-gray-200 flex items-center justify-center">
                    <User size={32} />
                  </div>
                )}
              </div>
              
              {/* Name and Position */}
              <div className="absolute w-full text-center" style={{ top: '45%' }}>
                <h2 className="text-xl font-bold text-black">{student.name || 'FULL NAME'}</h2>
              </div>
              
              {/* User Details */}
              <div className="absolute w-full px-4" style={{ top: '55%' }}>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">Admission No</span>
                  <span>: {student.admissionNo || '1234567890'}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">Class</span>
                  <span> {student.studentClass?.className || 'eg-1A'}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">Parent</span>
                  <span> {student.parentName || 'Parent'}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium"> Parent Phone No.</span>
                  <span> {student.parentContact || '+123-456-7890'}</span>
                </div>
              </div>
              
              {/* Footer Elements */}
              <div className="absolute w-full bottom-20 right-0 flex flex-row justify-end">
                <span className="right-0 mr-8 font-bold"> Sign. of Principal</span>
              </div>


              </div>
        



              <div>

              
              </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default IDCardGenerator;