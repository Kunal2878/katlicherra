import React, { useState, useEffect, useRef } from 'react';
import { Save, FileText, Download, School, Award, User, FileSignature } from 'lucide-react';

import axios from 'axios';
import { pdf,Page, Document, Text,View,Image } from '@react-pdf/renderer';
import * as domToImage from 'dom-to-image';
import { GetAllClass,GetAllClasses } from '../../Route';


const CertificateGenerator = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [certificateName, setCertificateName] = useState('Certificate of Excellence');
  const [certificateDescription, setCertificateDescription] = useState('');
  const [principalName, setPrincipalName] = useState('Dr. Johnson');
  const [teacherName, setTeacherName] = useState('Mrs. Smith');
  const [principalSignature, setPrincipalSignature] = useState(null);
  const [teacherSignature, setTeacherSignature] = useState(null);
  const certificateRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const url = import.meta.env.VITE_API_BASE_URL;
  useEffect(() => {
      document.title = "Generate Certificate";
  }, []);


  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchStudents(selectedClass);
    } else {
      setStudents([]);
    }
  }, [selectedClass]);

  const fetchClasses = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${url}${GetAllClasses}`);
  
      setClasses(response.data.data.classes);
    } catch (error) {
      console.error("Error fetching classes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStudents = async (classId) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://katlicherra-backend-v2.onrender.com/api/v1/student/getstudentbyclassid/${classId}`
      );
      setStudents(response.data.data.students);
      console.log(response.data.data.students)
    } catch (error) {
      console.error("Error fetching students:", error);
      setStudents([]);
    } finally {
      setIsLoading(false);
    }
  };
  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
    setSelectedStudent('');
  };

  const handleStudentChange = (e) => {
    setSelectedStudent(e.target.value);
  };

  const handlePrincipalSignatureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPrincipalSignature(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTeacherSignatureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setTeacherSignature(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };




const generatePDF = async () => {



    if (!certificateRef.current) return;
    
    setIsLoading(true);
    
    try {
      // First, capture the certificate DOM element as an image
      const dataUrl = await domToImage.toPng(certificateRef.current, {
        quality: 1.0,
        width: certificateRef.current.offsetWidth,
        height: certificateRef.current.offsetHeight,
        style: {
        //   transform: 'scale(1)',
          transformOrigin: 'top left'
        }
      });
      console.log(dataUrl)
      // Create a PDF document definition with react-pdf-renderer
      const MyDocument = () => (
        <Document>
          <Page size="A3" orientation="landscape" style={{ position: 'relative' }}>
            <Image src={dataUrl} style={{ width: '100%', height: '100%' }} />
          </Page>
        </Document>
      );
      
      // Generate the PDF blob
      const blob = await pdf(React.createElement(MyDocument)).toBlob();
      
      // Create URL for the blob and open in new window
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');      
      // Clean up
      setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
      setIsLoading(false);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setIsLoading(false);
    }
  };
  const getStudentName = () => {
    if (!selectedStudent) return '';
    const student = students.find(s => s._id === selectedStudent);
    console.log(students)
    return student ? student.name : '';
  };

  const getClassName = () => {
    if (!selectedClass) return '';
    const classObj = classes.find(c => c._id === selectedClass);
    return classObj ? classObj.className : '';
  };4

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-8 bg-white rounded-xl shadow-lg mt-6 p-6">
        <h1 className="text-2xl text-black-300 font-bold mb-6 flex items-center">
          <Award className="mr-2" /> Generate Certificate
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-10">
            <div>
              
              <div className="relative">
                <School className="absolute left-3 top-2.5 text-danger" size={18} />
                <select 
                  className="pl-10 w-full p-2 bg-transparent border-2 border-black-200 text-black-300 focus:outline"
                  value={selectedClass}
                  onChange={handleClassChange}
                >
                  <option value="">Select a class</option>
                  {classes.map(cls => (
                    <option key={cls._id} value={cls._id}>{cls.className}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              
              <div className="relative">
                <User className="absolute left-3 top-2.5 text-danger" size={18} />
                <select 
                  className="pl-10 w-full p-2 bg-transparent border-2 border-black-200 text-black-300 focus:outline"
                  value={selectedStudent}
                  onChange={handleStudentChange}
                  disabled={!selectedClass || isLoading}
                >
                  <option value="">Select a student</option>
                  {students.map(student => (
                    <option key={student._id} value={student._id}>{student.name}</option>
                  ))}
                </select>
              </div>
              {isLoading && <p className="text-sm text-gray-500 mt-1">Loading students...</p>}
            </div>
            
            <div className="relative">
              <input 
                type="text" 
                value={certificateName}
                onChange={(e) => setCertificateName(e.target.value)}
                className="w-full px-4 py-2 bg-transparent border-2 border-black-200 text-black-300 focus:outline rounded-md transition-all peer placeholder-transparent"
                placeholder="Certificate Name"
                id="certificateName"
              />
              <label 
                htmlFor="certificateName"
                className="absolute left-2 -top-6 text-sm flex items-center gap-2 font-medium text-black transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-focus:-top-6 peer-focus:text-sm"
              >
                <span className="text-danger">
                  <Award size={20} />
                </span>
                Certificate Name
              </label>
            </div>
            
            <div className="relative">
              <textarea 
                value={certificateDescription}
                onChange={(e) => setCertificateDescription(e.target.value)}
                className="w-full px-4 py-2 bg-transparent border-2 border-black-200 text-black-300 focus:outline rounded-md transition-all peer placeholder-transparent"
                placeholder="Certificate Description"
                rows={3}
                id="certificateDescription"
              />
              <label 
                htmlFor="certificateDescription"
                className="absolute left-2 -top-6 text-sm flex items-center gap-2 font-medium text-black transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-focus:-top-6 peer-focus:text-sm"
              >
                <span className="text-danger">
                  <FileText size={20} />
                </span>
                Certificate Description
              </label>
            </div>
          </div>
          
          <div className="space-y-10">
            <div className="relative">
              <input 
                type="text" 
                value={principalName}
                onChange={(e) => setPrincipalName(e.target.value)}
                className="w-full px-4 py-2 bg-transparent border-2 border-black-200 text-black-300 focus:outline rounded-md transition-all peer placeholder-transparent"
                placeholder="Principal Name"
                id="principalName"
              />
              <label 
                htmlFor="principalName"
                className="absolute left-2 -top-6 text-sm flex items-center gap-2 font-medium text-black transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-focus:-top-6 peer-focus:text-sm"
              >
                <span className="text-danger">
                  <User size={20} />
                </span>
                Principal Name
              </label>
            </div>
            
            {/* <div className="relative">
              <input 
                type="file" 
                onChange={handlePrincipalSignatureChange}
                className="w-full px-4 py-2 bg-transparent border-2 border-black-200 text-black-300 focus:outline rounded-md transition-all peer placeholder-transparent file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                accept="image/*"
                id="principalSignature"
              />
              <label 
                htmlFor="principalSignature"
                className="absolute left-2 -top-6 text-sm flex items-center gap-2 font-medium text-black transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-focus:-top-6 peer-focus:text-sm"
              >
                <span className="text-danger">
                  <FileSignature size={20} />
                </span>
                Principal Signature (optional)
              </label>
            </div> */}
            
            <div className="relative">
              <input 
                type="text" 
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                className="w-full px-4 py-2 bg-transparent border-2 border-black-200 text-black-300 focus:outline rounded-md transition-all peer placeholder-transparent"
                placeholder="Teacher Name"
                id="teacherName"
              />
              <label 
                htmlFor="teacherName"
                className="absolute left-2 -top-6 text-sm flex items-center gap-2 font-medium text-black transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-focus:-top-6 peer-focus:text-sm"
              >
                <span className="text-danger">
                  <User size={20} />
                </span>
                Teacher Name
              </label>
            </div>
            
            {/* <div className="relative">
              <input 
                type="file" 
                onChange={handleTeacherSignatureChange}
                className="w-full px-4 py-2 bg-transparent border-2 border-black-200 text-black-300 focus:outline rounded-md transition-all peer placeholder-transparent file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                accept="image/*"
                id="teacherSignature"
              />
              <label 
                htmlFor="teacherSignature"
                className="absolute left-2 -top-6 text-sm flex items-center gap-2 font-medium text-black transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-focus:-top-6 peer-focus:text-sm"
              >
                <span className="text-danger">
                  <FileSignature size={20} />
                </span>
                Teacher Signature (optional)
              </label>
            </div> */}
            
            <button
              onClick={generatePDF}
              disabled={!selectedStudent || isLoading}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? 'Generating...' : (
                <>
                  <Download className="mr-2" size={18} />
                  Download Certificate
                </>
              )}
            </button>
          </div>
        </div>
      </div>      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Certificate Preview</h2>
        <div className="border rounded-md p-4 bg-gray-50 flex justify-center">
          <div 
            ref={certificateRef} 
            className="relative w-full max-w-3xl aspect-[1.4/1] bg-white text-black"
            style={{
              backgroundImage: "url('/certificate2.png')",              
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              fontFamily: "'Dancing Script', cursive"
            }}
          >
            {/* Certificate Title */}
            <div className="absolute w-full text-center text-black" style={{ top: '25%' }}>
              <h2 className="text-xl md:text-3xl font-bold text-black" style={{ fontFamily: "'Pinyon Script', cursive" }}>{certificateName}</h2>
            </div>
            
            {/* Student Name */}
            <div className="absolute w-full text-center text-black" style={{ top: '35%' }}>
              <p className="text-lg md:text-2xl text-black" style={{ fontFamily: "'Dancing Script', cursive" }}>This certificate is proudly presented to</p>
              <p className="text-xl md:text-3xl font-bold mt-4 text-black" style={{ fontFamily: "'Great Vibes', cursive" }}>{getStudentName()}</p>
            </div>
            
            {/* Class Name and Description */}
            <div className="absolute w-full text-center px-8 md:px-16 text-black" style={{ top: '55%' }}>
              <p className="text-xs md:text-md italic text-black" style={{ fontFamily: "'Dancing Script', cursive" }}>
                <span className="font-semibold text-black">of {getClassName()}</span>
                {certificateDescription ? ` — ${certificateDescription}` : 
                ' — For demonstrating outstanding academic excellence and exceptional dedication to learning. Your consistent hard work, intellectual curiosity, and commitment to personal growth have set you apart as a model student.'}
              </p>
            </div>
            
            {/* Signatures */}
            <div className="absolute w-full flex justify-between px-16 md:px-32 text-black" style={{ bottom: '10%' }}>
              <div className="text-center">
                {principalSignature ? (
                  <img src={principalSignature} alt="Principal Signature" className="h-8 md:h-12 mx-auto mb-1" />
                ) : (
                  <div className="h-8 md:h-12 flex items-end justify-center">
                    <FileSignature size={24} className="md:w-8 md:h-8" />
                  </div>
                )}
                
                <p className="text-center font-semibold mt-1 text-xs md:text-base text-black" style={{ fontFamily: "'Dancing Script', cursive" }}>PRINCIPAL</p>
                <p className="text-xs md:text-sm text-black" style={{ fontFamily: "'Dancing Script', cursive" }}>{principalName}</p>
              </div>
              
              <div className="text-center">
                {teacherSignature ? (
                  <img src={teacherSignature} alt="Teacher Signature" className="h-8 md:h-12 mx-auto mb-1" />
                ) : (
                  <div className="h-8 md:h-12 flex items-end justify-center">
                    <FileSignature size={24} className="md:w-8 md:h-8" />
                  </div>
                )}
                
                <p className="text-center font-semibold mt-1 text-xs md:text-base text-black" style={{ fontFamily: "'Dancing Script', cursive" }}>CLASS TEACHER</p>
                <p className="text-xs md:text-sm text-black" style={{ fontFamily: "'Dancing Script', cursive" }}>{teacherName}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateGenerator;