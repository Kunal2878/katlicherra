// import { useState, useEffect } from 'react'
// import { useForm } from 'react-hook-form'
// import Cookies from "js-cookie"
// import {  ChevronDown, Check, School, BookOpen, User, FileText } from 'lucide-react'
// import {setClassData,setIsLeaderBoardUpdate} from '../../../Store/slice'
// import {GetStudentByClassAPI,GetSubjectByClassAPI,GetExamsAPI,AddMarkStudentAPI,GetAllClassesAPI} from '../../../service/api'
// import {useSelector, useDispatch} from 'react-redux'
// import { toast } from 'react-toastify';

// const AddMark = () => {
//   const [loading, setLoading] = useState(false)
//   const [students, setStudents] = useState([])
//   const [subjects, setSubjects] = useState([])
//   const [exams, setExams] = useState([])
//   const [selectedClass, setSelectedClass] = useState('')
//   const [selectedExam, setSelectedExam] = useState('')
//   const [selectedStudent, setSelectedStudent] = useState('')
//   const [showToast, setShowToast] = useState(false)
//   const [toastMessage, setToastMessage] = useState('')
//   const [toastType, setToastType] = useState('')
//   const classes = useSelector((state) => state.userData.ClassData);
//   const dispatch = useDispatch();

//   // Dropdown states
//   const [isClassDropdownOpen, setIsClassDropdownOpen] = useState(false)
//   const [isStudentDropdownOpen, setIsStudentDropdownOpen] = useState(false)
//   const [isExamDropdownOpen, setIsExamDropdownOpen] = useState(false)
  
//   // Selected display names
//   const [selectedClassName, setSelectedClassName] = useState('')
//   const [selectedStudentName, setSelectedStudentName] = useState('')
//   const [selectedExamName, setSelectedExamName] = useState('')
  
//   // Subject marks
//   const [subjectMarks, setSubjectMarks] = useState([])

//   const { register, handleSubmit, reset, formState: { errors } } = useForm()
//   const url = import.meta.env.VITE_API_BASE_URL
//   const token = Cookies.get('token')

//   useEffect(() => {
//     fetchClasses()
//     fetchExams()
//   }, [])

  // useEffect(() => {
  //   if (selectedClass) {
  //     fetchStudents(selectedClass)
  //     fetchSubjects(selectedClass)
  //   }
  // }, [selectedClass])

