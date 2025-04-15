  import { useState, useEffect } from "react";
  import { useForm } from "react-hook-form";
  import Cookies from "js-cookie";
  import {
    User, ArrowRight, Phone, School2
  } from "lucide-react";
  import { toast } from 'react-toastify';
  import axios from "axios";
  import { useSelector, useDispatch } from "react-redux";
  import { setCurrentPage,setIsStudentUpdate } from "../../../Store/slice";
  import { GetAllClasses, GetSubjectByClass,UpdateStudent } from "../../Route";
  import { GetStudents } from '../../../service/api';
  import Input from "../../Components/Elements/Input";
  import SelectDropdown from "../../Components/Elements/SelectDropDownList";

  
  const UpdateStudents = (StudentData) => {
    const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
    } = useForm({
      defaultValues: {
        name: StudentData.studentData.name,
        parentName: StudentData.studentData.parentName,
        parentContact: StudentData.studentData.parentContact,
        section: StudentData.studentData.section,
        grade:StudentData.studentData.grade
      }
    });
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastIcon, setToastIcon] = useState("");
    const [classData, setClassData] = useState([]);
    const [subjectsData, setSubjectsData] = useState([]);
    const [selectedClass, setSelectedClass] = useState("");
    const [selectedSection, setSelectedSection] = useState("");
    const [selectedGrade, setSelectedGrade] = useState("");
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    
    const url = import.meta.env.VITE_API_BASE_URL;
    const token = Cookies.get("token");
    const dispatch = useDispatch()

    useEffect(()=>{
    setSelectedClass(StudentData.studentData?.studentClass?._id)
    },[StudentData])
  
    const fetchClasses = async () => {
      try {
        const response = await axios.get(`${url}${GetAllClasses}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setClassData(response.data.data.classes);
     
      } 
      
      
      catch (error) {
        console.error("Error fetching classes:", error);
        toast.error(error.response.data.message || "Error fetching classes:", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    };


    const fetchSubjects = async (classId) => {
      try {
        const response = await axios.get(`${url}${GetSubjectByClass}/${classId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
       
        setSubjectsData(response.data);

       
      } catch (error) {
        console.error("Error fetching subjects:", error);
              toast.error(error.response.data.message || "Error fetching subjects:", {
               position: "top-right",
               autoClose: 2000,
               hideProgressBar: false,
               closeOnClick: true,
               pauseOnHover: true,
               draggable: true,
             });
      }
    };

    useEffect(() => {
      fetchClasses();
    }, [StudentData]);

    useEffect(() => {
      if (selectedClass) {
        fetchSubjects(selectedClass);
      }
    }, [selectedClass]);
    const onSubmit = async (data) => {
      const stData = {
        name: data.name,
        studentClass: selectedClass,
        section: data.section,
        grade: data.grade,
        subjects: selectedSubjects,
        parentContact: data.parentContact,
        parentName: data.parentName
      };
      setLoading(true);
      try {
        const response = await axios.put(
          `${url}${UpdateStudent}/${StudentData.studentData._id}`,
          stData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200 ||response.status === 201 ||response.status === 204 ) {
          toast.success(response.data.message || "Update Successfully", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });


          reset();
          setSelectedClass("");
          setSelectedSection("");
          setSelectedGrade("");
          setSelectedSubjects([]);
          dispatch(setIsStudentUpdate(true))
       
        } else {
          toast.error(response.data.message || "Upadate failed", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          reset();
        }
      } catch (error) {
        toast.error(error.response.data.message || "Update failed", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        reset();
        if (error.status === 401) {  
          Cookies.remove('user');
          Cookies.remove('token');
          window.location.href = '/user-options';                      
        }

      } 
      
      finally {
        setLoading(false);
        reset();
      }
    };

    // console.log(StudentData.studentData._id)
    return (
      <div className="min-h-full max-w-3xl flex items-center justify-center p-6">
        <div className="h-full w-full space-y-12 bg-white">
          <div className="text-left">
            <h2 className="h2 text-black mt-5 flex flex-col items-start">
              Promote Student
            </h2>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-8 space-y-10 mb-4"
          >
            <Input
              id="name"
              name="name"
              label="Student Name"
              register={register}
              errors={errors}
              required="Name is required"
              placeholder="Full Name"
              icon={User}
              className="w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto"
            />
          
            <Input
              id="parentName"
              name="parentName"
              label="Parent Name"
              register={register}
              errors={errors}
              required="Parent name is required"
              placeholder="Parent Name"
              icon={User}
              className="w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto"
            />
          
            <Input
              id="parentContact"
              name="parentContact"
              label="Parent Contact"
              register={register}
              errors={errors}
              required="Parent contact is required"
              type="text"
              placeholder="Parent Contact"
              icon={Phone}
              validation={{
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Invalid contact number",
                },
              }}
              className="w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto"
            />
          
            <div className="w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto">
              <SelectDropdown
                options={classData || []}
                selectedValue={selectedClass}
                onSelect={setSelectedClass}
                displayField="className"
                valueField="_id"
                placeholder="Select Class"
                icon={<School2 size={20} />}
                required={true}
              />
            </div>

            <Input
              id="section"
              name="section"
              label="Section"
              register={register}
              errors={errors}
              required="Section is required"
              placeholder="Enter Section"
              icon={School2}
              className="w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto"
            />

            <Input
              id="grade"
              name="grade"
              label="Grade"
              register={register}
              errors={errors}
              required="Grade is required"
              placeholder="Enter Grade"
              icon={School2}
              className="w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto"
            />

            <div className="w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto">
              <SelectDropdown
                options={subjectsData || []}
                selectedValue={selectedSubjects}
                onSelect={(selected) => setSelectedSubjects(Array.isArray(selected) ? selected : [selected])}
                displayField="name"
                valueField="_id"
                placeholder="Select Subjects"
                icon={<School2 size={20} />}
                required={true}
                multiple={true}
              />
            </div>
          
            <div className="w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center py-3 px-4 rounded-lg bg-success-500 text-white focus:outline-none hover:scale-105 transition duration-200"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    Promote
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );  };

  export default UpdateStudents;