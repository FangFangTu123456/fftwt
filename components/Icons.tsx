import React from 'react';

const IconWrapper = ({ children, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    width="1em"
    height="1em"
  >
    {children}
  </svg>
);

export const NotepadIcon = ({ className = "w-full h-full" }) => (
    <IconWrapper className={className}>
        <path d="M19,3H5C3.89,3,3,3.9,3,5V19C3,20.1,3.9,21,5,21H19C20.1,21,21,20.1,21,19V5C21,3.9,20.1,3,19,3M14,17H7V15H14V17M17,13H7V11H17V13M17,9H7V7H17V9Z" />
    </IconWrapper>
);

export const BrowserIcon = ({ className = "w-full h-full" }) => (
    <IconWrapper className={className}>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
    </IconWrapper>
);

export const SettingsIcon = ({ className = "w-full h-full" }) => (
    <IconWrapper className={className}>
        <path d="M19.44 12.99l-2.73-1.34c-.1-.05-.16-.14-.18-.25l-.23-1.63c-.04-.28-.24-.5-.52-.58l-1.68-.48c-.11-.03-.21-.1-.28-.19l-1.16-1.16c-.21-.21-.5-.33-.8-.33s-.59.12-.8.33l-1.16 1.16c-.07.09-.17.16-.28-.19l-1.68.48c-.28.08-.48.3-.52.58l-.23 1.63c-.02.11-.08.2-.18-.25l-2.73 1.34c-.23.11-.36.36-.36.62s.13.51.36.62l2.73 1.34c.1.05.16.14.18.25l.23 1.63c.04.28.24.5.52.58l1.68.48c.11.03.21.1.28.19l1.16 1.16c.21.21.5.33.8.33s.59-.12-.8.33l1.16-1.16c.07-.09-.17-.16-.28-.19l1.68-.48c.28-.08.48-.3.52.58l.23-1.63c.02-.11.08-.2.18-.25l2.73-1.34c.23-.11.36-.36-.36.62s-.13-.51-.36-.62zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" />
    </IconWrapper>
);

export const FileExplorerIcon = ({ className = "w-full h-full" }) => (
    <IconWrapper className={className}>
        <path d="M10 4H4c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
    </IconWrapper>
);

export const CalculatorIcon = ({ className = "w-full h-full" }) => (
  <IconWrapper className={className}>
    <path d="M7,2H17A2,2 0 0,1 19,4V20A2,2 0 0,1 17,22H7A2,2 0 0,1 5,20V4A2,2 0 0,1 7,2M7,6V8H17V6H7M7,10V12H11V10H7M7,14V16H11V14H7M13,10V16H17V10H13Z" />
  </IconWrapper>
);

export const WindowsIcon = ({ className = "w-6 h-6" }) => (
    <IconWrapper className={className}>
        <path d="M3 3h8v8H3zm0 10h8v8H3zM13 3h8v8h-8zm0 10h8v8h-8z" />
    </IconWrapper>
);

export const SnakeGameIcon = ({ className = "w-full h-full" }) => (
  <IconWrapper className={className}>
    <path d="M14,4C14,2.9 13.1,2 12,2S10,2.9 10,4V6H12V16H10V18H12C13.1,18 14,17.1 14,16V14H16C17.1,14 18,13.1 18,12V6C18,4.9 17.1,4 16,4H14M16,12H14V6H16V12M8,8V10H6V12H8V14H4V10C4,8.9 4.9,8 6,8H8Z" />
  </IconWrapper>
);

export const TicTacToeIcon = ({ className = "w-full h-full" }) => (
  <IconWrapper className={className}>
    <path d="M6,2V8H2V6H0V2H6M2,4H4V6H2V4M14.5,2C15.9,2 17,3.1 17,4.5V11H19V2H21V6H23V2H14.5M19,4H21V2H19V4M9,14V23H11V18H13V23H15V14H9M11,16H13V14H11V16M8,22H2V16H8V14H0V22H8V20H6V18H8V22Z" />
  </IconWrapper>
);

export const XboxIcon = ({ className = "w-full h-full" }) => (
    <IconWrapper className={className}>
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zM8.65 7.35a.5.5 0 00-.7.7L11.293 12l-3.342 3.95a.5.5 0 00.7.7L12 12.707l3.35 3.943a.5.5 0 00.7-.7L12.707 12l3.342-3.95a.5.5 0 00-.7-.7L12 11.293 8.65 7.35z" fill="#107C10"/>
    </IconWrapper>
  );

export const WSLIcon = ({ className = "w-full h-full" }) => (
    <IconWrapper className={className}>
      <g fill="#E95420">
        <path d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10,10-4.48,10-10S17.52,2,12,2z M12,20c-4.41,0-8-3.59-8-8s3.59-8,8-8s8,3.59,8,8S16.41,20,12,20z"/>
        <circle cx="12" cy="6.5" r="1.5" />
        <circle cx="6.5" cy="12" r="1.5" />
        <circle cx="17.5" cy="12" r="1.5" />
      </g>
    </IconWrapper>
  );