//   useEffect(() => {
//     if (subjects?.length > 0) {
//       const initialSubjectMarks = subjects?.map(subject => ({
//         subject: subject._id,
//         subjectName: subject.name,
//         marksObtained: '',
//         maxMarks: ''
//       }))
//       setSubjectMarks(initialSubjectMarks)
//     }
//   }, [subjects])

  // useEffect(() => {
  //   if (showToast) {
  //     toast[toastType](toastMessage, {
  //       position: "top-right",
  //       autoClose: 3000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //     });
  //     setShowToast(false)
  //   }
  // }, [showToast, toastMessage, toastType]);

  // const fetchClasses = async () => {
  //   const response = await GetAllClassesAPI(url);
  //   if (response.status === 200 || response.status === 204 || response.status === 201) {
  //     dispatch(setClassData(response.data.classes));
  //   } else {
  //     setShowToast(true);
  //     setToastMessage(response.message);
  //     setToastType("error");
  //   }
  // }

  // const fetchStudents = async (classId) => {
  //   const response = await GetStudentByClassAPI(url, classId);
  //   if (response.status === 200 || response.status === 201 || response.status === 204) {
  //     setStudents(response.data.students)
  //   } else {
  //     setShowToast(true);
  //     setToastMessage(response.message);
  //     setToastType("error");
  //   }
  // }

  // const fetchSubjects = async (classId) => {
  //   const response = await GetSubjectByClassAPI(url, classId);
  //   if (response.status === 200 || response.status === 201 || response.status === 204) {
  //     setSubjects(response.data)
  //   } else {
  //     setShowToast(true);
  //     setToastMessage(response.message);
  //     setToastType("error");
  //   }
  // }

  // const fetchExams = async () => {
  //   const response = await GetExamsAPI(url);
  //   if (response.status === 200 || response.status === 201 || response.status === 204) {
  //     setExams(response.data.exams)
  //   } else {
  //     setShowToast(true);
  //     setToastMessage(response.message);
  //     setToastType("error");
  //   }
  // }

  // const selectClass = (classItem) => {
  //   setSelectedClass(classItem._id)
  //   setSelectedClassName(classItem.className)
  //   setIsClassDropdownOpen(false)
  // }

  // const selectStudent = (student) => {
  //   setSelectedStudent(student._id)
  //   setSelectedStudentName(student.name)
  //   setIsStudentDropdownOpen(false)
  // }

  // const selectExam = (exam) => {
  //   setSelectedExam(exam._id)
  //   setSelectedExamName(exam.name)
  //   setIsExamDropdownOpen(false)
  // }

  // const handleSubjectMarksChange = (index, field, value) => {
  //   const updatedMarks = [...subjectMarks]
  //   updatedMarks[index][field] = value
  //   setSubjectMarks(updatedMarks)
  // }

  // const validateForm = () => {
  //   if (!selectedClass) {
  //     setShowToast(true);
  //     setToastMessage('Please select a class');
  //     setToastType("error");
  //     return false
  //   }
  //   if (!selectedStudent) {
  //     setShowToast(true);
  //     setToastMessage('Please select a student');
  //     setToastType("error");
  //     return false
  //   }
  //   if (!selectedExam) {
  //     setShowToast(true);
  //     setToastMessage('Please select an exam');
  //     setToastType("error");
  //     return false
  //   }

  //   const hasMarks = subjectMarks.some(
  //     mark => mark.marksObtained !== '' && mark.maxMarks !== ''
  //   )
  //   if (!hasMarks) {
  //     setShowToast(true);
  //     setToastMessage('Please enter marks for at least one subject');
  //     setToastType("error");
  //     return false
  //   }

  //   return true
  // }

  // const onSubmit = async () => {
  //   if (!validateForm()) return

  //   try {
  //     setLoading(true)
      
  //     const validMarks = subjectMarks.filter(
  //       mark => mark.marksObtained !== '' && mark.maxMarks !== ''
  //     )
      
  //     const formattedMarks = validMarks?.map(mark => ({
  //       subject: mark.subject,
  //       marksObtained: parseFloat(mark.marksObtained),
  //       maxMarks: parseFloat(mark.maxMarks)
  //     }))
      
  //     const markData = {
  //       student: selectedStudent,
  //       exam: selectedExam,
  //       studentClass: selectedClass,
  //       marks: formattedMarks
  //     }
  //     const response = await AddMarkStudentAPI(url,markData, token)

  //     if (response.status === 201 || response.status === 200 || response.status === 200) {
  //       setShowToast(true);
  //       setToastMessage(response.message);
  //       setToastType("success");
  //       setSelectedClass('')
  //       setSelectedClassName('')
  //       setSelectedStudent('')
  //       setSelectedStudentName('')
  //       setSelectedExam('')
  //       setSelectedExamName('')
  //       setSubjectMarks([])
  //       dispatch(setIsLeaderBoardUpdate(true))
  //     } else {
  //       setShowToast(true);
  //       setToastMessage(response.message);
  //       setToastType("error");
  //     }
  //   } catch (error) {
  //     setShowToast(true);
  //     setToastMessage(error.response.data.message || 'Failed to add marks');
  //     setToastType("error");
  //   } finally {
  //     setLoading(false)
  //   }
  // }
//   return (
//     <div className="min-h-screen  w-full sm:px-16 px-6 sm:py-16 py-10">
//        <div className="flex flex-col md:flex-row text-black justify-between items-start md:items-center mb-[32px] p-2">
      
      
//               <div className="mb-4 md:mb-0 text-left">
//                 <h2 className="h2 mb-2 text-left">Grades Upload</h2>
//                 <div className="flex items-center subtitle-2 text-left">
//                   <span className="">Exam / </span>
//                   <span>Grades Upload</span>
//                 </div>
//               </div>
  
//             </div>
//       <div className="min-h-full max-w-3xl flex items-center justify-center p-4">
//         <div className="h-full w-full space-y-8 bg-white p-4">
//           <div className="text-left">
//             <h2 className="h2 text-black mt-5 flex flex-col items-start">Upload Stdudent Grades</h2>
//           </div>

