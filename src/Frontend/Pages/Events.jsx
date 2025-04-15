import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { X, Plus, Loader } from "lucide-react";
import { setEventData, setAnnouncementData,setConfirmRequest,setShowConfirmationModel,setStatus, setAddText,setEventsChanged } from "../../Store/slice";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';
import { CreateEventAPI, CreateAnnouncementAPI, DeleteEventAPI, DeleteAnnouncementAPI, GetAllEventsAPI, GetAllAnnouncementsAPI } from '../../service/api';
import Confirmation from "../Components/Elements/ConfirmationModel"
import EventFormModal from './CreateEvent'
import AnnouncementFormModal from './CreateAnnouncement'

const Events = () => {
  const token = Cookies.get("token");
  const url = import.meta.env.VITE_API_BASE_URL;
  const dispatch = useDispatch();

  const events = useSelector((state) => state.userData.EventData);
  const announcements = useSelector((state) => state.userData.AnnouncementData);
  const user = useSelector((state) => state.userData.user);
  const eventsChanged = useSelector((state) => state.userData.eventsChanged);
  const showConfirmation = useSelector((state) => state.userData.showConfirmationModel);
  const confirmRequest = useSelector((state) => state.userData.confirmRequest);
  
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [selectedAnnouncements, setSelectedAnnouncements] = useState([]);
  const [activeTab, setActiveTab] = useState("events");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [deleteType, setDeleteType] = useState('')

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
    fetchEvents();
    fetchAnnouncements();
    document.title = "Events and Announcements";
  }, []);

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

  const fetchEvents = async () => {
  
      setIsLoading(true);
      const response = await GetAllEventsAPI(url, token);
      if (response.status === 200 || response.status === 204 || response.status === 201) {
        dispatch(setEventData(response.data.events));
     

      } else {
        setToastMessage(response.message);
        setToastType("error");
        setShowToast(true);

        if (response.status ===401)
          {
            Cookies.remove('token');
            Cookies.remove('user');
            window.location.href = '/user-options';

        }
      }


      setIsLoading(false);
  
  };

  const fetchAnnouncements = async () => {
    setIsLoading(true);
    const response = await GetAllAnnouncementsAPI(url, token);
    if (response.status === 200 || response.status === 204 || response.status === 201) {
      dispatch(setAnnouncementData(response.data.announcements));
     
    } else {
      setToastMessage(response.message);
      setToastType("error");
      setShowToast(true);
      if (response.status === 401)
        {
          Cookies.remove('token');
          Cookies.remove('user');
          window.location.href = '/user-options';

      }
    }
    setIsLoading(false);
  };

 
  const handleEventSelection = (eventId) => {
    setSelectedEvents((prev) =>
      prev.includes(eventId)
        ? prev.filter((id) => id !== eventId)
        : [...prev, eventId]
    );
  };

  const handleAnnouncementSelection = (announcementId) => {
    setSelectedAnnouncements((prev) =>
      prev.includes(announcementId)
        ? prev.filter((id) => id !== announcementId)
        : [...prev, announcementId]
    );
  };

  const handleDeleteEvents = async () => {
setDeleteType('events')
dispatch(setShowConfirmationModel(true));
  };

