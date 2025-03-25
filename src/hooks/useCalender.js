import { useState, useCallback } from "react";
import useSWR from "swr";
import moment from "moment";
import { get, del } from "../apiServices/apiServices";

const fetcher = async (url) => {
  try {
    const data = await get(url);
    return Array.isArray(data.events) ? data.events : [];
  } catch (error) {
    console.error("Fetcher error:", error);
    return []; 
  }
};

const formatEvents = (events) => {
  const eventArray = Array.isArray(events) ? events : [];
  return eventArray
    .filter(event => event && !event.isEnded && new Date(event.end) > new Date())
    .map(event => ({
      ...event,
      start: new Date(event.start),
      end: new Date(event.end)
    }));
};

const useCalendar = (initialEvents = [], room, setParentLoading = null, showAlert = null) => {
  console.log("on useCalender");
  
  const [view, setView] = useState("month");
  const [date, setDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const { 
    data, 
    error, 
    mutate,
    isLoading 
  } = useSWR(room ? `/event/room/${room}` : null, fetcher, {
    revalidateOnFocus: true,  
    revalidateOnReconnect: true, 
    refreshInterval: 0,         
    dedupingInterval: 0,      
    shouldRetryOnError: true,   

    onLoadingSlow: () => setParentLoading?.(true),
    onSuccess: (data) => {
      setParentLoading?.(false);
      console.log("Fetched data:", data); // Debug log
    },
    onError: (err) => {
      console.error("SWR fetch error:", err);
      setParentLoading?.(false);
      showAlert?.("Error", "Failed to fetch events");
    }
  });

  const events = formatEvents(data || initialEvents);

  const fetchEvents = () => {
    mutate();
  };

  const handleNavigate = useCallback((newDate) => {
    setDate(newDate);
  }, []);

  const handleViewChange = useCallback((newView) => {
    setView(newView);
    const today = new Date();
    if (newView === "day" || newView === "week") {
      setDate(today);
    }
  }, []);

  const handleSelect = ({ start, end }) => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const selectedDate = new Date(start);
    selectedDate.setHours(0, 0, 0, 0);
  
    if (selectedDate >= currentDate) {
      setSelectedSlot({ start, end });
      setIsModalOpen(true);
    } else {
      showAlert?.("Scheduling Error", "Cannot schedule events for past dates!") 
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!eventId) {
      console.error("Event ID is missing.");
      return;
    }
    
    try {
      setParentLoading?.(true);
      await del(`/event/${eventId}`);
      mutate(
        events.filter((event) => event.id !== eventId),
        false
      );
      showAlert?.("Success", "Event deleted successfully.");
    } catch (error) {
      console.error("Error deleting event:", error.response?.data || error.message);
      showAlert?.("Error", "Failed to delete event.");
    } finally {
      setParentLoading?.(false);
    }
  };

  const handleSaveEvent = async (eventData) => {
    try {
      setParentLoading?.(true);
      const newEvent = {
        id: eventData.id || events.length + 1,
        ...eventData,
        isEnded: false,
        start: new Date(eventData.start),
        end: new Date(eventData.end)
      };
      mutate([...events, newEvent], false);
      await fetchEvents();
      showAlert?.("Success", "Event saved successfully.");
    } catch (error) {
      console.error("Error saving event:", error);
      showAlert?.("Error", "Failed to save event");
    } finally {
      setParentLoading?.(false);
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

  const goToToday = () => setDate(new Date());
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