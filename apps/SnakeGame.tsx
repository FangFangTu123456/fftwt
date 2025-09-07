import React, { useState, useEffect, useRef } from 'react';

const TILE_SIZE = 20;
const BOARD_WIDTH = 20;
const BOARD_HEIGHT = 20;
const BOARD_SIZE = { width: BOARD_WIDTH * TILE_SIZE, height: BOARD_HEIGHT * TILE_SIZE };

const getRandomCoord = () => ({
  x: Math.floor(Math.random() * BOARD_WIDTH),
  y: Math.floor(Math.random() * BOARD_HEIGHT),
});

const SnakeGame = () => {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState(getRandomCoord());
  const [direction, setDirection] = useState({ x: 0, y: -1 }); // Start moving up
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const gameLoopTimeout = useRef(null);

  const restartGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(getRandomCoord());
    setDirection({ x: 0, y: -1 });
    setGameOver(false);
    setScore(0);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      e.preventDefault();
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (gameOver) {
      if(gameLoopTimeout.current) clearTimeout(gameLoopTimeout.current);
      return;
    }
    
    gameLoopTimeout.current = setTimeout(() => {
      const newSnake = [...snake];
      const head = { x: newSnake[0].x + direction.x, y: newSnake[0].y + direction.y };

      // Wall collision
      if (head.x < 0 || head.x >= BOARD_WIDTH || head.y < 0 || head.y >= BOARD_HEIGHT) {
        setGameOver(true);
        return;
      }
      
      // Self collision
      for (let i = 1; i < newSnake.length; i++) {
        if (head.x === newSnake[i].x && head.y === newSnake[i].y) {
          setGameOver(true);
          return;
        }
      }

      newSnake.unshift(head);

      // Food collision
      if (head.x === food.x && head.y === food.y) {
        setScore(s => s + 1);
        setFood(getRandomCoord());
      } else {
        newSnake.pop();
      }

      setSnake(newSnake);
    }, 150 - score * 2); // Speed up as score increases

    return () => clearTimeout(gameLoopTimeout.current);
  }, [snake, direction, gameOver, food, score]);

  return (
    <div className="w-full h-full bg-gray-800 flex flex-col items-center justify-center p-4">
      <div className="flex justify-between w-full max-w-sm mb-4 text-white">
        <h2 className="text-xl font-bold">贪吃蛇</h2>
        <div className="text-xl">得分: {score}</div>
      </div>
      <div
        className="relative bg-gray-900"
        style={{ width: BOARD_SIZE.width, height: BOARD_SIZE.height, border: '1px solid #4a5568' }}
      >
        {snake.map((segment, index) => (
          <div
            key={index}
            className="absolute bg-green-500"
            style={{ left: segment.x * TILE_SIZE, top: segment.y * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE }}
          />
        ))}
        <div
          className="absolute bg-red-500 rounded-full"
          style={{ left: food.x * TILE_SIZE, top: food.y * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE }}
        />
        {gameOver && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white">
            <div className="text-4xl font-bold mb-4">游戏结束</div>
            <button
              onClick={restartGame}
              className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
            >
              重新开始
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SnakeGame;