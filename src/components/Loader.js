// src/components/Loader.js
import React from 'react';

const Loader = ({ size = '16', color = 'indigo', text = '' }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="text-center">
        <div
          className={`animate-spin rounded-full h-${size} w-${size} border-t-4 border-b-4 border-${color}-500`}
        ></div>
        {text && <p className="mt-4 text-white">{text}</p>}
      </div>
    </div>
  );
};

export default Loader;