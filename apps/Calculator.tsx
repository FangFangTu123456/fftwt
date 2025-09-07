import React, { useState } from 'react';

const CalculatorButton = ({ onClick, children, className = '' }) => (
  <button
    onClick={onClick}
    className={`bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 rounded-lg text-xl transition-colors duration-150 ${className}`}
  >
    {children}
  </button>
);

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [currentValue, setCurrentValue] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(true);

  const handleNumberClick = (number) => {
    if (waitingForOperand) {
      setDisplay(String(number));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? String(number) : display + number);
    }
  };

  const handleDecimalClick = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleOperatorClick = (nextOperator) => {
    const inputValue = parseFloat(display);

    if (currentValue === null) {
      setCurrentValue(inputValue);
    } else if (operator) {
      const result = performCalculation();
      setCurrentValue(result);
      setDisplay(String(result));
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };
  
  const performCalculation = () => {
    const inputValue = parseFloat(display);
    if (currentValue === null || operator === null) return inputValue;
    
    const calculations = {
      '/': (prev, next) => prev / next,
      '*': (prev, next) => prev * next,
      '-': (prev, next) => prev - next,
      '+': (prev, next) => prev + next,
      '=': (prev, next) => next,
    };
    
    return calculations[operator](currentValue, inputValue);
  };

  const handleEqualsClick = () => {
    if (operator === null || currentValue === null) return;
    const result = performCalculation();
    setDisplay(String(result));
    setCurrentValue(result);
    setOperator(null);
    setWaitingForOperand(true);
  };

  const handleClearClick = () => {
    setDisplay('0');
    setCurrentValue(null);
    setOperator(null);
    setWaitingForOperand(true);
  };

  return (
    <div className="w-full h-full bg-gray-800 p-2 flex flex-col">
      <div className="bg-gray-900 text-white text-right p-4 rounded-lg mb-2 text-5xl font-light break-all">
        {display}
      </div>
      <div className="grid grid-cols-4 gap-2 flex-grow">
        <CalculatorButton onClick={handleClearClick} className="bg-gray-500 hover:bg-gray-400">C</CalculatorButton>
        <CalculatorButton onClick={() => handleOperatorClick('/')} className="bg-gray-600 hover:bg-gray-500">÷</CalculatorButton>
        <CalculatorButton onClick={() => handleOperatorClick('*')} className="bg-gray-600 hover:bg-gray-500">×</CalculatorButton>
        <CalculatorButton onClick={() => handleOperatorClick('-')} className="bg-gray-600 hover:bg-gray-500">-</CalculatorButton>
        
        <CalculatorButton onClick={() => handleNumberClick(7)}>7</CalculatorButton>
        <CalculatorButton onClick={() => handleNumberClick(8)}>8</CalculatorButton>
        <CalculatorButton onClick={() => handleNumberClick(9)}>9</CalculatorButton>
        <CalculatorButton onClick={() => handleOperatorClick('+')} className="row-span-2 bg-gray-600 hover:bg-gray-500">+</CalculatorButton>

        <CalculatorButton onClick={() => handleNumberClick(4)}>4</CalculatorButton>
        <CalculatorButton onClick={() => handleNumberClick(5)}>5</CalculatorButton>
        <CalculatorButton onClick={() => handleNumberClick(6)}>6</CalculatorButton>
        
        <CalculatorButton onClick={() => handleNumberClick(1)}>1</CalculatorButton>
        <CalculatorButton onClick={() => handleNumberClick(2)}>2</CalculatorButton>
        <CalculatorButton onClick={() => handleNumberClick(3)}>3</CalculatorButton>
        <CalculatorButton onClick={handleEqualsClick} className="row-span-2 bg-blue-500 hover:bg-blue-400">=</CalculatorButton>

        <CalculatorButton onClick={() => handleNumberClick(0)} className="col-span-2">0</CalculatorButton>
        <CalculatorButton onClick={handleDecimalClick}>.</CalculatorButton>
      </div>
    </div>
  );
};

export default Calculator;