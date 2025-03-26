import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import useCalendar from "../../hooks/useCalender";
import CustomToolbar from "./CustomToolbar";
import {
  injectCalendarStyles,
  eventStyleGetter,
  dayPropGetter,
} from "./calendarStyles";
import EventModal from "./EventModal";
import CustomAlert from "../../componets/customComponets/Alert";
import { useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import LoadingCalendar from "../../Shimmers/LoadingCalender";
import EventDetailModal from "../../componets/customComponets/EventDetailModal";

const localizer = momentLocalizer(moment);

const ScheduleTime = () => {
  const { room } = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
  });
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);

  const showAlert = (title, message) => {
    setAlertConfig({
      isOpen: true,
      title,
      message,
    });
    setTimeout(closeAlert, 3000); // Auto-close after 3 seconds
  };

  const closeAlert = () => {
    setAlertConfig((prev) => ({
      ...prev,
      isOpen: false,
    }));
  };

  const {
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
    isLoading,
  } = useCalendar([], room, setLoading, showAlert);

  useEffect(() => {
    return injectCalendarStyles();
  }, []);

  const handleSave = ({ event, message }) => {
    handleSaveEvent(event);
    showAlert("Success", message); // Show success message from EventModal
  };

  const handleEditEvent = (event) => {
    setDetailModalOpen(false);
    setEditingEvent(event);
    openModal();
  };

  const handleDelete = async (eventId) => {
    try {
      await handleDeleteEvent(eventId);
      setDetailModalOpen(false);
      setLoading(true);
      await fetchEvents();
      showAlert("Success", "Event deleted successfully");
    } catch (error) {
      showAlert("Error", "Failed to delete event");
    } finally {
      setLoading(false);
    }
  };

  const currentTime = moment().startOf("hour").toDate();
  const startOfDay = moment().startOf("day").toDate();
  const isToday = moment(date).isSame(new Date(), "day");
  const minTime = isToday && (view === "day" || view === "week") ? currentTime : startOfDay;

  if (loading) {
    return <LoadingCalendar />;
  }

  return (
    <div className="bg-white border border-black">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSelect}
        onSelectEvent={(event) => {
          setSelectedEvent(event);
          setDetailModalOpen(true);
        }}
        view={view}
        onView={handleViewChange}
        date={date}
        onNavigate={handleNavigate}
        components={{ toolbar: CustomToolbar }}
        eventPropGetter={eventStyleGetter}
        dayPropGetter={dayPropGetter}
        className="min-h-screen"
        min={minTime}
      />
      <EventModal
        isOpen={isModalOpen}
        onClose={() => {
          closeModal();
          setEditingEvent(null);
        }}
        onSave={handleSave} // Updated to handle event and message
        initialStart={editingEvent?.start || selectedSlot?.start || new Date()}
        initialEnd={editingEvent?.end || selectedSlot?.end || new Date()}
        room={room}
        userId={user?.id}
        editingEvent={editingEvent}
        events={events}
      />
      <EventDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        event={selectedEvent}
        onDelete={handleDelete}
        onEdit={handleEditEvent}
        userId={user?.id}
      />
      <CustomAlert
        isOpen={alertConfig.isOpen}
        onClose={closeAlert}
        title={alertConfig.title}
        message={alertConfig.message}
      />
    </div>
  );
};

export default ScheduleTime;