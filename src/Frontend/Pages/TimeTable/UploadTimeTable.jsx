import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import Toast from "../../Components/Toast";
import axios from 'axios';
import {  GetAllClasses } from '../../Route';
import { Upload, School } from 'lucide-react';
import SelectDropdown from '../../Components/Elements/SelectDropDownList';

const UploadTimeTable = () => {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm();
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const url = import.meta.env.VITE_API_BASE_URL;
  const token = Cookies.get('token');

  useEffect(() => {
    document.title = "Upload TimeTable";
  }, []);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get(`${url}${GetAllClasses}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.statusCode === 200) {
          setClasses(response.data.data.classes);
        }
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };
    fetchClasses();
  }, []);
console.log(selectedFile)
  const onSubmit = async (data) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('timetable', selectedFile);
   
    const classInfo = classes.find(classItem => classItem.className === selectedClass);
    const classId = classInfo ? classInfo._id : null;

    if (!classId) {
      setToastMessage("Class ID not found");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${url}class/${classId}/upload-timetable`, formData);

      if (response.status === 200||response.status===201||response.status===204) {
        setToastMessage("Time table uploaded successfully");
        setSelectedFile(null);
        setValue('timeTable', '');
        setSelectedClass("");
      } else {
        setToastMessage("Failed to upload time table");
      }
    } catch (error) {
      console.error('Error:', error);
      setToastMessage("Error uploading time table");
    } finally {
      setLoading(false);
    }
  };

  const classOptions = classes.map(classItem => ({
    name: classItem.className,
    email: classItem.className
  }));

  return (
    <div className="min-h-screen p-6 sm:p-6 lg:p-10">
      {toastMessage && (
        <Toast
          message={toastMessage}
          iconName={toastMessage.includes("successfully") ? "right" : "wrong"}
        />
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto bg-white rounded-lg p-8 transition-all duration-300 ">
        <h2 className="h2 text-xl md:text-2xl text-left font-bold mb-8 md:mb-12 mt-4 text-black-300">
          Upload Time Table
        </h2>
        
        <SelectDropdown
          options={classOptions}
          selectedValue={selectedClass}
          onSelect={setSelectedClass}
          displayField="name"
          valueField="email"
          placeholder="Select Class"
          icon={<School />}
          required={true}
        />

        <div className="mt-8 mb-10">
          <div className="relative w-full">
            <label
              htmlFor="timeTable"
              className="cursor-pointer flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-success-500 text-success-600 rounded-full hover:bg-success-200 transition-all w-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
              {selectedFile ? 'Change File' : 'Upload File'}
            </label>
            <input
              type="file"
              accept=".pdf,.jpeg,.png,.jpg"
              {...register('timeTable', {
                required: true,
                validate: {
                  lessThan5MB: (files) =>
                    !files[0] || files[0].size <= 5000000 || 'File size must be less than 5MB',
                },
              })}
              className="hidden"
              id="timeTable"
              onChange={(e) => {
                if (e.target.files[0]?.size > 5000000) {
                  e.target.value = '';
                  setToastMessage("File size must be less than 5MB");
                  setSelectedFile(null);
                } else {
                  setSelectedFile(e.target.files[0]);
                }
              }}
            />
          </div>
          {selectedFile && (
            <div className="mt-4 w-full">
              <p className="text-sm text-gray-600 truncate text-center mb-3">
                Selected: {selectedFile.name}
              </p>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center py-3 px-4 rounded-lg bg-success-500 text-white focus:outline-none hover:scale-105 transition duration-200"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    Upload
                    <Upload size={20} className="ml-2" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default UploadTimeTable;