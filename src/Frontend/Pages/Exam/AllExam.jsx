import { useState, useEffect } from "react";
import { useForm } from 'react-hook-form';
import Cookies from "js-cookie";
import { Upload, ArrowRight, Eye,Trash } from "lucide-react";
import axios from "axios";
import {useSelector, useDispatch} from 'react-redux'
import { toast } from 'react-toastify';
import { CreateExam, GetAllExams, UploadExamTimeTable } from "../../Route";
import { DeleteExamAPI} from '../../../service/api';
import Confirmation from "../../Components/Elements/ConfirmationModel"
import { setConfirmRequest,setShowConfirmationModel,setStatus, setAddText } from "../../../Store/slice";

const AllExams = () => {
  const token = Cookies.get("token");
  const url = import.meta.env.VITE_API_BASE_URL;
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm();
  const [timeTableFile, setTimeTableFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showFailure, setShowFailure] = useState(false);
  const [selectedExam,setSelectedExam] = useState(null);
  const [showToast, setShowToast] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [exams, setExams] = useState([]);
  const [isLoadingExams, setIsLoadingExams] = useState(false);
  const user = useSelector((state) => state.userData.user);
  const dispatch = useDispatch()
  const showConfirmation = useSelector((state) => state.userData.showConfirmationModel);
  const confirmRequest = useSelector((state) => state.userData.confirmRequest);
  useEffect(() => {
    fetchExams();
    document.title = "Exam Details";
  }, []);

  useEffect(() => {
    if (showToast.show) {
      toast[showToast.type === "right" ? "success" : "error"](showToast.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }, [showToast]);

  const fetchExams = async () => {
    setIsLoadingExams(true);
    try {
      const response = await axios.get(`${url}${GetAllExams}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setExams(response.data.data.exams || []);
    } catch (error) {
  
      setShowFailure(true);
      setShowToast({
        show: true,
        message: error.response?.data?.message || "Failed to fetch exams",
        type: "wrong",
      });
      setTimeout(() => {
        setShowFailure(false);
      }, 2000);
    } finally {
      setIsLoadingExams(false);
    }
  };

  const uploadTimeTable = async (examId, file) => {
    try {
      const formData = new FormData();
      formData.append("timeTable", file);

      const timeTableResponse = await axios.post(
        `${url}${UploadExamTimeTable}/${examId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      setShowToast({
        show: true,
        message: timeTableResponse.data.message,
        type: "right",
      });
      
      await fetchExams();
      return true;
    } catch (error) {
      setShowToast({
        show: true,
        message: "Failed to upload timetable",
        type: "wrong",
      });
      if (error.status ===401)
        {
          Cookies.remove('token');
          Cookies.remove('user');
          window.location.href = '/user-options';

      }
      return false;
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
  
    try {
      const response = await axios.post(
        `${url}${CreateExam}`,
        {
          name: data.examName,
          date: data.examDate
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );
  
      setShowToast({
        show: true,
        message: response.data.message,
        type: "right",
      });
  
      if (timeTableFile && response?.data?.data?.createdExam?._id) {
        await uploadTimeTable(response.data.data.createdExam._id, timeTableFile);
      }
  
      await fetchExams();
      // Reset form
      setValue('examName', '');
      setValue('examDate', '');
      setTimeTableFile(null);
    } catch (error) {
      setShowFailure(true);
      setShowToast({
        show: true,
        message: error.response?.data?.message || "An error occurred",
        type: "wrong",
      });
      if (error.status ===401)
        {
          Cookies.remove('token');
          Cookies.remove('user');
          window.location.href = '/user-options';

      }
      setTimeout(() => {
        setShowFailure(false);
      }, 2000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUploadForExam = (examId) => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf,.jpg,.png,.jpeg';
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.size <= 5 * 1024 * 1024) {
          await uploadTimeTable(examId, file);
        } else {
          setShowToast({
            show: true,
            message: "File size should be less than 5 MB",
            type: "wrong",
          });
        }
      }
    };
    fileInput.click();
  };

const handleDeleteExam =(exam)=>{
setSelectedExam(exam)
dispatch(setShowConfirmationModel(true));

}

const DeleteExam = async ()=>{
 const response = await DeleteExamAPI(url, token, selectedExam?._id);
 
      if (response.status ===200 ||response.status ===201 || response.status ===204 ) {
        dispatch(setStatus("success"))
        dispatch(setAddText(` ${selectedExam?.name} deleted successfully`))
        fetchExams();
      } else {
        dispatch(setStatus("error"))
        dispatch(setAddText(response.message))
  

        if(response.status ===401)
        {
          Cookies.remove('token');
          Cookies.remove('user');
          window.location.href = '/user-options';
          
        }
      }
      setTimeout(() => {
        dispatch(setStatus(''));
        dispatch(setAddText(''));
        dispatch(setShowConfirmationModel(false));
      }, 3000);
      dispatch(setConfirmRequest(false))
  }

useEffect( ()=>{
  if(confirmRequest)
    {
    DeleteExam()
    }
},[confirmRequest])

  return (
    <div className="min-h-screen sm:px-16 px-6 sm:py-16 py-10">

      { user?.role==='principal'&&(
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-4 md:p-6 mb-[64px]">
        <h2 className="h2 mb-[32px] text-left">Create New Exam</h2>

        <div className="flex flex-col md:flex-row gap-[16px] md:gap-[16px]">
          <div className="flex-1">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
              <div className="relative mb-10">
                <input
                  id="examName"
                  type="text"
                  className="w-full px-4 py-2 border-2 bg-transparent border-black-200 text-gray-600 rounded-md shadow-sm focus:outline   transition-all peer placeholder-transparent"
                  placeholder="Exam Name"
                  {...register('examName', { required: true })}
                />
                <label
                  htmlFor="examName"
                  className="absolute left-1 -top-7 text-sm font-medium text-gray-700 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-focus:-top-7 peer-focus:text-sm"
                >
                  Exam Name
                </label>
                {errors.examName && <span className="text-danger text-sm">Exam Name is required</span>}
              </div>

              <div className="relative mb-10">
                <input
                  id="examDate"
                  type="date"
                  className="w-full px-4 py-2 border-2 bg-transparent border-black-200 text-black rounded-md shadow-sm focus:outline transition-all peer placeholder-transparent [color-scheme:light]"
                  {...register('examDate', { required: true })}
                />
                <label
                  htmlFor="examDate"
                  className="absolute left-1 -top-7 text-sm font-medium text-gray-700 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-focus:-top-7 peer-focus:text-sm"
                >
                  Exam Date
                </label>
                {errors.examDate && <span className="text-danger text-sm">Exam Date is required</span>}
              </div>

              <div className="relative">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center py-3 px-4 rounded-lg bg-success-500 text-white focus:outline-none hover:scale-105 transition duration-200"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      Create
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="md:w-1/3 flex flex-col justify-center  pl-0 md:pl-8">
            <div className="flex flex-col items-center justify-center h-full">
              <div className="mb-3 text-center">
                <h3 className="h3 mb-2">Upload Time Table</h3>
                <p className="subtitle-2">Max size: 5MB</p>
              </div>

              <div className="relative w-full">
                <label
                  htmlFor="timeTable"
                  className="cursor-pointer flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-success-500 text-success-600 rounded-full hover:bg-success-200 transition-all w-full"
                >
                  <Upload size={20} />
                  {timeTableFile ? "Change File" : "Upload File"}
                </label>
                <input
                  type="file"
                  className="hidden"
                  id="timeTable"
                  accept=".pdf,.jpg,.png,.jpeg"
                  {...register('timeTable', {
                    validate: {
                      lessThan5MB: (files) =>
                        !files[0] || files[0].size <= 5000000 || 'File size must be less than 5MB',
                    },
                  })}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file && file.size <= 5 * 1024 * 1024) {
                      setTimeTableFile(file);
                    } else {
                      alert("File size should be less than 5 MB");
                      e.target.value = "";
                    }
                  }}
                />
              </div>

              {timeTableFile && (
                <div className="mt-4 w-full">
                  <p className="text-sm text-gray-600 truncate text-center mb-3">
                    Selected: {timeTableFile.name}
                  </p>
                </div>
              )}
              {errors.timeTable && <span className="text-danger text-sm">{errors.timeTable.message}</span>}
            </div>
          </div>
        </div>
      </div>
      )}

{showConfirmation && (
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
              setSelectedExam(null);
            }
          }}
        >
          <Confirmation 
            message={`Are you sure you want to delete ${selectedExam?.name} exam? This action cannot be undone.`}
            note=""/>
        </div>
      )}

      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-4 md:p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="h2 text-black-300">Exam List</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-lamaYellowLight text-black-300">
              <tr>
                <th scope="col" className="px-6 py-3 text-left subtitle-1 text-black-300">
                  Index
                </th>
                <th scope="col" className="px-6 py-3 text-left subtitle-1 text-black-300">
                  Exam Name
                </th>
                <th scope="col" className="px-6 py-3 text-left subtitle-1 text-black-300">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left subtitle-1 text-black-300">
                  Time Table
                </th>
                <th scope="col" className="px-6 py-3 text-left subtitle-1 text-black-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoadingExams ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purpleColor"></div>
                    </div>
                  </td>
                </tr>
              ) : exams.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No exams found
                  </td>
                </tr>
              ) : (
                exams.map((exam, index) => (
                  <tr key={exam._id} className="text-left hover:bg-gray-50 ">
                    <td className="px-6 py-4 subtitle-2 text-black-200">{index + 1}</td>
                    <td className="px-6 py-4 subtitle-2 text-black-200">{exam.name}</td>
                    <td className="px-6 py-4 subtitle-2 text-black-200">
                      {new Date(exam.date).toLocaleDateString('en-GB')}
                    </td>
                    <td className="px-6 py-4 subtitle-2">
                      {exam?.timeTableUrl&&(
                        <a
                          href={exam?.timeTableUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Eye
                            size={20}
                            className="text-primaryBlue cursor-pointer"
                          />
                        </a>
                      )  }
                        <button
                          onClick={() => handleFileUploadForExam(exam._id)}
                          className="text-primaryBlue hover:text-blue-700"
                          title="Click to upload time table"
                        >
                          <Upload className="h-5 w-5" />
                        </button>
                     
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-danger" onClick={() => handleDeleteExam(exam)}>
                        <Trash size={20} className="cursor-pointer" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AllExams;