import React, { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { WindowInstance } from '../types/os';

const Calculator: React.FC<{ window: WindowInstance }> = () => {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const clear = () => {
    setDisplay('0');
    setPrevValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDot = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (prevValue === null) {
      setPrevValue(inputValue);
    } else if (operation) {
      const currentValue = prevValue || 0;
      let newValue = currentValue;

      switch (operation) {
        case '+': newValue = currentValue + inputValue; break;
        case '-': newValue = currentValue - inputValue; break;
        case '*': newValue = currentValue * inputValue; break;
        case '/': newValue = currentValue / inputValue; break;
      }

      setPrevValue(newValue);
      setDisplay(String(newValue));
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const buttons = [
    ['AC', 'C', '%', '/'],
    ['7', '8', '9', '*'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '=']
  ];

  return (
    <div className="h-full bg-[#1c1c1c] flex flex-col p-4 gap-4 select-none">
      <div className="flex-1 flex items-end justify-end text-5xl font-light px-2 overflow-hidden text-white/90">
        {display}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {buttons.flat().map((btn) => (
          <button
            key={btn}
            onClick={() => {
              if (btn === 'AC' || btn === 'C') clear();
              else if (btn === '=') performOperation('=');
              else if (['+', '-', '*', '/'].includes(btn)) performOperation(btn);
              else if (btn === '.') inputDot();
              else inputDigit(btn);
            }}
            className={twMerge(
              "h-12 rounded-full text-lg font-medium transition-colors flex items-center justify-center",
              ['+', '-', '*', '/', '='].includes(btn) 
                ? "bg-orange-500 hover:bg-orange-400 text-white" 
                : btn === 'AC' || btn === 'C' || btn === '%'
                ? "bg-gray-400 hover:bg-gray-300 text-black"
                : "bg-white/10 hover:bg-white/20 text-white",
              btn === '0' && "col-span-2 aspect-auto px-6 justify-start"
            )}
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Calculator;
