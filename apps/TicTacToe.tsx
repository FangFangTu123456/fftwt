import React, { useState } from 'react';

const Square = ({ value, onSquareClick }) => (
  <button
    className="w-20 h-20 bg-gray-700 border-2 border-gray-600 text-white text-4xl font-bold flex items-center justify-center leading-none"
    onClick={onSquareClick}
  >
    {value}
  </button>
);

const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]             // diagonals
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

const TicTacToe = () => {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const winner = calculateWinner(squares);
  const isDraw = !winner && squares.every(Boolean);
  
  let status;
  if (winner) {
    status = `获胜者: ${winner}`;
  } else if (isDraw) {
    status = '平局';
  } else {
    status = `下一位玩家: ${xIsNext ? 'X' : 'O'}`;
  }

  const handleClick = (i) => {
    if (squares[i] || winner) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  };
  
  const handleRestart = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  };

  const renderSquare = (i) => {
    return <Square value={squares[i]} onSquareClick={() => handleClick(i)} />;
  };

  return (
    <div className="w-full h-full bg-gray-800 flex flex-col items-center justify-center p-4">
      <h2 className="text-2xl font-bold text-white mb-4">井字棋</h2>
      <div className="text-xl text-white mb-4">{status}</div>
      <div className="grid grid-cols-3 gap-1">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
      {(winner || isDraw) && (
        <button
          onClick={handleRestart}
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          重新开始
        </button>
      )}
    </div>
  );
};

export default TicTacToe;