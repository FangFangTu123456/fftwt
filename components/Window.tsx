import React, { useState, useRef, useEffect } from 'react';

const Window = ({
  id,
  icon,
  title,
  children,
  onClose,
  onMinimize,
  onFocus,
  zIndex,
  isMinimized,
  initialSize,
  contentClassName,
}) => {
  const [position, setPosition] = useState({ x: 100 + Math.random() * 200, y: 100 + Math.random() * 100 });
  const [size, setSize] = useState(initialSize || { width: 640, height: 480 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const windowEl = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      setPosition({
        x: e.clientX - dragStartPos.current.x,
        y: e.clientY - dragStartPos.current.y,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleMouseDownOnHeader = (e) => {
    // Only drag if the mousedown event is on the header itself, not on buttons
    if (e.target !== e.currentTarget) return;
    onFocus(id);
    setIsDragging(true);
    const rect = windowEl.current.getBoundingClientRect();
    dragStartPos.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  if (isMinimized) {
    return null;
  }

  return (
    <div
      ref={windowEl}
      className="absolute bg-white/50 backdrop-blur-xl border border-gray-400/50 rounded-lg shadow-2xl flex flex-col"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        zIndex,
      }}
      onMouseDown={() => onFocus(id)}
    >
      <div
        className="h-8 bg-slate-200/60 rounded-t-lg flex items-center justify-between px-2 cursor-grab"
        onMouseDown={handleMouseDownOnHeader}
      >
        <div className="flex items-center pointer-events-none">
          <div className="w-5 h-5 mr-2">{React.cloneElement(icon, { className: "w-full h-full" })}</div>
          <span className="text-sm font-semibold select-none">{title}</span>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={() => onMinimize(id)} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/30 text-center font-bold">_</button>
          <button className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/30 text-center font-bold">□</button>
          <button onClick={() => onClose(id)} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-500 hover:text-white text-center font-bold">×</button>
        </div>
      </div>
      <div className={`flex-grow overflow-hidden ${contentClassName || 'bg-white'}`}>
        {children}
      </div>
    </div>
  );
};

export default Window;