//           <div className="mt-[32px] space-y-6 mb-[16px]">
            // {/* Class Selection */}
            // <div className="relative w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto">
            //   <div className="relative bg-transparent border-2 border-black-200 text-black-300 rounded-lg focus:outline">
            //     <button
            //       type="button"
            //       onClick={() => setIsClassDropdownOpen(!isClassDropdownOpen)}
            //       className="w-full flex items-center justify-between px-2 py-1.5 md:py-2 border rounded-lg bg-white text-sm md:text-base"
            //     >
            //       <div className="flex items-center">
            //         <School className="w-4 h-4 md:w-5 md:h-5 mr-2 text-danger" />
            //         <span className="h5 text-black">
            //           {selectedClassName || "Select Class"}
            //         </span>
            //       </div>
            //       <ChevronDown size={24} className="text-black" />
            //     </button>
            //     {isClassDropdownOpen && (
            //       <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
            //         {classes?.map((classItem) => (
            //           <div
            //             key={classItem._id}
            //             onClick={() => selectClass(classItem)}
            //             className="flex items-center px-2 md:px-4 py-1.5 md:py-2 hover:bg-gray-100 cursor-pointer text-black-300 text-sm md:text-base"
            //           >
            //             <div
            //               className={`w-3 h-3 md:w-4 md:h-4 border rounded mr-2 flex items-center justify-center ${
            //                 selectedClass === classItem._id
            //                   ? "bg-purple-500 text-white"
            //                   : "border-gray-300"
            //               }`}
            //             >
            //               {selectedClass === classItem._id && (
            //                 <Check className="w-2 h-2 md:w-3 md:h-3 text-black-300" />
            //               )}
            //             </div>
            //             {classItem.className}
            //           </div>
            //         ))}
            //       </div>
            //     )}
            //   </div>
            // </div>

            // {/* Student Selection */}
            // <div className="relative w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto">
            //   <div className="relative bg-transparent border-2 border-black-200 text-black-300 rounded-lg focus:outline">
            //     <button
            //       type="button"
                  // onClick={() => setIsStudentDropdownOpen(!isStudentDropdownOpen)}
                  // disabled={!selectedClass}
            //       className={`w-full flex items-center justify-between px-2 py-1.5 md:py-2 border rounded-lg bg-white text-sm md:text-base ${!selectedClass ? 'opacity-70 cursor-not-allowed' : ''}`}
            //     >
            //       <div className="flex items-center">
            //         <User className="w-4 h-4 md:w-5 md:h-5 mr-2 text-danger" />
            //         <span className="h5 text-black">
            //           {selectedStudentName || "Select Student"}
            //         </span>
            //       </div>
            //       <ChevronDown size={24} className="text-black" />
            //     </button>
            //     {isStudentDropdownOpen && (
            //       <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
            //         {students?.map((student) => (
            //           <div
            //             key={student._id}
            //             onClick={() => selectStudent(student)}
            //             className="flex items-center px-2 md:px-4 py-1.5 md:py-2 hover:bg-gray-100 cursor-pointer text-black-300 text-sm md:text-base"
            //           >
            //             <div
            //               className={`w-3 h-3 md:w-4 md:h-4 border rounded mr-2 flex items-center justify-center ${
            //                 selectedStudent === student._id
            //                   ? "bg-purple-500 text-white"
            //                   : "border-gray-300"
            //               }`}
            //             >
            //               {selectedStudent === student._id && (
            //                 <Check className="w-2 h-2 md:w-3 md:h-3 text-black-300" />
            //               )}
            //             </div>
            //             {student.name}
            //           </div>
            //         ))}
            //       </div>
            //     )}
            //   </div>
            // </div>

            // {/* Exam Selection */}
            // <div className="relative w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto">
            //   <div className="relative bg-transparent border-2 border-black-200 text-black-300 :focus-outline rounded-lg focus:outline">
            //     <button
            //       type="button"
            //       onClick={() => setIsExamDropdownOpen(!isExamDropdownOpen)}
            //       className="w-full flex items-center justify-between px-2 py-1.5 md:py-2 border rounded-lg bg-white text-sm md:text-base"
            //     >
            //       <div className="flex items-center">
            //         <FileText className="w-4 h-4 md:w-5 md:h-5 mr-2 text-danger" />
            //         <span className="h5 text-black">
            //           {selectedExamName || "Select Exam"}
            //         </span>
            //       </div>
            //       <ChevronDown size={24} className="text-black" />
            //     </button>
            //     {isExamDropdownOpen && (
            //       <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
            //         {exams?.map((exam) => (
            //           <div
            //             key={exam._id}
            //             onClick={() => selectExam(exam)}
            //             className="flex items-center px-2 md:px-4 py-1.5 md:py-2 hover:bg-gray-100 cursor-pointer text-black-300 text-sm md:text-base"
            //           >
            //             <div
            //               className={`w-3 h-3 md:w-4 md:h-4 border rounded mr-2 flex items-center justify-center ${
            //                 selectedExam === exam._id
            //                   ? "bg-purple-500 text-white"
            //                   : "border-gray-300"
            //               }`}
            //             >
            //               {selectedExam === exam._id && (
            //                 <Check className="w-2 h-2 md:w-3 md:h-3 text-black-300" />
            //               )}
            //             </div>
            //             {exam.name}
            //           </div>
            //         ))}
            //       </div>
            //     )}
            //   </div>
            // </div>

