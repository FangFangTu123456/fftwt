import React from 'react';

const ContextMenu = ({ x, y, items, onClose }) => {
  const style = {
      top: `${y}px`,
      left: `${x}px`,
  };

  const handleItemClick = (e, item) => {
    e.stopPropagation();
    item.onClick();
    onClose();
  };

  return (
    <div
      className="absolute bg-slate-200/80 backdrop-blur-xl border border-gray-400/50 rounded-lg shadow-2xl py-1 z-[1000]"
      style={style}
      onClick={(e) => e.stopPropagation()}
    >
      <ul>
        {items.map((item, index) => (
          <li
            key={index}
            onClick={(e) => handleItemClick(e, item)}
            className="px-4 py-1.5 text-sm text-gray-800 hover:bg-blue-500 hover:text-white cursor-pointer select-none"
          >
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContextMenu;
