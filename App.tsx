import React, { useState, useCallback } from 'react';
import Desktop from './components/Desktop';
import Taskbar from './components/Taskbar';
import Window from './components/Window';
import ContextMenu from './components/ContextMenu';
import { APPS } from './constants';
import Settings from './apps/Settings';

const wallpapers = [
  './wallpapers/img1.jpg',
  './wallpapers/img2.jpg',
  './wallpapers/img3.jpg',
  './wallpapers/img4.jpg',
];

const App = () => {
  const [openWindows, setOpenWindows] = useState([]);
  const [nextZIndex, setNextZIndex] = useState(1);
  const [wallpaperIndex, setWallpaperIndex] = useState(0);
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    items: [],
  });

  const handleOpenApp = useCallback((appId) => {
    setOpenWindows(currentWindows => {
      const existingWindow = currentWindows.find(win => win.id === appId);
      if (existingWindow) {
        if (existingWindow.isMinimized) {
            return currentWindows.map(win =>
                win.id === appId ? { ...win, isMinimized: false, zIndex: nextZIndex } : win
            );
        }
        return currentWindows.map(win =>
          win.id === appId ? { ...win, zIndex: nextZIndex } : win
        );
      }
      
      const app = APPS.find(app => app.id === appId);
      if (app) {
        return [...currentWindows, { ...app, zIndex: nextZIndex, isMinimized: false }];
      }
      return currentWindows;
    });
    setNextZIndex(z => z + 1);
  }, [nextZIndex]);

  const handleCloseApp = (windowId) => {
    setOpenWindows(windows => windows.filter(win => win.id !== windowId));
  };

  const handleMinimizeApp = (windowId) => {
    setOpenWindows(windows => windows.map(win =>
      win.id === windowId ? { ...win, isMinimized: true } : win
    ));
  };
  
  const handleToggleMinimize = (windowId) => {
      const win = openWindows.find(w => w.id === windowId);
      if (!win) return;

      if (win.isMinimized) {
          handleFocusApp(windowId);
      } else {
          const highestZIndex = Math.max(...openWindows.filter(w => !w.isMinimized).map(w => w.zIndex), 0);
          if (win.zIndex === highestZIndex) {
              handleMinimizeApp(windowId);
          } else {
              handleFocusApp(windowId);
          }
      }
  };

  const handleFocusApp = (windowId) => {
    setOpenWindows(windows => windows.map(win =>
      win.id === windowId ? { ...win, zIndex: nextZIndex, isMinimized: false } : win
    ));
    setNextZIndex(z => z + 1);
  };
  
  const handleChangeBackground = () => {
    setWallpaperIndex(i => (i + 1) % wallpapers.length);
  };

  const handleCloseContextMenu = () => {
    setContextMenu(prev => ({ ...prev, visible: false }));
  };
  
  const handleContextMenu = (e) => {
    e.preventDefault();
    
    const desktopMenuItems = [
        {
            label: '更改背景',
            onClick: handleChangeBackground
        },
        {
            label: '新建文件夹 (模拟)',
            onClick: () => alert('文件夹已创建! (模拟)')
        }
    ];

    setContextMenu({
        visible: true,
        x: e.clientX,
        y: e.clientY,
        items: desktopMenuItems,
    });
  };

  const handleGlobalClick = () => {
    if (contextMenu.visible) {
      handleCloseContextMenu();
    }
  };

  return (
    <div
      className="h-screen w-screen bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: `url(${wallpapers[wallpaperIndex]})` }}
      onClick={handleGlobalClick}
    >
      <Desktop onOpenApp={handleOpenApp} onContextMenu={handleContextMenu} />
      
      {openWindows.map(win => {
        const AppToRender = win.component;
        const props = win.id === 'settings' ? { onChangeBackground: handleChangeBackground } : {};
        
        return (
          <Window
            key={win.id}
            id={win.id}
            title={win.title}
            icon={win.icon}
            zIndex={win.zIndex}
            isMinimized={win.isMinimized}
            onClose={handleCloseApp}
            onMinimize={handleMinimizeApp}
            onFocus={handleFocusApp}
            initialSize={win.defaultSize}
            contentClassName={win.contentClassName}
          >
            <AppToRender {...props} />
          </Window>
        );
      })}

      {contextMenu.visible && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={contextMenu.items}
          onClose={handleCloseContextMenu}
        />
      )}

      <Taskbar openWindows={openWindows} onToggleMinimize={handleToggleMinimize}/>
    </div>
  );
};

export default App;