const DeleteEvents = async()=>{
  if (selectedEvents.length === 0) return;
 
    const response = await DeleteEventAPI(url, { eventIds: selectedEvents }, token);

    if (response.status ===200 ||response.status ===201 || response.status ===204 ) {
      dispatch(setStatus("success"))
      dispatch(setAddText(response.message))
      await fetchEvents();
          } 
          
          else {
            dispatch(setStatus("error"))
            dispatch(setAddText(response.message))
      
    
            if(response.status ===401 && response.message ==="Invalid token")
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
          setSelectedEvents([])
}

useEffect( ()=>{
  if(confirmRequest)
    {
      if(deleteType==='events'){
        DeleteEvents()
      }
      else if(deleteType==='announcements'){
        DeleteAnnouncements()
      }
    }
},[confirmRequest])


  const handleDeleteAnnouncements = async () => {
    setDeleteType('announcements')
    dispatch(setShowConfirmationModel(true));
    
  };
  
const DeleteAnnouncements = async ()=>{
  if (selectedAnnouncements.length === 0) return;

 
    const response = await DeleteAnnouncementAPI(url, { announcementIds: selectedAnnouncements }, token);
   
    if (response.status ===200 ||response.status ===201 || response.status ===204 ) {
      dispatch(setStatus("success"))
      dispatch(setAddText(` Announcements deleted successfully`))
      await fetchAnnouncements();
          } else {
            dispatch(setStatus("error"))
            dispatch(setAddText(response.message))
      
    
               
            if(response.status ===401 && response.message ==="Invalid token")
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
          setSelectedAnnouncements([])
   
}

useEffect(() => {
  if(eventsChanged ==='events'){
    fetchEvents();
    dispatch(setEventsChanged(''))

  }
  else if(eventsChanged ==='announcements')
  {
    fetchAnnouncements(); 
    dispatch(setEventsChanged(''))

  }
},[eventsChanged]);


if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex items-center justify-center h-96">
          <Loader className="h-12 w-12 animate-spin text-purpleColor" />
        </div>
      </div>
    );
  }

  

  return (
    <div className="p-4 relative sm:px-16 px-6 sm:py-16 py-10">
     

      {/* Modals */}
      <div
        className={`
          fixed inset-0 flex items-center justify-center 
          bg-black bg-opacity-50 z-50 
          ${
            showEventForm
              ? "opacity-100 visible"
              : "opacity-0 invisible pointer-events-none"
          }
          transition-all duration-300 ease-in-out
        `}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowEventForm(false);
          }
        }}
      >
        {showEventForm && (
          <div
            className={`
              relative rounded-xl w-auto max-h-[90vh] overflow-y-auto 
              bg-white
              custom-scrollbar
              ${
                showEventForm
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-95 -translate-y-4 pointer-events-none"
              }
              transition-all duration-300 ease-in-out
              transform origin-center
            `}
          >
            <button
                onClick={() => setShowEventForm(false)}
              className="absolute top-6 right-4 p-2 z-100 rounded-full text-black-300 transition-colors duration-200 transform hover:scale-110"
            >
              <X size={24} />
            </button>
             <EventFormModal onClose={() => setShowEventForm(false)} />
          </div>
        )}
      </div>
      <div
        className={`
          fixed inset-0 flex items-center justify-center 
          bg-black bg-opacity-50 z-50 
          ${
            showAnnouncementForm
              ? "opacity-100 visible"
              : "opacity-0 invisible pointer-events-none"
          }
          transition-all duration-300 ease-in-out
        `}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowAnnouncementForm(false);
          }
        }}
      >
        {showAnnouncementForm && (
          <div
            className={`
              relative rounded-xl w-auto max-h-[90vh] overflow-y-auto 
              bg-white
              custom-scrollbar
              ${
                showAnnouncementForm
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-95 -translate-y-4 pointer-events-none"
              }
              transition-all duration-300 ease-in-out
              transform origin-center
            `}
          >
            <button
                onClick={() => setShowAnnouncementForm(false)}
              className="absolute top-6 right-4 p-2 z-100 rounded-full text-black-300 transition-colors duration-200 transform hover:scale-110 mb-4"
            >
              <X size={24} />
            </button>
             <AnnouncementFormModal onClose={() => setShowAnnouncementForm(false)} />
          </div>
        )}
      </div>
     


      
      
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
            message={`Are you sure you want to delete the ${deleteType}? This action cannot be undone.`}
            note=""/>
        </div>
      )}


      {/* Tabs */}
      <div className="flex mb-4 border-b z-10">
        <button
          className={`px-4 py-2 subtitle-1 transition-all duration-300 ${
            activeTab === "events"
              ? "border-b-2 border-purpleColor text-purpleColor"
              : "hover:text-purpleColor text-black-300"
          }`}
          onClick={() => setActiveTab("events")}
        >
          Events
        </button>
        <button
          className={`px-4 py-2 subtitle-1 ml-4 transition-all duration-300 ${
            activeTab === "announcements"
              ? "border-b-2 border-purpleColor text-purpleColor"
              : "hover:text-purpleColor text-black-300"
          }`}
          onClick={() => setActiveTab("announcements")}
        >
          Announcements
        </button>
      </div>

      {/* Content */}
      <div className="w-full">
        {/* Events Section */}
        <div
          className={`transform transition-all duration-300 ${
            activeTab === "events"
              ? "translate-x-0 opacity-100"
              : "translate-x-full opacity-0 hidden"
          }`}
        >
          {/* Header with Add Button and Delete Button */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Events</h2>
            <div className="flex items-center gap-4">
              {selectedEvents.length > 0 && (
                <button
                  onClick={handleDeleteEvents}
                  className="bg-danger text-white px-4 py-2 rounded flex items-center gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    "Delete Selected"
                  )}
                </button>
              )}
{
  user?.role==='principal'&&(

              <button
                onClick={() => setShowEventForm(true)}
                className="flex items-center p-2 bg-success-500 text-white rounded-full transition-colors duration-200 transform hover:scale-105"
              >
                <Plus size={20} />
              </button>
  )
}



            </div>
          </div>

          {/* Events List */}

          <div className="bg-white rounded-lg p-4 w-full z-10">
            <div className="space-y-4">
              {Array.isArray(events) && events.length > 0 ? (
                events?.map((event, index) => (
                  <div
                    key={event._id}
                    className={`p-4 rounded-lg flex items-start ${
                      index % 3 === 0
                        ? "bg-lamaPurpleLight"
                        : index % 3 === 1
                        ? "bg-lamaYellowLight"
                        : "bg-lamaSkyLight"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="mr-2 mt-1"
                      checked={selectedEvents.includes(event._id)}
                      onChange={() => handleEventSelection(event._id)}
                    />
                    <div className="flex-1 text-left">
                      <h3 className="text-lg font-bold text-black-300">
                        {event.title}
                      </h3>
                      <p className="text-sm text-black-300 mt-1">{event.content}</p>
                      <div className="flex justify-between mt-2 text-sm text-black-300">
                        <span>{new Date(event.eventDate).toLocaleDateString('en-GB')}</span>                        <span>{event.venue}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500">
                  No events available
                </div>
              )}
            </div>
          </div>


        </div>

        {/* Announcements Section */}
        <div
          className={`transform transition-all duration-300 ${
            activeTab === "announcements"
              ? "translate-x-0 opacity-100"
              : "-translate-x-full opacity-0 hidden"
          }`}
        >
          {/* Header with Add Button and Delete Button */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Announcements</h2>
            <div className="flex items-center gap-4">
              {selectedAnnouncements.length > 0 && (
                <button
                  onClick={handleDeleteAnnouncements}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    "Delete Selected"
                  )}
                </button>
              )}


              {
              user?.role==='principal'&&(
              
              <button
                onClick={() => setShowAnnouncementForm(true)}
                className="flex items-center p-2 bg-success-500 text-white rounded-full transition-colors duration-200 transform hover:scale-105"
              >
                <Plus size={20} />
              </button>
              
              )
              
              }


            </div>
          </div>

          {/* Announcements List */}
          <div className="bg-white rounded-lg p-4 w-full z-10">
            <div className="space-y-4">
              {Array.isArray(announcements) && announcements.length > 0 ? (
                announcements?.map((announcement, index) => (
                  <div
                    key={announcement._id}
                    className={`p-4 rounded-lg flex items-start ${
                      index % 3 === 0
                        ? "bg-lamaPurpleLight"
                        : index % 3 === 1
                        ? "bg-lamaYellowLight"
                        : "bg-lamaSkyLight"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="mr-2 mt-1"
                      checked={selectedAnnouncements.includes(announcement._id)}
                      onChange={() => handleAnnouncementSelection(announcement._id)}
                    />
                    <div className="flex-1 text-left">
                      <h3 className="text-lg font-bold text-black-300">
                        {announcement.title}
                      </h3>
                      <p className="text-sm text-black-300 mt-1">{announcement.content}</p>
                      <div className="flex justify-between mt-2 text-sm text-black-300">
                        <span>{announcement.audience}</span>
                        <span>{announcement.date}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500">
                  No announcements available
                </div>
              )}
            </div>
          </div>








        </div>
      </div>
    </div>
  );
};

export default Events;