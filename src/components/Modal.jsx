import React from 'react';

const Modal = ({ children, id, onClose }) => {
  return (
    <div id={id} className="modal bg-white rounded-xl shadow-2xl w-full max-w-lg">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <h3 className="text-xl font-bold">Create a New ISO</h3>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <i data-lucide="x" className="w-6 h-6"></i>
        </button>
      </div>
      {children}
    </div>
  );
};

export default Modal;
