import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";
import { get } from "../apiServices/apiServices";
import { formatEvents } from "../utils/calendarUtils";

const fetcher = async (url) => {
  const data = await get(url);
  return data;
};

/**
 * Custom hook for managing room calendar functionality with SWR
 * @param {string} roomId - The room identifier (e.g., "room1", "room2")
 * @returns {Object} Calendar state and handlers
 */
const useRoomCalendar = (roomId) => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [view, setView] = useState("month");
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const navigate = useNavigate();

  const { data, error, mutate } = useSWR(`/event/room/${roomId}`, fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 10000, 
  });

  const events = data ? formatEvents(data.events) : [];
  const loading = !data && !error;

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
    mutate();
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