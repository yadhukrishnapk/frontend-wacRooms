import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import { dateFnsLocalizer } from "react-big-calendar";

// Configure date-fns localizer
export const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { "en-US": enUS },
});

// Format events data from API
export const formatEvents = (events) => {
  return events.map((event) => ({
    ...event,
    start: new Date(event.start),
    end: new Date(event.end),
    title: event.title || "Untitled Event",
  }));
};

// Category colors for events
export const categoryColors = {
  work: "#3788d8",
  meeting: "#8e44ad",
  important: "#e74c3c",
  default: "#374151",
};

// Event style getter function
export const eventStyleGetter = (event) => {
  const backgroundColor =
    categoryColors[event.category] || categoryColors.default;
  return {
    style: {
      backgroundColor,
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      padding: "2px 5px",
      fontSize: "0.85rem",
    },
  };
};

// Custom styles for calendar components
export const customStyles = {
  container: {
    height: "600px",
    backgroundColor: "#fff",
    border: "1px solid #E5E7EB",
    borderRadius: "8px",
    padding: "10px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  },
  header: {
    color: "#1F2937",
    fontWeight: "bold",
  },
  toolbar: {
    color: "#4B5563",
  },
  selected: {
    backgroundColor: "#D1D5DB",
    color: "#1F2937",
  },
  modal: {
    position: "fixed",
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "20px",
    width: "90%",
    maxWidth: "500px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  },
};

// Helper function for day styling
export const getDayPropGetter = (selectedSlot) => (date) => ({
  style: {
    backgroundColor:
      selectedSlot &&
      date >= selectedSlot.start &&
      date <= selectedSlot.end
        ? customStyles.selected.backgroundColor
        : undefined,
    color:
      selectedSlot &&
      date >= selectedSlot.start &&
      date <= selectedSlot.end
        ? customStyles.selected.color
        : undefined,
  },
});