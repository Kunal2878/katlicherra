import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { X, Plus, Loader } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { setEventData, setAnnouncementData } from "../../Store/slice";
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';
import { CreateEventAPI, CreateAnnouncementAPI, DeleteEventAPI, DeleteAnnouncementAPI, GetAllEventsAPI, GetAllAnnouncementsAPI } from '../../service/api';

const Events = () => {
  const token = Cookies.get("token");
  const url = import.meta.env.VITE_API_BASE_URL;
  const dispatch = useDispatch();

  const events = useSelector((state) => state.userData.EventData);
  const announcements = useSelector((state) => state.userData.AnnouncementData);
  const user = useSelector((state) => state.userData.user);
  
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [selectedAnnouncements, setSelectedAnnouncements] = useState([]);
  const [activeTab, setActiveTab] = useState("events");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);

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
        setToastMessage(response.message);
        setToastType("success");
        setShowToast(true);

      } else {
        setToastMessage(response.message);
        setToastType("error");
        setShowToast(true);
      }


      setIsLoading(false);
  
  };

  const fetchAnnouncements = async () => {
    setIsLoading(true);
    const response = await GetAllAnnouncementsAPI(url, token);
    if (response.status === 200 || response.status === 204 || response.status === 201) {
      dispatch(setAnnouncementData(response.data.announcements));
      setToastMessage(response.message);
      setToastType("success");
      setShowToast(true);
    } else {
      setToastMessage(response.message);
      setToastType("error");
      setShowToast(true);
    }
    setIsLoading(false);
  };

  const onEventSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await CreateEventAPI(url, data, token);
      if (response.status === 200 || response.status === 201 || response.status === 204) {
        await fetchEvents();
        resetEvent();
        setToastMessage("Event created successfully");
        setToastType("success");
        setShowEventForm(false);
      } else {
        setToastMessage(response.message);
        setToastType("error");
      }
    } catch (error) {
      setToastMessage("Failed to create event");
      setToastType("error");
    } finally {
      setShowToast(true);
      setIsLoading(false);
    }
  };

  const onAnnouncementSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await CreateAnnouncementAPI(url, data, token);
      if (response.status === 200 || response.status === 201 || response.status === 204) {
        await fetchAnnouncements();
        resetAnnouncement();
        setToastMessage("Announcement created successfully");
        setToastType("success");
        setShowAnnouncementForm(false);
      } else {
        setToastMessage(response.message);
        setToastType("error");
      }
    } catch (error) {
      setToastMessage("Failed to create announcement");
      setToastType("error");
    } finally {
      setShowToast(true);
      setIsLoading(false);
    }
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
    if (selectedEvents.length === 0) return;
    setIsLoading(true);
    try {
      const response = await DeleteEventAPI(url, { eventIds: selectedEvents }, token);
      if (response.status === 200 || response.status === 201 || response.status === 204) {
        await fetchEvents();
        setSelectedEvents([]);
        setToastMessage("Events deleted successfully");
        setToastType("success");
      } else {
        setToastMessage(response.message);
        setToastType("error");
      }
    } catch (error) {
      setToastMessage("Failed to delete events");
      setToastType("error");
    } finally {
      setShowToast(true);
      setIsLoading(false);
    }
  };

  const handleDeleteAnnouncements = async () => {
    if (selectedAnnouncements.length === 0) return;
    setIsLoading(true);
    try {
      const response = await DeleteAnnouncementAPI(url, { announcementIds: selectedAnnouncements }, token);
      if (response.status === 200 || response.status === 201 || response.status === 204) {
        await fetchAnnouncements();
        setSelectedAnnouncements([]);
        setToastMessage("Announcements deleted successfully");
        setToastType("success");
      } else {
        setToastMessage(response.message);
        setToastType("error");
      }
    } catch (error) {
      setToastMessage("Failed to delete announcements");
      setToastType("error");
    } finally {
      setShowToast(true);
      setIsLoading(false);
    }
  };
  
