import React, { useState } from "react";
import { Calendar, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format } from "date-fns";
import { useParams } from "react-router-dom";
import useRoomCalendar from "../../../hooks/useRoomCalendar";
import {
  localizer,
  eventStyleGetter,
  customStyles,
  getDayPropGetter,
} from "../../../utils/calendarUtils.js";
import {
  CategoryLegend,
  CustomToolbar,
  EventDetailsModal,
} from "../CalendarComponents.jsx";
import CalendarShimmer from "../../../Shimmers/CalendarShimmer.jsx";

const roomConfigs = {
  room1: {
    name: "Abin's Room",
    description: "Schedule meetings and presentations here.",
  },
  room2: {
    name: "Jilu's Conference Room",
    description: "For larger team meetings and client presentations.",
  },
  room3: {
    name: "Quiet Space With Screen",
    description: "For focused work and small discussions.",
  },
};

const RoomPage = () => {
  const { roomId } = useParams();
  const roomConfig = roomConfigs[roomId] || {
    name: `Room ${roomId}`,
    description: "Book this room for your meetings.",
  };

  const {
    events,
    selectedSlot,
    view,
    showModal,
    selectedEvent,
    loading,
    handleSelectSlot,
    handleSelectEvent,
    handleViewChange,
    handleScheduleClick,
    handleBack,
    closeModal,
  } = useRoomCalendar(roomId);
  const [date, setDate] = useState(new Date());

  const handleNavigate = (action) => {
    let newDate = new Date(date);
    switch (action) {
      case "PREV":
        newDate.setMonth(date.getMonth() - 1);
        break;
      case "NEXT":
        newDate.setMonth(date.getMonth() + 1);
        break;
      case "TODAY":
        newDate = new Date();
        break;
      default:
        break;
    }
    setDate(newDate);
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-5xl w-full border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {roomConfig.name}
        </h1>
        <p className="text-gray-600 mb-4">{roomConfig.description}</p>
        <CategoryLegend />
        {loading ? (
          <CalendarShimmer />
        ) : (
          <>
            <div style={customStyles.container}>
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleSelectEvent}
                defaultView={Views.MONTH}
                view={view}
                onView={handleViewChange}
                views={[Views.MONTH, Views.WEEK, Views.DAY]}
                step={15}
                timeslots={4}
                style={{ height: "100%" }}
                eventPropGetter={eventStyleGetter}
                components={{
                  toolbar: (props) => (
                    <CustomToolbar
                      {...props}
                      view={view}
                      onNavigate={handleNavigate}
                    />
                  ),
                }}
                date={date}
                onNavigate={handleNavigate}
                dayPropGetter={getDayPropGetter(selectedSlot)}
                popup
                showMultiDayTimes
              />
            </div>

            {selectedSlot && (
              <div className="mt-4 text-sm text-gray-600">
                Selected: {format(selectedSlot.start, "PPp")} -{" "}
                {format(selectedSlot.end, "p")}
              </div>
            )}
          </>
        )}

        <div className="mt-6 flex justify-between gap-4">
          <button
            onClick={handleBack}
            className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-black transition-colors"
          >
            Back to Office
          </button>
          <div className="flex items-center gap-4">
            <button
              onClick={handleScheduleClick}
              className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-black transition-colors"
            >
              + Schedule Time
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <EventDetailsModal event={selectedEvent} onClose={closeModal} />
      )}
    </div>
  );
};

export default RoomPage;