//             {/* Subject Marks */}
//             {selectedClass && subjects?.length > 0 && (
//               <div className="w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto mt-6 custom-scrollbar">
//                 <span className=" h5  px-2 md:px-3 text-sm md:text-base font-medium text-black-300  mb-4 flex items-center">
//                   <BookOpen className="w-5 h-5 mr-2 text-danger" />
//                  Add Subject Marks
//                 </span>
                
//                 <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
//                   {subjectMarks?.map((subjectMark, index) => (
//                     <div key={subjectMark.subject} className=" text-black-300  p-4 rounded-lg border border-black-200">
//                       <div className="font-medium text-base mb-3">{subjectMark.subjectName}</div>
//                       <div className="grid grid-cols-2 gap-4">
//                         <div>
//                           <label className="block text-sm text-black-300 mb-1">Marks Obtained</label>
//                           <input
//                             type="number"
//                             value={subjectMark.marksObtained}
//                             onChange={(e) => handleSubjectMarksChange(index, 'marksObtained', e.target.value)}
//                             className="w-full px-3 py-2 bg-transparent border-2 border-black-200 text-black-300 focus:outline rounded-md "
//                             step="0.1"
//                             min="0"
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-sm text-black-300 mb-1">Max Marks</label>
//                           <input
//                             type="number"
//                             value={subjectMark.maxMarks}
//                             onChange={(e) => handleSubjectMarksChange(index, 'maxMarks', e.target.value)}
//                             className="w-full px-3 py-2  bg-transparent border-2 border-black-200 text-black-300 focus:outline rounded-md "
//                             step="0.1"
//                             min="0"
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             <div className="w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto mt-8">
//               <button
//                 type="button"
//                 onClick={onSubmit}
//                 disabled={loading}
//                 className="w-full flex items-center justify-center py-3 px-4 rounded-lg bg-success-500 text-white focus:outline-none hover:scale-105 transition duration-200"
//               >
//                 {loading ? (
//                   <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                 ) : (
//                   <>
//                     Add Marks
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default AddMark

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Cookies from "js-cookie"
import { 
  ChevronDown, 
  Check, 
  School, 
  BookOpen, 
  User, 
  FileText, 
  ChevronLeft, 
  ChevronRight ,GraduationCap ,Trophy 
} from 'lucide-react'
import { setClassData, setIsLeaderBoardUpdate } from '../../../Store/slice'
import { 
  GetStudentByClassAPI, 
  GetSubjectByClassAPI, 
  GetExamsAPI, 
  AddMarkStudentAPI, 
  GetAllClassesAPI 
} from '../../../service/api'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'

