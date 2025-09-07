import React from 'react';
import AppIcon from './AppIcon';
import { APPS } from '../constants';

const Desktop = ({ onOpenApp, onContextMenu }) => {
  return (
    <div
      className="absolute top-0 left-0 h-full w-full p-4"
      onContextMenu={onContextMenu}
    >
      <div className="flex flex-col flex-wrap h-full content-start">
        {APPS.map(app => (
          <AppIcon
            key={app.id}
            title={app.title}
            icon={app.icon}
            onDoubleClick={() => onOpenApp(app.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Desktop;
