
import React, { Fragment } from 'react';

interface ModalProps {
  isOpen: boolean;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-2xl shadow-purple-900/20 max-w-sm w-full animate-fade-in-up">
        {children}
      </div>
    </div>
  );
};

export default Modal;
