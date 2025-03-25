import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";
import { get } from "../apiServices/apiServices";
import { formatEvents } from "../utils/calendarUtils";

const fetcher = async (url) => {
  try {
    const data = await get(url);
    return data;
  } catch (error) {
    console.error("Fetching events error:", error);
    throw error;
  }
};

const useRoomCalendar = (roomId) => {
  console.log("on useRoomCalendar");
  
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [view, setView] = useState("month");
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const navigate = useNavigate();

  const { 
    data, 
    error, 
    mutate,
    isValidating 
  } = useSWR(`/event/room/${roomId}`, fetcher, {
    revalidateOnFocus: true,     // Revalidate when window is refocused
    revalidateOnReconnect: true, // Revalidate when internet connection is restored
    refreshInterval: 0,           // Disable automatic refetching
    dedupingInterval: 0,          // Disable deduping to ensure fresh data
    shouldRetryOnError: true,     // Retry on error
    onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
      if (retryCount >= 3) return;
      
      setTimeout(() => revalidate(config), 5000);
    }
  });

  const events = data && data.events ? formatEvents(data.events) : [];
  const loading = isValidating;

  const handleSelectSlot = ({ start, end }) => {
    setSelectedSlot({ start, end });
    navigate(`/${roomId}/createSchedule`, {
      state: { defaultStart: start, defaultEnd: end },
    });
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleViewChange = (newView) => {
    setView(newView);
  };

  const handleScheduleClick = () => {
    navigate(`/${roomId}/createSchedule`);
  };

  const handleBack = () => {
    window.history.back();
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
  };

  const refreshEvents = () => {
    mutate(undefined, { revalidate: true });
  };

  return {
    events,
    selectedSlot,
    view,
    showModal,
    selectedEvent,
    loading,
    error,
    handleSelectSlot,
    handleSelectEvent,
    handleViewChange,
    handleScheduleClick,
    handleBack,
    closeModal,
    refreshEvents
  };
};

export default useRoomCalendar;