import React from 'react';

export const Spinner: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 z-50 flex justify-center items-center">
     
      <div className="animate-spin rounded-full h-12 w-12 border-2 border-t-transparent border-gray-700"></div>
    </div>
  );
};
