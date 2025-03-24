export const injectCalendarStyles = () => {
    const styleTag = document.createElement("style");
    styleTag.innerHTML = `
      .rbc-calendar {
        font-family: 'Inter', sans-serif;
        border: 1px solid #000;
      }
      .rbc-month-view, .rbc-time-view {
        border: none;
      }
      .rbc-header {
        padding: 10px 3px;
        font-weight: 400;
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        background-color: #f8f8f8;
        border-bottom: 1px solid #000;
      }
      .rbc-date-cell {
        padding: 6px;
        font-size: 0.75rem;
        font-weight: 400;
      }
      .rbc-date-cell.rbc-now {
        font-weight: 700;
      }
      .rbc-today {
        background-color: #f8f8f8;
      }
      .today-cell {
        position: relative;
      }
      .today-cell:after {
        content: "";
        position: absolute;
        top: 4px;
        right: 4px;
        width: 6px;
        height: 6px;
        background-color: #000;
        border-radius: 50%;
      }
      .rbc-off-range-bg {
        background-color: #fafafa;
      }
      .rbc-event {
        box-shadow: none;
      }
      .rbc-toolbar button {
        text-transform: uppercase;
        letter-spacing: 0.05em;
        font-size: 0.75rem;
      }
      .rbc-time-slot {
        border-top: 1px solid #e5e5e5;
      }
      .rbc-timeslot-group {
        border-bottom: 1px solid #e5e5e5;
      }
      .rbc-time-content {
        border-top: 1px solid #000;
      }
      .rbc-time-header-content {
        border-left: 1px solid #e5e5e5;
      }
      .rbc-day-slot .rbc-time-slot {
        border-top: 1px solid #f0f0f0;
      }
      .rbc-day-slot .rbc-event {
        border: none;
        border-left: 3px solid #000;
        background-color: #f8f8f8;
        color: #000;
      }
      .rbc-day-slot .rbc-event.rbc-selected {
        background-color: #e0e0e0;
      }
      .rbc-show-more {
        font-size: 0.7rem;
        font-weight: 500;
        color: #000;
        text-decoration: underline;
      }
    `;
    document.head.appendChild(styleTag);
    return () => document.head.removeChild(styleTag);
  };
  
  export const eventStyleGetter = (event) => {
    const style = {
      borderRadius: "0",
      border: "1px solid #000",
      padding: "2px 5px",
      fontSize: "0.85rem",
      fontWeight: "500",
    };
  
    const categoryStyles = {
      work: { backgroundColor: "#f5f5f5", color: "#000", borderLeft: "3px solid #000" },
      important: { backgroundColor: "#ed476e", color: "#fff" },
      meeting: { backgroundColor: "#8fadf2", color: "#000", borderLeft: "3px solid #555" },
      default: { backgroundColor: "#f0dcb9", color: "#000", border: "1px dashed #000" },
    };
  
    return {
      style: { ...style, ...categoryStyles[event.category] },
    };
  };
  
  export const dayPropGetter = (date) => {
    const today = new Date();
    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  
    return {
      className: isToday ? "today-cell" : "",
      style: { borderBottom: "1px solid #e5e5e5", borderRight: "1px solid #e5e5e5" },
    };
  };