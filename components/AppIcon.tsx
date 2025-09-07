import React from 'react';

const AppIcon = ({ title, icon, onDoubleClick }) => {
  return (
    <div
      className="flex flex-col items-center justify-center w-24 h-24 p-2 rounded-lg hover:bg-white/20 transition-colors duration-150 cursor-pointer"
      onDoubleClick={onDoubleClick}
    >
      <div className="w-10 h-10 mb-1">{icon}</div>
      <p className="text-white text-xs text-center select-none shadow-black/50" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.7)'}}>{title}</p>
    </div>
  );
};

export default AppIcon;