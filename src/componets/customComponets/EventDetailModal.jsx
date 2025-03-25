// EventDetailModal.jsx
import React, { useState } from 'react';
import moment from 'moment';
import { useAuth } from '../../hooks/useAuth';
import CustomAlert from './Alert';

const EventDetailModal = ({ 
  isOpen, 
  onClose, 
  event, 
  onDelete, 
  onEdit,
}) => {
  const { user } = useAuth();
  const isCreator = event?.userId?._id === user?.id;
  const [showSuccess, setShowSuccess] = useState(false);

  const handleEdit = async (event) => {
    try {
      await onEdit(event);
      setShowSuccess(true);
      setTimeout(onClose, 3000);
    } catch (error) {
      console.error('Error editing event:', error);
    }
  };

  if (!isOpen || !event) return null;

  return (
    <>
      <div 
        className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-90"
        onClick={onClose}
      >
        <div 
          className="bg-white border-2 border-black shadow-lg p-6 m-4 max-w-sm w-full"
          style={{ boxShadow: '6px 6px 0px rgba(0,0,0,1)' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Event Details</h3>
            <button 
              onClick={onClose}
              className="border border-black w-6 h-6 flex items-center justify-center hover:bg-black hover:text-white transition-colors"
            >
              ×
            </button>
          </div>
          <div className="text-sm space-y-2">
            <p><strong>Title:</strong> {event.title}</p>
            <p><strong>Category:</strong> {event.category || 'N/A'}</p>
            <p><strong>Type:</strong> {event.eventType}</p>
            <p><strong>Start:</strong> {moment(event.start).format('LLL')}</p>
            <p><strong>End:</strong> {moment(event.end).format('LLL')}</p>
            <p><strong>Created By:</strong> {event.userId?.name || 'Unknown'}</p>
          </div>
          {isCreator && (
            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={() => handleEdit(event)}
                className="px-4 py-2 border border-black hover:bg-gray-100"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(event._id)}
                className="px-4 py-2 border border-black bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      <CustomAlert
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Success!"
        message="Event has been updated successfully"
      />
    </>
  );
};

export default EventDetailModal;