import React from 'react';

const Notepad = () => {
  return (
    <div className="w-full h-full bg-white">
      <textarea
        className="w-full h-full p-2 border-0 resize-none focus:outline-none font-mono text-sm"
        placeholder="开始输入..."
      />
    </div>
  );
};

export default Notepad;