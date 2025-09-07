import React from 'react';
import Notepad from './apps/Notepad';
import Browser from './apps/Browser';
import Settings from './apps/Settings';
import FileExplorer from './apps/FileExplorer';
import Calculator from './apps/Calculator';
import SnakeGame from './apps/SnakeGame';
import TicTacToe from './apps/TicTacToe';
import XboxGameBar from './apps/XboxGameBar';
import WSL from './apps/WSL';
import { 
  NotepadIcon, 
  BrowserIcon, 
  SettingsIcon, 
  FileExplorerIcon, 
  CalculatorIcon,
  SnakeGameIcon,
  TicTacToeIcon,
  XboxIcon,
  WSLIcon
} from './components/Icons';

export const APPS = [
  {
    id: 'notepad',
    title: '记事本',
    // FIX: Replaced JSX syntax with React.createElement to avoid parsing issues in a .ts file.
    icon: React.createElement(NotepadIcon),
    component: Notepad,
  },
  {
    id: 'browser',
    title: '浏览器',
    // FIX: Replaced JSX syntax with React.createElement to avoid parsing issues in a .ts file.
    icon: React.createElement(BrowserIcon),
    component: Browser,
  },
  {
    id: 'wsl',
    title: 'Ubuntu',
    icon: React.createElement(WSLIcon),
    component: WSL,
    defaultSize: { width: 720, height: 480 },
    contentClassName: 'bg-transparent',
  },
  {
    id: 'settings',
    title: '设置',
    // FIX: Replaced JSX syntax with React.createElement to avoid parsing issues in a .ts file.
    icon: React.createElement(SettingsIcon),
    component: Settings,
  },
  {
    id: 'file-explorer',
    title: '文件资源管理器',
    // FIX: Replaced JSX syntax with React.createElement to avoid parsing issues in a .ts file.
    icon: React.createElement(FileExplorerIcon),
    component: FileExplorer,
  },
  {
    id: 'calculator',
    title: '计算器',
    icon: React.createElement(CalculatorIcon),
    component: Calculator,
  },
  {
    id: 'snake-game',
    title: '贪吃蛇',
    icon: React.createElement(SnakeGameIcon),
    component: SnakeGame,
    defaultSize: { width: 440, height: 520 },
  },
  {
    id: 'tic-tac-toe',
    title: '井字棋',
    icon: React.createElement(TicTacToeIcon),
    component: TicTacToe,
    defaultSize: { width: 320, height: 400 },
  },
  {
    id: 'xbox-game-bar',
    title: 'Xbox Game Bar',
    icon: React.createElement(XboxIcon),
    component: XboxGameBar,
    defaultSize: { width: 750, height: 130 },
    contentClassName: 'bg-transparent',
  },
];