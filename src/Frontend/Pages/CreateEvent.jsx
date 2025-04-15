import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';
import Cookies from 'js-cookie'
import {setEventsChanged} from '../../Store/slice'
import { CreateEventAPI } from "../../service/api";
const EventFormModal = () => {
    const token = Cookies.get("token");
    const url = import.meta.env.VITE_API_BASE_URL;
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const { 
        register: registerEvent, 
        handleSubmit: handleSubmitEvent, 
        reset: resetEvent,
        formState: { errors: eventErrors }
    } = useForm({
        defaultValues: {
            title: "",
            content: "",
            eventDate: "",
            venue: ""
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
      
    const onEventSubmit = async (data) => {
        setIsLoading(true);
     
        const response = await CreateEventAPI(url, data, token);
        if (response.status === 200 || response.status === 201 || response.status === 204) {
            setToastMessage(response.message||"Event created successfully");
            setToastType("success");
            setShowToast(true);
           dispatch(setEventsChanged('events'));
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
        resetEvent();
        setIsLoading(false);
    };

    // Fixed return statement - opening parenthesis is on the same line as return
    return (
        <div className="min-h-full max-w-3xl flex items-center justify-center p-6">
            <div className="h-full w-full space-y-12 bg-white lg:pt-6 pt-8">
                <h2 className="h2 mb-[32px] text-left text-black-300">Create Event</h2>

                {/* Event Form with React Hook Form */}
                <form onSubmit={handleSubmitEvent(onEventSubmit)} className="mb-[16px]">
                    <div className="mb-4 relative w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto">
                        <input
                            type="text"
                            placeholder="Event Title"
                            className={`w-full p-2 rounded bg-transparent border-2 border-black-200 text-black-300 focus:outline ${eventErrors.title ? 'border-red-500' : ''}`}
                            {...registerEvent("title", { required: "Title is required" })}
                        />
                        {eventErrors.title && <p className="text-danger text-sm mt-1">{eventErrors.title.message}</p>}
                    </div>
                    
                    <div className="mb-4 relative w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto">
                        <textarea
                            placeholder="Event Description"
                            className={`w-full h-32 p-2 border-2 rounded bg-transparent border-black-200 text-black-300 focus:outline resize-none ${eventErrors.content ? 'border-red-500' : ''}`}
                            {...registerEvent("content", { required: "Description is required" })}
                        />
                        {eventErrors.content && <p className="text-danger text-sm mt-1">{eventErrors.content.message}</p>}
                    </div>
                    
                    <div className="mb-4 relative w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto">
                        <input
                            type="date"
                            placeholder="Date"
                            className={`w-full p-2 border-2 rounded bg-transparent border-black-200 [color-scheme:light] text-black-300 focus:outline [&::-webkit-calendar-picker-indicator]:text-black [&::-webkit-calendar-picker-indicator]:filter-none ${eventErrors.eventDate ? 'border-red-500' : ''}`}
                            {...registerEvent("eventDate", { required: "Date is required" })}
                        />
                        {eventErrors.eventDate && <p className="text-danger text-sm mt-1">{eventErrors.eventDate.message}</p>}
                    </div>          
                    <div className="mb-4 relative w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto">
                        <input
                            type="text"
                            placeholder="Location"
                            className={`w-full p-2 border-2 rounded bg-transparent border-black-200 text-black-300 focus:outline ${eventErrors.venue ? 'border-red-500' : ''}`}
                            {...registerEvent("venue", { required: "Location is required" })}
                        />
                        {eventErrors.venue && <p className="text-danger text-sm mt-1">{eventErrors.venue.message}</p>}
                    </div>
                    <div className="mb-4 relative w-full sm:w-96 md:w-[24rem] lg:w-[28rem] mx-auto">
                        <input
                            type="number"
                            placeholder="Amount"
                            className={`w-full p-2 border-2 rounded bg-transparent border-black-200 text-black-300 focus:outline ${eventErrors.amount ? 'border-red-500' : ''}`}
                            {...registerEvent("amount", { required: "Amount is required" })}
                        />
                        {eventErrors.amount && <p className="text-danger text-sm mt-1">{eventErrors.amount.message}</p>}
                    </div>
                    
                    <button
                        type="submit"
                        className="w-full bg-success-500 text-white p-2 rounded flex items-center justify-center hover:scale-105 transition duration-200"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        ) : (
                            "Create Event"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default EventFormModal;