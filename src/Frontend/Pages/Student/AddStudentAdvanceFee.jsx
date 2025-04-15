// import { useState, useEffect } from 'react'
// import { useForm } from 'react-hook-form'
// import Cookies from "js-cookie"
// import { ChevronDown, Check, School, BookOpen, User, FileText, Calendar, IndianRupee } from 'lucide-react'
// import { setClassData } from '../../../Store/slice'
// import { GetAllClassesAPI, GetStudentByClassAPI, AddStudentTransactionAPI } from '../../../service/api'
// import { useSelector, useDispatch } from 'react-redux'
// import Input from "../../Components/Elements/Input"
// import { toast } from 'react-toastify'

// const AddStudentAdvanceFees = () => {
//   const [loading, setLoading] = useState(false)
//   const [students, setStudents] = useState([])
//   const [selectedClass, setSelectedClass] = useState('')
//   const [selectedStudent, setSelectedStudent] = useState('')
//   const [selectedMonths, setSelectedMonths] = useState([])
//   const [selectedStatus, setSelectedStatus] = useState('')
//   const [showToast, setShowToast] = useState(false)
//   const [toastMessage, setToastMessage] = useState('')
//   const [toastType, setToastType] = useState('')
//   const [classFee, setClassFee] = useState()
//   const [lateFine, setLateFine] = useState()
//   const classes = useSelector((state) => state.userData.ClassData)
//   const dispatch = useDispatch()

//   // Dropdown states
//   const [isClassDropdownOpen, setIsClassDropdownOpen] = useState(false)
//   const [isStudentDropdownOpen, setIsStudentDropdownOpen] = useState(false)
//   const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false)
//   const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false)
  
//   // Selected display names
//   const [selectedClassName, setSelectedClassName] = useState('')
//   const [selectedStudentName, setSelectedStudentName] = useState('')
//   const [selectedStatusName, setSelectedStatusName] = useState('')

//   // Months array
//   const months = [
//     "January", "February", "March", "April", "May", "June", 
//     "July", "August", "September", "October", "November", "December"
//   ]

//   // Status options
//   const statusOptions = ["paid", "not paid"]

//   const { register, handleSubmit, reset, watch, formState: { errors } } = useForm()
//   const url = import.meta.env.VITE_API_BASE_URL
//   const token = Cookies.get('token')
//   const lateFineChecked = watch("lateFine")
//   const isAdvancePaymentChecked = watch("isAdvancePayment")

//   // Get current date for max date validation
//   const today = new Date()
//   const formattedDate = today.toISOString().split('T')[0]

//   useEffect(() => {
//     if (showToast) {
//       toast[toastType](toastMessage, {
//         position: "top-right",
//         autoClose: 3000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//       })
//     }
//   }, [showToast, toastMessage, toastType])

//   useEffect(() => {
//     fetchClasses()
//   }, [])

//   useEffect(() => {
//     if (selectedClass) {
//       fetchStudents(selectedClass)
//     }
//   }, [selectedClass])

//   const fetchClasses = async () => {
//     const response = await GetAllClassesAPI(url)
//     if (response.status === 200 || response.status === 204 || response.status === 201) {
//       dispatch(setClassData(response.data.classes))
      
//     } else {
//       dispatch(setClassData([]))
//       setToastMessage(response.message)
//       setToastType("error")
//       setShowToast(true)
//     }
//   }

//   const fetchStudents = async (classId) => {
//     const response = await GetStudentByClassAPI(url, classId)
//     if (response.status === 200 || response.status === 201 || response.status === 204) {
//       setStudents(response.data.students)
//     } else {
//       setStudents([])
//       setToastMessage(response.message)
//       setToastType("error")
//       setShowToast(true)
//     }
//   }

//   const selectClass = (classItem) => {
//     setLateFine(classItem?.lateFineAmount)
//     setClassFee(classItem?.fee)
//     setSelectedClass(classItem._id)
//     setSelectedClassName(classItem.className)
//     setIsClassDropdownOpen(false)
//   }

