import React from 'react';

const Loading = () => {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='w-16 h-16 border-4 border-gray-300 border-t-blue-400 rounded-full animate-spin'></div>
    </div>
  );
};

export default Loading;