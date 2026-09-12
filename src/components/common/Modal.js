"use client";

import React, { useEffect, useRef } from 'react';
import { IoClose } from 'react-icons/io5';

export default function Modal({ isOpen, onClose, children, title }) {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      // Trap focus
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements && focusableElements.length) {
        focusableElements[0].focus();
      }
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal Content */}
      <div 
        ref={modalRef}
        className="relative z-50 bg-white rounded-card p-6 w-full max-w-lg mx-4 md:mx-auto shadow-xl transition-all duration-300 scale-100 opacity-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex items-center justify-between mb-4">
          {title && (
            <h3 id="modal-title" className="font-integral text-xl text-primary font-bold">
              {title}
            </h3>
          )}
          <button
            onClick={onClose}
            className="p-2 text-gray-600 hover:text-primary transition-all duration-300 rounded-full hover:bg-gray-100 ml-auto"
            aria-label="Close modal"
          >
            <IoClose size={24} />
          </button>
        </div>
        <div className="font-satoshi text-primary">
          {children}
        </div>
      </div>
    </div>
  );
}
