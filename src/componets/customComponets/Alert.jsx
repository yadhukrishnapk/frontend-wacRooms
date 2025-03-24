import React, { useState, useEffect } from "react";

const CustomAlert = ({ isOpen, onClose, title, message }) => {
    const [isVisible, setIsVisible] = useState(false);
    
    useEffect(() => {
      if (isOpen) {
        setIsVisible(true);
        const timer = setTimeout(() => {
          handleClose();
        }, 3000);
        return () => clearTimeout(timer);
      }
    }, [isOpen]);
  
    const handleClose = () => {
      setIsVisible(false);
      setTimeout(() => {
        onClose();
      }, 300); 
    };
  
    if (!isOpen) return null;
  
    return (
      <div 
        className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      >
        <div className="absolute inset-0 bg-opacity-30" />
        <div 
          className="bg-white border-2 border-black shadow-lg p-6 m-4 max-w-sm w-full transform transition-transform duration-300 ease-in-out"
          style={{ 
            boxShadow: '6px 6px 0px rgba(0,0,0,1)',
            transform: isVisible ? 'translateY(0)' : 'translateY(-20px)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">{title}</h3>
            <button 
              onClick={handleClose}
              className="border border-black w-6 h-6 flex items-center justify-center hover:bg-black hover:text-white transition-colors"
            >
              ×
            </button>
          </div>
          <div className="text-sm border-t border-black pt-4">{message}</div>
        </div>
      </div>
    );
  };

export default CustomAlert;