//   const selectStudent = (student) => {
//     setSelectedStudent(student._id)
//     setSelectedStudentName(student.name)
//     setIsStudentDropdownOpen(false)
//   }

//   const toggleMonth = (month) => {
//     setSelectedMonths(prevMonths => {
//       if (prevMonths.includes(month)) {
//         return prevMonths.filter(m => m !== month)
//       } else {
//         return [...prevMonths, month]
//       }
//     })
//   }

//   const selectStatus = (status) => {
//     setSelectedStatus(status)
//     setSelectedStatusName(status)
//     setIsStatusDropdownOpen(false)
//   }

//   const validateForm = () => {
//     if (!selectedClass) {
//       setToastMessage('Please select a class')
//       setToastType("error")
//       setShowToast(true)
//       return false
//     }
//     if (!selectedStudent) {
//       setToastMessage('Please select a student')
//       setToastType("error")
//       setShowToast(true)
//       return false
//     }
//     if (selectedMonths.length === 0) {
//       setToastMessage('Please select at least one month')
//       setToastType("error")
//       setShowToast(true)
//       return false
//     }
//     if (!selectedStatus) {
//       setToastMessage('Please select a payment status')
//       setToastType("error")
//       setShowToast(true)
//       return false
//     }
//     return true
//   }

//   const onSubmit = async (data) => {
//     if (!validateForm()) return

//     // Validate advance payment date if selected
//     if (new Date(data.paymentDate) > new Date()) {
//       setToastMessage('Advance payment date cannot be in the future')
//       setToastType("error")
//       setShowToast(true)
//       return
//     }

//     setLoading(true)
    
//     const feeData = {
//       student: selectedStudent,
//       months: selectedMonths,
//       status: selectedStatus,
//       baseAmount: data.baseAmount,
//       finePaid: data.paidFine === true,
//       isAdvancePayment: true,
//       paymentDate:  data.paymentDate
//     }
    
//     try {
//       const response = await AddStudentTransactionAPI(url, feeData, token)

//       if (response.status === 201 || response.status === 200 || response.status === 204) {
//         setToastMessage(response.message || 'Fee added successfully!')
//         setToastType("success")
//         setShowToast(true)
        
//         // Reset form
//         reset()
//         setSelectedClass('')
//         setSelectedClassName('')
//         setSelectedStudent('')
//         setSelectedStudentName('')
//         setSelectedMonths([])
//         setSelectedStatus('')
//         setSelectedStatusName('')
//       } else {
//         reset()
//         setToastMessage('Failed to add fee')
//         setToastType("error")
//         setShowToast(true)
      
//         if (response.status === 401) {  
//           Cookies.remove('user')
//           Cookies.remove('token')
//           window.location.href = '/user-options'                      
//         }
//       }
//     } catch (error) {
//       setToastMessage('Error adding fee: ' + (error.message || 'Unknown error'))
//       setToastType("error")
//       setShowToast(true)
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen p-4 w-full">
//       <div className="min-h-full max-w-3xl flex items-center justify-center p-4">
//         <div className="h-full w-full space-y-10 bg-white">
//           <div className="text-left">
//             <h2 className="h2 text-black mt-5 flex flex-col items-start">Add Advance Fee</h2>
//           </div>

