import React from 'react';
import { WindowsIcon } from './Icons';

const Taskbar = ({ openWindows, onToggleMinimize }) => {
  const isWindowActive = (win) => {
    if (win.isMinimized) return false;
    const highestZIndex = Math.max(...openWindows.filter(w => !w.isMinimized).map(w => w.zIndex), 0);
    return win.zIndex === highestZIndex;
  };

  return (
    <div className="absolute bottom-0 left-0 w-full h-12 flex justify-center items-center">
      <div className="bg-slate-200/50 backdrop-blur-xl rounded-lg h-10 px-4 flex items-center space-x-2">
        <button className="p-2 hover:bg-white/30 rounded-md">
          <WindowsIcon />
        </button>

        {openWindows.map(win => (
          <button
            key={win.id}
            onClick={() => onToggleMinimize(win.id)}
            className="relative flex items-center justify-center w-8 h-8"
            title={win.title}
          >
            {React.cloneElement(win.icon, { className: "w-6 h-6" })}
            <div
              className={`absolute bottom-0 h-1 w-4 bg-blue-500 rounded-full transition-opacity duration-200 ${
                isWindowActive(win) ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default Taskbar;