if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex items-center justify-center h-96">
          <Loader className="h-12 w-12 animate-spin text-purpleColor" />
        </div>
      </div>
    );
  }
  // Event Form Modal
  const EventFormModal = () => (
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
      <div
        className={`
          relative rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto 
          bg-white p-6 custom-scrollbar
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
          className="absolute top-6 right-6 p-2 bg-white rounded-full text-black-300 hover:scale-110"
        >
          <X size={24} />
        </button>
        <h2 className="h2 mb-[32px] text-left">Create Event</h2>

        {/* Event Form with React Hook Form */}
        <form onSubmit={handleSubmitEvent(onEventSubmit)} className="mb-[16px]">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Event Title"
              className={`w-full p-2 rounded bg-transparent border-2 border-black-200 text-black-300 focus:outline ${eventErrors.title ? 'border-red-500' : ''}`}
              {...registerEvent("title", { required: "Title is required" })}
            />
            {eventErrors.title && <p className="text-red-500 text-sm mt-1">{eventErrors.title.message}</p>}
          </div>
          
          <div className="mb-4">
            <textarea
              placeholder="Event Description"
              className={`w-full h-32 p-2 border-2 rounded bg-transparent border-black-200 text-black-300 focus:outline resize-none ${eventErrors.content ? 'border-red-500' : ''}`}
              {...registerEvent("content", { required: "Description is required" })}
            />
            {eventErrors.content && <p className="text-red-500 text-sm mt-1">{eventErrors.content.message}</p>}
          </div>
          
          <div className="mb-4">
            <input
              type="date"
              placeholder="Date"
              className={`w-full p-2 border-2 rounded bg-transparent border-black-200 text-black-300 focus:outline [&::-webkit-calendar-picker-indicator]:text-black [&::-webkit-calendar-picker-indicator]:filter-none ${eventErrors.eventDate ? 'border-red-500' : ''}`}
              {...registerEvent("eventDate", { required: "Date is required" })}
            />
            {eventErrors.eventDate && <p className="text-red-500 text-sm mt-1">{eventErrors.eventDate.message}</p>}
          </div>          
          <div className="mb-4">
            <input
              type="text"
              placeholder="Location"
              className={`w-full p-2 border-2 rounded bg-transparent border-black-200 text-black-300 focus:outline ${eventErrors.venue ? 'border-red-500' : ''}`}
              {...registerEvent("venue", { required: "Location is required" })}
            />
            {eventErrors.venue && <p className="text-red-500 text-sm mt-1">{eventErrors.venue.message}</p>}
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

  // Announcement Form Modal
  const AnnouncementFormModal = () => (
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
      <div
        className={`
          relative rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto 
          bg-white p-6 custom-scrollbar
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
          className="absolute top-6 right-6 p-2 bg-white rounded-full text-black-300 hover:scale-110"
        >
          <X size={24} />
        </button>
        <h2 className="h2 mb-[32px] text-left">Create Announcement</h2>

        {/* Announcement Form with React Hook Form */}
        <form onSubmit={handleSubmitAnnouncement(onAnnouncementSubmit)} className="space-y-[16px]">
          <div className="text-left space-y-2">
            <label htmlFor="title" className="h3 cursor-pointer">
              Title
            </label>
            <input
              id="title"
              placeholder="Announcement Title"
              className={`w-full p-2 border-2 rounded bg-transparent border-black-100 focus:outline focus:outline-2 focus:outline-black-200 text-black-300 ${announcementErrors.title ? 'border-red-500' : ''}`}
              {...registerAnnouncement("title", { required: "Title is required" })}
            />
            {announcementErrors.title && <p className="text-red-500 text-sm mt-1">{announcementErrors.title.message}</p>}
          </div>
          
          <div className="text-left space-y-2">
            <label htmlFor="description" className="h3 cursor-pointer">
              Description
            </label>
            <textarea
              id="description"
              placeholder="Announcement Description"
              className={`w-full h-32 p-2 border-2 rounded bg-transparent border-black-100 focus:outline focus:outline-2 focus:outline-black-200 text-black-300 resize-none ${announcementErrors.description ? 'border-red-500' : ''}`}
              {...registerAnnouncement("content", { required: "Description is required" })}
            />
            {announcementErrors.description && <p className="text-red-500 text-sm mt-1">{announcementErrors.description.message}</p>}
          </div>
          
          <button
            type="submit"
            className="mt-[16px] w-full bg-success-500 text-white p-2 rounded  flex items-center justify-center hover:scale-105 transition-all duration-200"
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
  );

  return (
    <div className="p-4 relative sm:px-16 px-6 sm:py-16 py-10">
     

      {/* Modals */}
      <EventFormModal />
      <AnnouncementFormModal />
      
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
            <h2 className="text-2xl font-bold text-black-300">Events</h2>
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
            <h2 className="text-2xl font-bold text-black-300">Announcements</h2>
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