//           <form onSubmit={handleSubmit(onSubmit)} className="mt-[32px] space-y-8 mb-[16px]">
//             {/* Class Selection */}
//             <div className="relative w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto">
//               <div className="relative bg-transparent border-2 border-black-200 text-black-300 rounded-lg focus:outline">
//                 <button
//                   type="button"
//                   onClick={() => setIsClassDropdownOpen(!isClassDropdownOpen)}
//                   className="w-full flex items-center justify-between px-2 py-1.5 md:py-2 border rounded-lg bg-white text-sm md:text-base"
//                 >
//                   <div className="flex items-center">
//                     <School className="w-4 h-4 md:w-5 md:h-5 mr-2 text-danger" />
//                     <span className="h5 text-black">
//                       {selectedClassName || "Select Class"}
//                     </span>
//                   </div>
//                   <ChevronDown size={24} className="text-black" />
//                 </button>
//                 {isClassDropdownOpen && (
//                   <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
//                     {classes?.map((classItem) => (
//                       <div
//                         key={classItem._id}
//                         onClick={() => selectClass(classItem)}
//                         className="flex items-center px-2 md:px-4 py-1.5 md:py-2 hover:bg-gray-100 cursor-pointer text-black-300 text-sm md:text-base"
//                       >
//                         <div
//                           className={`w-3 h-3 md:w-4 md:h-4 border rounded mr-2 flex items-center justify-center ${
//                             selectedClass === classItem._id
//                               ? "bg-purple-500 text-white"
//                               : "border-gray-300"
//                           }`}
//                         >
//                           {selectedClass === classItem._id && (
//                             <Check className="w-2 h-2 md:w-3 md:h-3 text-black-300" />
//                           )}
//                         </div>
//                         {classItem.className}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Student Selection */}
//             <div className="relative w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto">
//               <div className="relative bg-transparent border-2 border-black-200 text-black-300 rounded-lg focus:outline">
//                 <button
//                   type="button"
//                   onClick={() => setIsStudentDropdownOpen(!isStudentDropdownOpen)}
//                   disabled={!selectedClass}
//                   className={`w-full flex items-center justify-between px-2 py-1.5 md:py-2 border rounded-lg bg-white text-sm md:text-base ${!selectedClass ? 'opacity-70 cursor-not-allowed' : ''}`}
//                 >
//                   <div className="flex items-center">
//                     <User className="w-4 h-4 md:w-5 md:h-5 mr-2 text-danger" />
//                     <span className="h5 text-black">
//                       {selectedStudentName || "Select Student"}
//                     </span>
//                   </div>
//                   <ChevronDown size={24} className="text-black" />
//                 </button>
//                 {isStudentDropdownOpen && (
//                   <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
//                     {students?.map((student) => (
//                       <div
//                         key={student._id}
//                         onClick={() => selectStudent(student)}
//                         className="flex items-center px-2 md:px-4 py-1.5 md:py-2 hover:bg-gray-100 cursor-pointer text-black-300 text-sm md:text-base"
//                       >
//                         <div
//                           className={`w-3 h-3 md:w-4 md:h-4 border rounded mr-2 flex items-center justify-center ${
//                             selectedStudent === student._id
//                               ? "bg-purple-500 text-white"
//                               : "border-gray-300"
//                           }`}
//                         >
//                           {selectedStudent === student._id && (
//                             <Check className="w-2 h-2 md:w-3 md:h-3 text-black-300" />
//                           )}
//                         </div>
//                         {student.name}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Month Selection - Now with multiple selection */}
//             <div className="relative w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto">
//               <div className="relative bg-transparent border-2 border-black-200 text-black-300 rounded-lg focus:outline">
//                 <button
//                   type="button"
//                   onClick={() => setIsMonthDropdownOpen(!isMonthDropdownOpen)}
//                   disabled={!selectedStudent}
//                   className={`w-full flex items-center justify-between px-2 py-1.5 md:py-2 border rounded-lg bg-white text-sm md:text-base ${!selectedStudent ? 'opacity-70 cursor-not-allowed' : ''}`}
//                 >
//                   <div className="flex items-center w-full">
//                     <Calendar className="w-4 h-4 md:w-5 md:h-5 mr-2 text-danger flex-shrink-0" />
//                     <span className="h5 text-black truncate max-w-[80%]">
//                       {selectedMonths.length > 0 
//                         ? selectedMonths.join(", ")
//                         : "Select Months"
//                       }
//                     </span>
//                   </div>
//                   <ChevronDown size={24} className="text-black" />
//                 </button>
//                 {isMonthDropdownOpen && (
//                   <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
//                     {months.map((month) => (
//                       <div
//                         key={month}
//                         onClick={() => toggleMonth(month)}
//                         className="flex items-center px-2 md:px-4 py-1.5 md:py-2 hover:bg-gray-100 cursor-pointer text-black-300 text-sm md:text-base"
//                       >
//                         <div
//                           className={`w-3 h-3 md:w-4 md:h-4 border rounded mr-2 flex items-center justify-center ${
//                             selectedMonths.includes(month)
//                               ? "bg-purple-500 text-white"
//                               : "border-gray-300"
//                           }`}
//                         >
//                           {selectedMonths.includes(month) && (
//                             <Check className="w-2 h-2 md:w-3 md:h-3 text-black-300" />
//                           )}
//                         </div>
//                         {month}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Status Selection */}
//             <div className="relative w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto">
//               <div className="relative bg-transparent border-2 border-black-200 text-black-300 rounded-lg focus:outline">
//                 <button
//                   type="button"
//                   onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
//                   disabled={selectedMonths.length === 0}
//                   className={`w-full flex items-center justify-between px-2 py-1.5 md:py-2 border rounded-lg bg-white text-sm md:text-base ${selectedMonths.length === 0 ? 'opacity-70 cursor-not-allowed' : ''}`}
//                 >
//                   <div className="flex items-center">
//                     <FileText className="w-4 h-4 md:w-5 md:h-5 mr-2 text-danger" />
//                     <span className="h5 text-black">
//                       {selectedStatusName || "Select Payment Status"}
//                     </span>
//                   </div>
//                   <ChevronDown size={24} className="text-black" />
//                 </button>
//                 {isStatusDropdownOpen && (
//                   <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
//                     {statusOptions.map((status) => (
//                       <div
//                         key={status}
//                         onClick={() => selectStatus(status)}
//                         className="flex items-center px-2 md:px-4 py-1.5 md:py-2 hover:bg-gray-100 cursor-pointer text-black-300 text-sm md:text-base"
//                       >
//                         <div
//                           className={`w-3 h-3 md:w-4 md:h-4 border rounded mr-2 flex items-center justify-center ${
//                             selectedStatus === status
//                               ? "bg-purple-500 text-white"
//                               : "border-gray-300"
//                           }`}
//                         >
//                           {selectedStatus === status && (
//                             <Check className="w-2 h-2 md:w-3 md:h-3 text-black-300" />
//                           )}
//                         </div>
//                         {status.charAt(0).toUpperCase() + status.slice(1)}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Base Amount Input */}
//             <Input
//               id="baseAmount"
//               name="baseAmount"
//               label="Base Amount (eg. Rs.1000)"
//               register={register}
//               errors={errors}
//               icon={IndianRupee}
//               value={classFee}
//               onChange={(e) => setClassFee(e.target.value)}
//             />



