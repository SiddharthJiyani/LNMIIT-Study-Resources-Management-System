// NotFound.js
import React from 'react';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800 dark:text-white dark:bg-gray-900">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-xl mt-4">Page Not Found</p>
      <p className="text-sm mt-2">Sorry, the page you are looking for does not exist.</p>
    </div>
  );
};

export default NotFound;