const AddMark = () => {
  // Loading and error states
  const [loading, setLoading] = useState(false)
  const [students, setStudents] = useState([])
  const [subjects, setSubjects] = useState([])
  const [exams, setExams] = useState([])

  // Selection states
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedExam, setSelectedExam] = useState('')
  const [selectedStudent, setSelectedStudent] = useState('')

  // Dropdown visibility states
  const [isClassDropdownOpen, setIsClassDropdownOpen] = useState(false)
  const [isStudentDropdownOpen, setIsStudentDropdownOpen] = useState(false)
  const [isExamDropdownOpen, setIsExamDropdownOpen] = useState(false)

  // Display name states
  const [selectedClassName, setSelectedClassName] = useState('')
  const [selectedStudentName, setSelectedStudentName] = useState('')
  const [selectedExamName, setSelectedExamName] = useState('')

  // Subject marks and navigation
  const [subjectMarks, setSubjectMarks] = useState([])
  const [currentSubjectIndex, setCurrentSubjectIndex] = useState(0)

  // Toast and notification states
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState('')

  // Redux hooks
  const classes = useSelector((state) => state.userData.ClassData)
  const dispatch = useDispatch()

  // Form hook
  const { 
    register, 
    handleSubmit, 
    reset, 
    formState: { errors } 
  } = useForm()

  // Environment and authentication
  const url = import.meta.env.VITE_API_BASE_URL
  const token = Cookies.get('token')

  // Color schemes for subject cards
  const cardColors = [
    { bg: 'bg-gradient-to-br from-purpleColor to-blue-700', border: 'border-blue-200', label: 'text-white' },
    { bg: 'bg-gradient-to-br from-red-400 to-blue-700', border: 'border-green-200', label: 'text-green-700' },
    { bg: 'bg-gradient-to-br from-cyan-500 to-blue-700', border: 'border-purple-200', label: 'text-purple-700' },
  ]

  // Fetch initial data
  useEffect(() => {
    const initializeFetch = async () => {
      await fetchClasses()
      await fetchExams()
    }
    initializeFetch()
  }, [])

  // Fetch students and subjects when class is selected
  useEffect(() => {
    if (selectedClass) {
      const fetchClassData = async () => {
        await fetchStudents(selectedClass)
        await fetchSubjects(selectedClass)
      }
      fetchClassData()
    }
  }, [selectedClass])

  // Initialize subject marks when subjects are loaded
  useEffect(() => {
    if (subjects?.length > 0) {
      const initialSubjectMarks = subjects.map(subject => ({
        subject: subject._id,
        subjectName: subject.name,
        marksObtained: '',
        maxMarks: '100'
      }))
      setSubjectMarks(initialSubjectMarks)
    }
  }, [subjects])

  // Toast notification effect
  useEffect(() => {
    if (showToast) {
      toast[toastType](toastMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
      setShowToast(false)
    }
  }, [showToast, toastMessage, toastType])

  // Fetch methods
  const fetchClasses = async () => {
    try {
      const response = await GetAllClassesAPI(url)
      if (response.status === 200 || response.status === 204 || response.status === 201) {
        dispatch(setClassData(response.data.classes))
      } else {
        setShowToast(true)
        setToastMessage(response.message || 'Failed to fetch classes')
        setToastType("error")
      }
    } catch (error) {
      setShowToast(true)
      setToastMessage('Error fetching classes')
      setToastType("error")
    }
  }

  const fetchStudents = async (classId) => {
    setStudents([])
    try {
      const response = await GetStudentByClassAPI(url, classId)
      if (response.status === 200 || response.status === 201 || response.status === 204) {
        setStudents(response.data.students)
      } else {
        setShowToast(true)
        setToastMessage(response.message || 'Failed to fetch students')
        setToastType("error")
      }
    } catch (error) {
      setShowToast(true)
      setToastMessage('Error fetching students')
      setToastType("error")
    }
  }

  const fetchSubjects = async (classId) => {
    setSubjects([])
    try {
      const response = await GetSubjectByClassAPI(url, classId)
      if (response.status === 200 || response.status === 201 || response.status === 204) {
        setSubjects(response.data)
      } else {
        setShowToast(true)
        setToastMessage(response.message || 'Failed to fetch subjects')
        setToastType("error")
      }
    } catch (error) {
      setShowToast(true)
      setToastMessage('Error fetching subjects')
      setToastType("error")
    }
  }

  const fetchExams = async () => {
    try {
      const response = await GetExamsAPI(url)
      if (response.status === 200 || response.status === 201 || response.status === 204) {
        setExams(response.data.exams)
      } else {
        setShowToast(true)
        setToastMessage(response.message || 'Failed to fetch exams')
        setToastType("error")
      }
    } catch (error) {
      setShowToast(true)
      setToastMessage('Error fetching exams')
      setToastType("error")
    }
  }

  // Selection methods
  const selectClass = (classItem) => {
    setSelectedClass(classItem._id)
    setSelectedClassName(classItem.className)
    setIsClassDropdownOpen(false)
  }

  const selectStudent = (student) => {
    setSelectedStudent(student._id)
    setSelectedStudentName(student.name)
    setIsStudentDropdownOpen(false)
  }

  const selectExam = (exam) => {
    setSelectedExam(exam._id)
    setSelectedExamName(exam.name)
    setIsExamDropdownOpen(false)
  }

  // Marks handling methods
  const handleSubjectMarksChange = (index, field, value) => {
    const updatedMarks = [...subjectMarks]
    updatedMarks[index][field] = value
    setSubjectMarks(updatedMarks)
  }

  const navigateSubject = (direction) => {
    if (direction === 'next' && currentSubjectIndex < subjectMarks.length - 1) {
      setCurrentSubjectIndex(prev => prev + 1)
    } else if (direction === 'prev' && currentSubjectIndex > 0) {
      setCurrentSubjectIndex(prev => prev - 1)
    }
  }

  // Form validation and submission
  const validateForm = () => {
    if (!selectedClass) {
      setShowToast(true)
      setToastMessage('Please select a class')
      setToastType("error")
      return false
    }
    if (!selectedStudent) {
      setShowToast(true)
      setToastMessage('Please select a student')
      setToastType("error")
      return false
    }
    if (!selectedExam) {
      setShowToast(true)
      setToastMessage('Please select an exam')
      setToastType("error")
      return false
    }

    const hasMarks = subjectMarks.some(
      mark => mark.marksObtained !== '' && mark.maxMarks !== ''
    )
    if (!hasMarks) {
      setShowToast(true)
      setToastMessage('Please enter marks for at least one subject')
      setToastType("error")
      return false
    }

    return true
  }

  const onSubmit = async () => {
    if (!validateForm()) return

    try {
      setLoading(true)
      
      const validMarks = subjectMarks.filter(
        mark => mark.marksObtained !== '' && mark.maxMarks !== ''
      )
      
      const formattedMarks = validMarks.map(mark => ({
        subject: mark.subject,
        marksObtained: parseFloat(mark.marksObtained),
        maxMarks: parseFloat(mark.maxMarks)
      }))
      
      const markData = {
        student: selectedStudent,
        exam: selectedExam,
        studentClass: selectedClass,
        marks: formattedMarks
      }

      const response = await AddMarkStudentAPI(url, markData, token)

      if (response.status === 201 || response.status === 200) {
        setShowToast(true)
        setToastMessage(response.message || 'Marks added successfully')
        setToastType("success")

        // Reset form
        setSelectedClass('')
        setSelectedClassName('')
        setSelectedStudent('')
        setSelectedStudentName('')
        setSelectedExam('')
        setSelectedExamName('')
        setSubjectMarks([])
        setCurrentSubjectIndex(0)

        dispatch(setIsLeaderBoardUpdate(true))
      } else {
        setShowToast(true)
        setToastMessage(response.message || 'Failed to add marks')
        setToastType("error")
      }
    } catch (error) {
      setShowToast(true)
      setToastMessage(error.response?.data?.message || 'Failed to add marks')
      setToastType("error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full sm:px-16 px-6 sm:py-16 py-10">
      <div className="flex flex-col md:flex-row text-black justify-between items-start md:items-center mb-[32px] p-2">
        <div className="mb-4 md:mb-0 text-left">
          <h2 className="h2 mb-2 text-left">Grades Upload</h2>
          <div className="flex items-center subtitle-2 text-left">
            <span className="">Exam / </span>
            <span>Grades Upload</span>
          </div>
        </div>
      </div>

      <div className="min-h-full max-w-3xl flex items-center justify-center p-4">
        <div className="h-full w-full space-y-8 bg-white p-4">
          <div className="text-left">
            <h2 className="h2 text-black mt-5 flex flex-col items-start">Upload Student Grades</h2>
          </div>

          <div className="mt-[32px] space-y-6 mb-[16px]">
            {/* Class Dropdown */}
            <div className="relative w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto">
              <label htmlFor="class-select" className="h5 text-sm md:text-base font-medium text-black-300 text-left">
                Select Class
              </label>              <div className="relative bg-transparent border-2 border-black-200 text-black-300 rounded-lg focus:outline">
                <button
                  id="class-select"
                  type="button"
                  onClick={() => setIsClassDropdownOpen(!isClassDropdownOpen)}
                  className="w-full flex items-center justify-between px-2 py-1.5 md:py-2 border rounded-lg bg-white text-sm md:text-base"
                >
                  <div className="flex items-center">
                    <School className="w-4 h-4 md:w-5 md:h-5 mr-2 text-danger" />
                    <span className="h5 text-black">
                      {selectedClassName || "Select Class"}
                    </span>
                  </div>
                  <ChevronDown size={24} className="text-black" />
                </button>
                {isClassDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {classes?.map((classItem) => (
                      <div
                        key={classItem._id}
                        onClick={() => selectClass(classItem)}
                        className="flex items-center px-2 md:px-4 py-1.5 md:py-2 hover:bg-gray-100 cursor-pointer text-black-300 text-sm md:text-base"
                      >
                        <div
                          className={`w-3 h-3 md:w-4 md:h-4 border rounded mr-2 flex items-center justify-center ${
                            selectedClass === classItem._id
                              ? "bg-purple-500 text-white"
                              : "border-gray-300"
                          }`}
                        >
                          {selectedClass === classItem._id && (
                            <Check className="w-2 h-2 md:w-3 md:h-3 text-black-300" />
                          )}
                        </div>
                        {classItem.className}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Student Dropdown */}
            <div className="relative w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto">
              <label htmlFor="student-select" className="h5 text-sm md:text-base font-medium text-black-300">
                Select Student
              </label>
              <div className="relative bg-transparent border-2 border-black-200 text-black-300 rounded-lg focus:outline">
                <button
                  id="student-select"
                  type="button"
                  onClick={() => setIsStudentDropdownOpen(!isStudentDropdownOpen)}
                  disabled={!selectedClass}
                  className={`w-full flex items-center justify-between px-2 py-1.5 md:py-2 border rounded-lg bg-white text-sm md:text-base ${!selectedClass ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center">
                    <User className="w-4 h-4 md:w-5 md:h-5 mr-2 text-danger" />
                    <span className="h5 text-black">
                      {selectedStudentName || "Select Student"}
                    </span>
                  </div>
                  <ChevronDown size={24} className="text-black" />
                </button>
                {isStudentDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {students?.map((student) => (
                      <div
                        key={student._id}
                        onClick={() => selectStudent(student)}
                        className="flex items-center px-2 md:px-4 py-1.5 md:py-2 hover:bg-gray-100 cursor-pointer text-black-300 text-sm md:text-base"
                      >
                        <div
                          className={`w-3 h-3 md:w-4 md:h-4 border rounded mr-2 flex items-center justify-center ${
                            selectedStudent === student._id
                              ? "bg-purple-500 text-white"
                              : "border-gray-300"
                          }`}
                        >
                          {selectedStudent === student._id && (
                            <Check className="w-2 h-2 md:w-3 md:h-3 text-black-300" />
                          )}
                        </div>
                        {student.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Exam Dropdown */}
            <div className="relative w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto">
              <label htmlFor="exam-select" className="
              h5 text-sm md:text-base font-medium text-black-300">
                Select Exam
              </label>              <div className="relative bg-transparent border-2 border-black-200 text-black-300 rounded-lg focus:outline">
                <button
                  id="exam-select"
                  type="button"
                  onClick={() => setIsExamDropdownOpen(!isExamDropdownOpen)}
                  className="w-full flex items-center justify-between px-2 py-1.5 md:py-2 border rounded-lg bg-white text-sm md:text-base"
                >
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 md:w-5 md:h-5 mr-2 text-danger" />
                    <span className="h5 text-black">
                      {selectedExamName || "Select Exam"}
                    </span>
                  </div>
                  <ChevronDown size={24} className="text-black" />
                </button>
                {isExamDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {exams?.map((exam) => (
                      <div
                        key={exam._id}
                        onClick={() => selectExam(exam)}
                        className="flex items-center px-2 md:px-4 py-1.5 md:py-2 hover:bg-gray-100 cursor-pointer text-black-300 text-sm md:text-base"
                      >
                        <div
                          className={`w-3 h-3 md:w-4 md:h-4 border rounded mr-2 flex items-center justify-center ${
                            selectedExam === exam._id
                              ? "bg-purple-500 text-white"
                              : "border-gray-300"
                          }`}
                        >
                          {selectedExam === exam._id && (
                            <Check className="w-2 h-2 md:w-3 md:h-3 text-black-300" />
                          )}
                        </div>
                        {exam.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Subject Marks */}
            {selectedClass && subjects?.length > 0 && (
              // <div className="w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto mt-6">
              //   <div className="flex items-center justify-between mb-4">
              //     <span className="h5 text-sm md:text-base font-medium text-black-300">
              //       <BookOpen className="w-5 h-5 mr-2 text-danger inline-block" />
              //       Add Subject Marks
              //     </span>
              //     <span className="text-sm text-gray-500">
              //       {currentSubjectIndex + 1} / {subjectMarks.length}
              //     </span>
              //   </div>
                
              //   <div className="relative">
              //     {/* Navigation Arrows */}
              //     {currentSubjectIndex > 0 && (
              //       <button 
              //         onClick={() => navigateSubject('prev')}
              //         className="absolute left-[-40px] top-1/2 transform -translate-y-1/2 z-10 bg-gray-100 rounded-full p-2 hover:bg-gray-200 transition"
              //       >
              //         <ChevronLeft />
              //       </button>
              //     )}
                  
              //     {currentSubjectIndex < subjectMarks.length - 1 && (
              //       <button 
              //         onClick={() => navigateSubject('next')}
              //         className="absolute right-[-40px] top-1/2 transform -translate-y-1/2 z-10 bg-gray-100 rounded-full p-2 hover:bg-gray-200 transition"
              //       >
              //         <ChevronRight />
              //       </button>
              //     )}

              //     {/* Subject Card with Transition */}

              //     {subjectMarks.length > 0 && (
              //       <div 
              //         key={subjectMarks[currentSubjectIndex].subject}
              //         className={`
              //           ${cardColors[currentSubjectIndex % 3].bg} 
              //           ${cardColors[currentSubjectIndex % 3].border}
              //           p-4 rounded-lg border transition-all duration-300 ease-in-out transform
              //         `}
              //       >
              //         <div className={`font-medium text-base mb-3 ${cardColors[currentSubjectIndex % 3].label}`}>
              //           {subjectMarks[currentSubjectIndex].subjectName}
              //         </div>
              //         <div className="grid grid-cols-2 gap-4">
              //           <div>
              //             <label className={`block text-sm mb-1 ${cardColors[currentSubjectIndex % 3].label}`}>
              //               Marks Obtained
              //             </label>
              //             <input
              //               type="number"
              //               value={subjectMarks[currentSubjectIndex].marksObtained}
              //               onChange={(e) => handleSubjectMarksChange(currentSubjectIndex, 'marksObtained', e.target.value)}
              //               className="w-full px-3 py-2 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50"
              //               step="0.1"
              //               min="0"
              //             />
              //           </div>
              //           <div>
              //             <label className={`block text-sm mb-1 ${cardColors[currentSubjectIndex % 3].label}`}>
              //               Max Marks
              //             </label>
              //             <input
              //               type="number"
              //               value={subjectMarks[currentSubjectIndex].maxMarks}
              //               onChange={(e) => handleSubjectMarksChange(currentSubjectIndex, 'maxMarks', e.target.value)}
              //               className="w-full px-3 py-2 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50"
              //               step="0.1"
              //               min="0"
              //             />
              //           </div>
              //         </div>
              //       </div>
              //     )}
              //   </div>
              // </div>
             
             <div className="w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto mt-6">
      <div className="flex items-center justify-between mb-4">
        <span className="h5 text-sm md:text-base font-medium text-black-300">
          <BookOpen className="w-5 h-5 mr-2 text-danger inline-block" />
          Add Subject Marks
        </span>
        <span className="text-sm text-gray-500">
          {currentSubjectIndex + 1} / {subjects.length}
        </span>
      </div>
      
      <div className="relative">
        {/* Previous Navigation Arrow */}
        {currentSubjectIndex > 0 && (
          <button 
            onClick={() => navigateSubject('prev')}
            className="absolute left-[-40px] top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full border-2 p-2 hover:bg-gray-200 transition"
          >
            <ChevronLeft className='text-purpleColor'/>
          </button>
        )}
        
        {/* Next Navigation Arrow */}
        {currentSubjectIndex < subjects.length - 1 && (
          <button 
            onClick={() => navigateSubject('next')}
            className=" text- absolute right-[-40px] top-1/2 transform -translate-y-1/2 z-10 bg-bg-white rounded-full p-2 hover:bg-gray-200 transition"
          >
            <ChevronRight className='text-purpleColor'/>
          </button>
        )}

        {/* Subject Card */}
        <div 
          key={subjects[currentSubjectIndex].subjectName}
          className={`
            ${cardColors[currentSubjectIndex % 2].bg} 
            ${cardColors[currentSubjectIndex % 2].border}
            ${cardColors[currentSubjectIndex % 2].text}
            p-4 rounded-lg border transition-all duration-300 ease-in-out transform 
            hover:scale-105 hover:shadow-lg
          `}
        >
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
             
              <span className="font-medium text-base text-white">
              {subjectMarks[currentSubjectIndex]?.subjectName}
              </span>
            </div>
           
          </div>
          
          <div className="flex flex-col space-y-4">
            <div>
              <label className=" text-sm mb-1 flex items-center">
                <Trophy className="mr-2 w-4 h-4" />
                Marks Obtained
              </label>
              <input
                type="number"
                value={subjects[currentSubjectIndex]?.marksObtained}
                onChange={(e) => handleSubjectMarksChange(currentSubjectIndex, 'marksObtained', e.target.value)}
                className="w-full px-3 py-2 bg-white text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50"
                step="0.1"
                min="0"
                max={subjects[currentSubjectIndex]?.maxMarks}
              />
            </div>
            <div>
              <label className=" text-sm mb-1 flex items-center">
                <Trophy className="mr-2 w-4 h-4" />
                Max Marks
              </label>
              <input
                type="number"
                value={subjects[currentSubjectIndex].maxMarks || 100}
                onChange={(e) => handleSubjectMarksChange(currentSubjectIndex, 'maxMarks', e.target.value)}
                className="w-full px-3 py-2 bg-white text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50"
                step="0.1"
                min="0"
                max='100'
              />
            </div>
          </div>
        </div>
      </div>
    </div>
            )}

            {/* Submit Button */}
            <div className="w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto mt-8">
              <button
                type="button"
                onClick={onSubmit}
                disabled={loading}
                className="w-full flex items-center justify-center py-3 px-4 rounded-lg bg-success-500 text-white focus:outline-none hover:scale-105 transition duration-200"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  "Add Marks"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddMark