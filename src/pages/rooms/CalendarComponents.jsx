import React from "react";
import { format } from "date-fns";
import { categoryColors, customStyles } from "../../utils/calendarUtils";

/**
 * Custom toolbar component for react-big-calendar
 */
export const CustomToolbar = ({ label, onNavigate, onView, view }) => (
  <div
    className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3"
    style={customStyles.toolbar}
  >
    <div className="flex items-center gap-2">
      <button
        onClick={() => onNavigate("PREV")}
        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
      >
        Prev
      </button>
      <button
        onClick={() => onNavigate("TODAY")}
        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
      >
        Today
      </button>
      <button
        onClick={() => onNavigate("NEXT")}
        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
      >
        Next
      </button>
    </div>
    <span className="text-lg font-semibold">{label}</span>
    <div className="flex items-center gap-2">
      <button
        onClick={() => onView("month")}
        className={`px-3 py-1 rounded ${
          view === "month"
            ? "bg-gray-800 text-white"
            : "bg-gray-200 hover:bg-gray-300"
        }`}
      >
        Month
      </button>
      <button
        onClick={() => onView("week")}
        className={`px-3 py-1 rounded ${
          view === "week"
            ? "bg-gray-800 text-white"
            : "bg-gray-200 hover:bg-gray-300"
        }`}
      >
        Week
      </button>
      <button
        onClick={() => onView("day")}
        className={`px-3 py-1 rounded ${
          view === "day"
            ? "bg-gray-800 text-white"
            : "bg-gray-200 hover:bg-gray-300"
        }`}
      >
        Day
      </button>
    </div>
  </div>
);

/**
 * Modal component for displaying event details
 */
export const EventDetailsModal = ({ event, onClose }) => {
  if (!event) return null;

  return (
    <div style={customStyles.modal} onClick={onClose}>
      <div
        style={customStyles.modalContent}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">{event.title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <div className="space-y-3">
          <p>
            <span className="font-semibold">Created by: </span>
            {event.userId?.name || "Unknown User"}
          </p>
          <p>
            <span className="font-semibold">Date: </span>
            {format(event.start, "PPPP")}
          </p>
          <p>
            <span className="font-semibold">Time: </span>
            {format(event.start, "p")} - {format(event.end, "p")}
          </p>
          <p>
            <span className="font-semibold">Category: </span>
            <span
              className="px-2 py-1 rounded text-white text-xs"
              style={{
                backgroundColor:
                  categoryColors[event.category] || categoryColors.default,
              }}
            >
              {event.category || "default"}
            </span>
          </p>
          <p>
            <span className="font-semibold">Type: </span>
            <span className="px-2 py-1 rounded-2xl bg-amber-50" >{event.eventType}</span>
          </p>
          <p>
            <span className="font-semibold">Room: </span>
            <span className="text-blue-800 text-md px-1">{event.room}</span>
          </p>
          {event.createdAt && (
            <p className="text-xs text-gray-500 mt-4">
              Created: {format(new Date(event.createdAt), "PPpp")}
            </p>
          )}
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-black transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Category legend component
 */
export const CategoryLegend = () => (
  <div className="flex flex-wrap gap-3 mb-4">
    {Object.entries(categoryColors).map(([category, color]) => (
      <div key={category} className="flex items-center gap-1">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: color }}
        ></div>
        <span className="text-xs capitalize">{category}</span>
      </div>
    ))}
  </div>
);