//             {/*  Payment Date (conditionally rendered) */}
//               <div className="w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto">
//                 <div className="relative">
//                   <label className="block text-black-300 mb-1" htmlFor="paymentDate">
//                 Payment Date
//                   </label>
//                   <input
//                     type="date"
//                     id="paymentDate"
//                     max={formattedDate}
//                     {...register("paymentDate", {
//                       required: isAdvancePaymentChecked,
//                       validate: value => !isAdvancePaymentChecked || new Date(value) <= new Date() || "Date cannot be in the future"
//                     })}
//                     className="w-full p-2 border-2 border-black-200 bg-transparent text-black-300 rounded-lg focus:outline-none [color-scheme:light]"
//                   />
//                   {errors.paymentDate && (
//                     <p className="text-danger text-sm mt-1">{errors.paymentDate.message}</p>
//                   )}
//                 </div>
//               </div>
        

//             {/* Submit Button */}
//             <div className="w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto mt-8">
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full flex items-center justify-center py-3 px-4 rounded-lg bg-success-500 text-white focus:outline-none hover:scale-105 transition duration-200"
//               >
//                 {loading ? (
//                   <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                 ) : (
//                   <>
//                     Add Fee
//                   </>
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default AddStudentAdvanceFees

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Cookies from "js-cookie"
import { ChevronDown, Check, School, BookOpen, User, FileText, Calendar, IndianRupee } from 'lucide-react'
import { setClassData } from '../../../Store/slice'
import { GetAllClassesAPI, GetStudentByClassAPI, AddStudentTransactionAPI } from '../../../service/api'
import { useSelector, useDispatch } from 'react-redux'
import Input from "../../Components/Elements/Input"
import { toast } from 'react-toastify'

