import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import moment from "moment";
import { post } from "../../apiServices/apiServices";

const EventModal = ({
  isOpen,
  onClose,
  onSave,
  initialStart,
  initialEnd,
  room,
  userId,
  editingEvent,
  events,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    category: "default",
    start: moment(initialStart).format("YYYY-MM-DDTHH:mm"),
    end: moment(initialEnd).format("YYYY-MM-DDTHH:mm"),
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingEvent) {
      setFormData({
        title: editingEvent.title || "",
        category: editingEvent.category || "default",
        start: moment(editingEvent.start).format("YYYY-MM-DDTHH:mm"),
        end: moment(editingEvent.end).format("YYYY-MM-DDTHH:mm"),
      });
    } else {
      setFormData({
        title: "",
        category: "default",
        start: moment(initialStart).format("YYYY-MM-DDTHH:mm"),
        end: moment(initialEnd).format("YYYY-MM-DDTHH:mm"),
      });
    }
  }, [editingEvent, initialStart, initialEnd]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const eventData = {
      title: formData.title,
      start: new Date(formData.start),
      end: new Date(formData.end),
      category: formData.category,
      room,
      userId,
    };

    const isConflict = events.some(event => {
      if (editingEvent && event._id === editingEvent._id) {
        return false; // Skip checking for the current event during edit
      }
    
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      const newStart = new Date(formData.start);
      const newEnd = new Date(formData.end);
    
      return (
        (newStart >= eventStart && newStart < eventEnd) ||
        (newEnd > eventStart && newEnd <= eventEnd) ||
        (newStart <= eventStart && newEnd >= eventEnd)
      );
    });

    if (isConflict) {
      setError("Selected time frame conflicts with an existing event.");
      setLoading(false);
      return;
    }

    try {
      if (editingEvent) {
        await post(`/event/update/${editingEvent._id}`, eventData);
        onSave({ ...editingEvent, ...eventData });
      } else {
        const response = await post("/event/create", eventData);
        onSave({ ...eventData, id: response.event._id });
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save event");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white border border-black w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b border-black">
          <h2 className="text-xl font-normal text-black tracking-tight uppercase">
            Add New Event
          </h2>
          <button
            onClick={() => {
              setError(null); // Clear the error when closing the modal
              onClose();
            }}
            className="text-black hover:text-gray-600"
            disabled={loading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}

          <div className="mb-6">
            <label className="block text-xs uppercase tracking-wider text-gray-900 mb-2">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full py-2 px-3 border border-black focus:outline-none focus:ring-0 bg-white"
              required
              disabled={loading}
            />
          </div>

          <div className="mb-6">
            <label className="block text-xs uppercase tracking-wider text-gray-900 mb-2">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full py-2 px-3 border border-black focus:outline-none focus:ring-0 bg-white appearance-none"
              disabled={loading}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 10px center",
              }}
            >
              <option value="default">Default</option>
              <option value="work">Work</option>
              <option value="important">Important</option>
              <option value="meeting">Meeting</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-xs uppercase tracking-wider text-gray-900 mb-2">
              Start Time
            </label>
            <input
              type="datetime-local"
              name="start"
              value={formData.start}
              onChange={handleChange}
              className="w-full py-2 px-3 border border-black focus:outline-none focus:ring-0 bg-white"
              required
              disabled={loading}
            />
          </div>

          <div className="mb-8">
            <label className="block text-xs uppercase tracking-wider text-gray-900 mb-2">
              End Time
            </label>
            <input
              type="datetime-local"
              name="end"
              value={formData.end}
              onChange={handleChange}
              className="w-full py-2 px-3 border border-black focus:outline-none focus:ring-0 bg-white"
              required
              disabled={loading}
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-xs font-medium uppercase tracking-wider text-black border border-black hover:bg-gray-100 focus:outline-none disabled:opacity-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-medium uppercase tracking-wider text-white bg-black border border-black hover:bg-gray-800 focus:outline-none disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;
