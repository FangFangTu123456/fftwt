import React, { useState } from 'react';

const Browser = () => {
  const [url, setUrl] = useState('https://www.google.com/webhp?igu=1');
  const [inputValue, setInputValue] = useState('https://www.google.com/webhp?igu=1');

  const handleGo = (e) => {
    e.preventDefault();
    let finalUrl = inputValue;
    if (!finalUrl.startsWith('http')) {
        finalUrl = `https://${finalUrl}`;
    }
    setUrl(finalUrl);
  };

  return (
    <div className="w-full h-full flex flex-col bg-gray-100">
      <div className="p-1 bg-gray-200">
        <form onSubmit={handleGo} className="flex">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-grow px-2 py-1 text-sm border rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="https://example.com"
          />
          <button type="submit" className="px-3 py-1 bg-blue-500 text-white text-sm rounded-r-md hover:bg-blue-600">
            转到
          </button>
        </form>
      </div>
      <iframe src={url} className="w-full h-full border-0" title="Browser" sandbox="allow-scripts allow-same-origin allow-forms allow-popups"></iframe>
    </div>
  );
};

export default Browser;