const AddStudentAdvanceFees = () => {
  const [loading, setLoading] = useState(false)
  const [students, setStudents] = useState([])
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedStudent, setSelectedStudent] = useState('')
  const [selectedMonths, setSelectedMonths] = useState([])
  const [selectedStatus, setSelectedStatus] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState('')
  const [classFee, setClassFee] = useState(0)
  const [lateFine, setLateFine] = useState()
  const [calculatedBaseAmount, setCalculatedBaseAmount] = useState(0)
  const classes = useSelector((state) => state.userData.ClassData)
  const dispatch = useDispatch()

  // Dropdown states
  const [isClassDropdownOpen, setIsClassDropdownOpen] = useState(false)
  const [isStudentDropdownOpen, setIsStudentDropdownOpen] = useState(false)
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false)
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false)
  
  // Selected display names
  const [selectedClassName, setSelectedClassName] = useState('')
  const [selectedStudentName, setSelectedStudentName] = useState('')
  const [selectedStatusName, setSelectedStatusName] = useState('')

  // Get current date and future months
  const currentDate = new Date()
  const currentMonthIndex = currentDate.getMonth()
  
  // All months array
  const allMonths = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ]
  
  // Future months array (months after current month)
  const futureMonths = [...allMonths.slice(currentMonthIndex + 1), ...allMonths.slice(0, currentMonthIndex + 1)]

  // Status options
  const statusOptions = ["paid", "not paid"]

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm()
  const url = import.meta.env.VITE_API_BASE_URL
  const token = Cookies.get('token')
  const lateFineChecked = watch("lateFine")
  const isAdvancePaymentChecked = watch("isAdvancePayment")

  // Get current date for max date validation
  const today = new Date()
  const formattedDate = today.toISOString().split('T')[0]

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
    }
  }, [showToast, toastMessage, toastType])

  useEffect(() => {
    fetchClasses()
  }, [])

  useEffect(() => {
    if (selectedClass) {
      fetchStudents(selectedClass)
    }
  }, [selectedClass])

  // Calculate base amount when selectedMonths or classFee changes
  useEffect(() => {
    const totalAmount = selectedMonths.length * (classFee || 0)
    setCalculatedBaseAmount(totalAmount)
    setValue("baseAmount", totalAmount) // Update form value
  }, [selectedMonths, classFee, setValue])

  const fetchClasses = async () => {
    const response = await GetAllClassesAPI(url)
    if (response.status === 200 || response.status === 204 || response.status === 201) {
      dispatch(setClassData(response.data.classes))
      
    } else {
      dispatch(setClassData([]))
      setToastMessage(response.message)
      setToastType("error")
      setShowToast(true)
    }
  }

  const fetchStudents = async (classId) => {
    const response = await GetStudentByClassAPI(url, classId)
    if (response.status === 200 || response.status === 201 || response.status === 204) {
      setStudents(response.data.students)
    } else {
      setStudents([])
      setToastMessage(response.message)
      setToastType("error")
      setShowToast(true)
    }
  }

  const selectClass = (classItem) => {
    setLateFine(classItem?.lateFineAmount)
    setClassFee(classItem?.fee)
    setSelectedClass(classItem._id)
    setSelectedClassName(classItem.className)
    setIsClassDropdownOpen(false)
    
    // Reset selected months when class changes to recalculate base amount
    setSelectedMonths([])
    setCalculatedBaseAmount(0)
    setValue("baseAmount", 0)
  }

  const selectStudent = (student) => {
    setSelectedStudent(student._id)
    setSelectedStudentName(student.name)
    setIsStudentDropdownOpen(false)
  }

  const toggleMonth = (month) => {
    setSelectedMonths(prevMonths => {
      let newSelectedMonths;
      if (prevMonths.includes(month)) {
        newSelectedMonths = prevMonths.filter(m => m !== month);
      } else {
        newSelectedMonths = [...prevMonths, month];
      }
      
      return newSelectedMonths;
    })
  }

  const selectStatus = (status) => {
    setSelectedStatus(status)
    setSelectedStatusName(status)
    setIsStatusDropdownOpen(false)
  }

  const validateForm = () => {
    if (!selectedClass) {
      setToastMessage('Please select a class')
      setToastType("error")
      setShowToast(true)
      return false
    }
    if (!selectedStudent) {
      setToastMessage('Please select a student')
      setToastType("error")
      setShowToast(true)
      return false
    }
    if (selectedMonths.length === 0) {
      setToastMessage('Please select at least one month')
      setToastType("error")
      setShowToast(true)
      return false
    }
    if (!selectedStatus) {
      setToastMessage('Please select a payment status')
      setToastType("error")
      setShowToast(true)
      return false
    }
    return true
  }

  const onSubmit = async (data) => {
    if (!validateForm()) return

    // Validate advance payment date if selected
    if (new Date(data.paymentDate) > new Date()) {
      setToastMessage('Advance payment date cannot be in the future')
      setToastType("error")
      setShowToast(true)
      return
    }

    setLoading(true)
    
    const feeData = {
      student: selectedStudent,
      months: selectedMonths,
      status: selectedStatus,
      baseAmount: calculatedBaseAmount, // Use calculated amount
      finePaid: data.paidFine === true,
      isAdvancePayment: true,
      paymentDate: data.paymentDate
    }
    
    try {
      const response = await AddStudentTransactionAPI(url, feeData, token)

      if (response.status === 201 || response.status === 200 || response.status === 204) {
        setToastMessage(response.message || 'Fee added successfully!')
        setToastType("success")
        setShowToast(true)
        
        // Reset form
        reset()
        setSelectedClass('')
        setSelectedClassName('')
        setSelectedStudent('')
        setSelectedStudentName('')
        setSelectedMonths([])
        setSelectedStatus('')
        setSelectedStatusName('')
        setCalculatedBaseAmount(0)
      } else {
        reset()
        setToastMessage('Failed to add fee')
        setToastType("error")
        setShowToast(true)
      
        if (response.status === 401) {  
          Cookies.remove('user')
          Cookies.remove('token')
          window.location.href = '/user-options'                      
        }
      }
    } catch (error) {
      setToastMessage('Error adding fee: ' + (error.message || 'Unknown error'))
      setToastType("error")
      setShowToast(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-4 w-full">
      <div className="min-h-full max-w-3xl flex items-center justify-center p-4">
        <div className="h-full w-full space-y-10 bg-white">
          <div className="text-left">
            <h2 className="h2 text-black mt-5 flex flex-col items-start">Add Advance Fee</h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-[32px] space-y-8 mb-[16px]">
            {/* Class Selection */}
            <div className="relative w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto">
              <div className="relative bg-transparent border-2 border-black-200 text-black-300 rounded-lg focus:outline">
                <button
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

            {/* Student Selection */}
            <div className="relative w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto">
              <div className="relative bg-transparent border-2 border-black-200 text-black-300 rounded-lg focus:outline">
                <button
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

            {/* Month Selection - Now showing only future months */}
            <div className="relative w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto">
              <div className="relative bg-transparent border-2 border-black-200 text-black-300 rounded-lg focus:outline">
                <button
                  type="button"
                  onClick={() => setIsMonthDropdownOpen(!isMonthDropdownOpen)}
                  disabled={!selectedStudent}
                  className={`w-full flex items-center justify-between px-2 py-1.5 md:py-2 border rounded-lg bg-white text-sm md:text-base ${!selectedStudent ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center w-full">
                    <Calendar className="w-4 h-4 md:w-5 md:h-5 mr-2 text-danger flex-shrink-0" />
                    <span className="h5 text-black truncate max-w-[80%]">
                      {selectedMonths.length > 0 
                        ? selectedMonths.join(", ")
                        : "Select Months"
                      }
                    </span>
                  </div>
                  <ChevronDown size={24} className="text-black" />
                </button>
                {isMonthDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {/* Only showing future months */}
                    {futureMonths.map((month) => (
                      <div
                        key={month}
                        onClick={() => toggleMonth(month)}
                        className="flex items-center px-2 md:px-4 py-1.5 md:py-2 hover:bg-gray-100 cursor-pointer text-black-300 text-sm md:text-base"
                      >
                        <div
                          className={`w-3 h-3 md:w-4 md:h-4 border rounded mr-2 flex items-center justify-center ${
                            selectedMonths.includes(month)
                              ? "bg-purple-500 text-white"
                              : "border-gray-300"
                          }`}
                        >
                          {selectedMonths.includes(month) && (
                            <Check className="w-2 h-2 md:w-3 md:h-3 text-black-300" />
                          )}
                        </div>
                        {month}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Status Selection */}
            <div className="relative w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto">
              <div className="relative bg-transparent border-2 border-black-200 text-black-300 rounded-lg focus:outline">
                <button
                  type="button"
                  onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                  disabled={selectedMonths.length === 0}
                  className={`w-full flex items-center justify-between px-2 py-1.5 md:py-2 border rounded-lg bg-white text-sm md:text-base ${selectedMonths.length === 0 ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 md:w-5 md:h-5 mr-2 text-danger" />
                    <span className="h5 text-black">
                      {selectedStatusName || "Select Payment Status"}
                    </span>
                  </div>
                  <ChevronDown size={24} className="text-black" />
                </button>
                {isStatusDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {statusOptions.map((status) => (
                      <div
                        key={status}
                        onClick={() => selectStatus(status)}
                        className="flex items-center px-2 md:px-4 py-1.5 md:py-2 hover:bg-gray-100 cursor-pointer text-black-300 text-sm md:text-base"
                      >
                        <div
                          className={`w-3 h-3 md:w-4 md:h-4 border rounded mr-2 flex items-center justify-center ${
                            selectedStatus === status
                              ? "bg-purple-500 text-white"
                              : "border-gray-300"
                          }`}
                        >
                          {selectedStatus === status && (
                            <Check className="w-2 h-2 md:w-3 md:h-3 text-black-300" />
                          )}
                        </div>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Base Amount Input - Now automatically calculated */}
            {/* <div className="w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto">
              <label className="block text-black-300 mb-1" htmlFor="baseAmount">
                Base Amount (Rs.)
              </label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-danger w-4 h-4 md:w-5 md:h-5" />
                <input
                  type="number"
                  id="baseAmount"
                  readOnly
                  {...register("baseAmount")}
                  value={calculatedBaseAmount}
                  className="w-full p-2 pl-10 border-2 border-black-200 bg-transparent text-black-300 rounded-lg focus:outline-none"
                />
              </div>
            </div> */}
               <Input
                          id="baseAmount"
                          name="baseAmount"
                          label="Base Amount"
                          register={register}
                          errors={errors}
                          icon={IndianRupee}
                          value={calculatedBaseAmount}
                          onChange={(e) => setClassFee(e.target.value)}
                        />

            {/* Payment Date */}
            <div className="w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto">
              <div className="relative">
                <label className="block text-black-300 mb-1" htmlFor="paymentDate">
                  Payment Date
                </label>
                <input
                  type="date"
                  id="paymentDate"
                  max={formattedDate}
                  {...register("paymentDate", {
                    required: true,
                    validate: value => new Date(value) <= new Date() || "Date cannot be in the future"
                  })}
                  className="w-full p-2 border-2 border-black-200 bg-transparent text-black-300 rounded-lg focus:outline-none [color-scheme:light]"
                />
                {errors.paymentDate && (
                  <p className="text-danger text-sm mt-1">{errors.paymentDate.message}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto mt-8">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center py-3 px-4 rounded-lg bg-success-500 text-white focus:outline-none hover:scale-105 transition duration-200"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    Add Fee
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddStudentAdvanceFees