import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';
import Cookies from "js-cookie";
import {setEventsChanged} from '../../Store/slice'
import { CreateAnnouncementAPI } from "../../service/api";
const AnnouncementFormModal = () => {
    const token = Cookies.get("token");
    const url = import.meta.env.VITE_API_BASE_URL;
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const { 
        register: registerAnnouncement, 
        handleSubmit: handleSubmitAnnouncement, 
        reset: resetAnnouncement,
        formState: { errors: announcementErrors }
    } = useForm({
        defaultValues: {
            title: "",
            description: ""
        }
    });

    useEffect(() => {
        if (showToast) {
            toast[toastType](toastMessage, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    }, [showToast, toastMessage, toastType]);

    const onAnnouncementSubmit = async (data) => {
        setIsLoading(true);
        
        const response = await CreateAnnouncementAPI(url, data, token);
        if (response.status === 200 || response.status === 201 || response.status === 204) {

            setToastMessage(response.message || "Announcement created successfully");
            setToastType("success");
            setShowToast(true);
            dispatch(setEventsChanged('announcements'));
        } else {
            setToastMessage(response.message);
            setToastType("error");
            setShowToast(true);
            if (response.status === 401) {
                Cookies.remove('token');
                Cookies.remove('user');
                window.location.href = '/user-options';
            }
        }
        
        resetAnnouncement();
        setIsLoading(false);
    };
    
    // Fixed return statement - opening parenthesis is on the same line as return
    return (
        <>
            <div className="min-h-full max-w-3xl flex items-center justify-center p-6">
                <div className="h-full w-full space-y-12 bg-white lg:pt-6 pt-8" >
                    <h2 className="h2 mb-[32px] text-left text-black-300">Create Announcement</h2>

                    {/* Announcement Form with React Hook Form */}
                    <form onSubmit={handleSubmitAnnouncement(onAnnouncementSubmit)} className="space-y-[16px]">
                        <div className="mb-4 relative w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto">
                            
                            <input
                                id="title"
                                placeholder="Announcement Title"
                                className={`w-full p-2 border-2 rounded bg-transparent border-black-100 focus:outline focus:outline-2 focus:outline-black-200 text-black-300 ${announcementErrors.title ? 'border-red-500' : ''}`}
                                {...registerAnnouncement("title", { required: "Title is required" })}
                            />
                            {announcementErrors.title && <p className="text-danger text-sm mt-1">{announcementErrors.title.message}</p>}
                        </div>
                        
                        <div className="mb-4 relative w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto">
                        
                            <textarea
                                id="description"
                                placeholder="Announcement Description"
                                className={`w-full h-32 p-2 border-2 rounded bg-transparent border-black-100 focus:outline focus:outline-2 focus:outline-black-200 text-black-300 resize-none ${announcementErrors.description ? 'border-red-500' : ''}`}
                                {...registerAnnouncement("content", { required: "Description is required" })}
                            />
                            {announcementErrors.description && <p className="text-danger text-sm mt-1">{announcementErrors.description.message}</p>}
                        </div>
                        
                        <button
                            type="submit"
                            className="mt-[16px] w-full bg-success-500 text-white p-2 rounded flex items-center justify-center hover:scale-105 transition-all duration-200"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            ) : (
                                "Create Announcement"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default AnnouncementFormModal;