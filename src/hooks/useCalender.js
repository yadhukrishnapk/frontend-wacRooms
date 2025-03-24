import { useState, useCallback, useEffect } from "react";
import moment from "moment";
import { get,del } from "../apiServices/apiServices";

const useCalendar = (initialEvents = [], room, setParentLoading = null, showAlert = null) => {
  const [events, setEvents] = useState(initialEvents);
  const [view, setView] = useState("month");
  const [date, setDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      if (setParentLoading) setParentLoading(true);
      
      if (!room) {
        setIsLoading(false);
        if (setParentLoading) setParentLoading(false);
        return;
      }

      const response = await get(`/event/room/${room}`);

      // Filter out any ended events (this is a safety measure - the backend should already filter them)
      const currentTime = new Date();
      const formattedEvents = response.events
        .filter(event => !event.isEnded && new Date(event.end) > currentTime)
        .map(event => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end)
        }));

      setEvents(formattedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setIsLoading(false);
      if (setParentLoading) setParentLoading(false);
    }
  };

  // Set up periodic refresh to check for ended events
  useEffect(() => {
    fetchEvents();
    
    // Check for ended events every minute
    const intervalId = setInterval(() => {
      // This will automatically mark events as ended when their time is up
      fetchEvents();
    }, 60000);

    return () => clearInterval(intervalId);
  }, [room]);

  const handleNavigate = useCallback((newDate) => {
    setDate(newDate);
  }, []);

  const handleViewChange = useCallback((newView) => {
    // Set view to the requested view
    setView(newView);
    
    // When changing views, adjust the date to show current day/week/month as appropriate
    const today = new Date();
    
    if (newView === "day") {
      // For day view, always show today
      setDate(today);
    } else if (newView === "week") {
      // For week view, show the current week
      setDate(today);
    }
    // For month view, we can just keep the current selected month
    
  }, []);

  const handleSelect = ({ start, end }) => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Normalize to midnight for comparison
  
    const selectedDate = new Date(start);
    selectedDate.setHours(0, 0, 0, 0); // Normalize to midnight
  
    if (selectedDate >= currentDate) {
      setSelectedSlot({ start, end });
      setIsModalOpen(true);
    } else {
      // Use the custom alert if provided, otherwise fall back to default alert
      if (showAlert) {
        showAlert("Scheduling Error", "Cannot schedule events for past dates!");
      } else {
        alert("Cannot schedule events for past dates!");
      }
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!eventId) {
      console.error("Event ID is missing.");
      return;
    }
    
    try {
      console.log(`Sending DELETE request to /event/${eventId}`);
      const response = await del(`/event/${eventId}`);
      console.log("Delete Response:", response);
      setEvents((prev) => prev.filter((event) => event.id !== eventId));
      if (showAlert) showAlert("Success", "Event deleted successfully.");
    } catch (error) {
      console.error("Error deleting event:", error.response?.data || error.message);
      if (showAlert) showAlert("Error", "Failed to delete event.");
    }
  };
  
  
  const handleSaveEvent = async (eventData) => {
    setIsLoading(true);
    if (setParentLoading) setParentLoading(true);

    try {
      setEvents((prev) => [
        ...prev,
        {
          id: eventData.id || prev.length + 1,
          ...eventData,
          isEnded: false
        },
      ]);

      await fetchEvents();
    } catch (error) {
      console.error("Error saving event:", error);
    } finally {
      setIsLoading(false);
      if (setParentLoading) setParentLoading(false);
    }
  };

  const navigateByView = (direction) => {
    let newDate;
    const amount = direction === 'next' ? 1 : -1;

    switch (view) {
      case "month":
        newDate = moment(date).add(amount, "month").toDate();
        break;
      case "week":
        newDate = moment(date).add(amount, "week").toDate();
        break;
      case "day":
        newDate = moment(date).add(amount, "day").toDate();
        break;
      default:
        newDate = date;
    }
    setDate(newDate);
  };

  const goToToday = () => {
    setDate(new Date());
  };

  const goToPrevious = () => navigateByView('prev');
  const goToNext = () => navigateByView('next');

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSlot(null);
  };

  return {
    events,
    view,
    date,
    isModalOpen,
    selectedSlot,
    handleDeleteEvent,
    handleNavigate,
    handleViewChange,
    handleSelect,
    handleSaveEvent,
    goToToday,
    goToPrevious,
    goToNext,
    openModal,
    closeModal,
    fetchEvents,
    isLoading
  };
};

export default useCalendar;