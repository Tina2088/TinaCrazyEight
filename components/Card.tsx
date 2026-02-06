
import React from 'react';
import { CardType, SuitColors } from '../types';

interface CardProps {
  card: CardType;
  hidden?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  playable?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const Card: React.FC<CardProps> = ({ 
  card, 
  hidden = false, 
  onClick, 
  disabled = false, 
  playable = false,
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-12 h-18 text-xs',
    md: 'w-20 h-28 md:w-24 md:h-36 text-sm',
    lg: 'w-28 h-40 md:w-32 md:h-48 text-base'
  };

  if (hidden) {
    return (
      <div 
        className={`${sizeClasses[size]} bg-blue-800 border-2 border-white rounded-lg shadow-lg flex items-center justify-center transition-transform hover:-translate-y-2`}
      >
        <div className="w-full h-full p-1 opacity-20 overflow-hidden">
            <div className="grid grid-cols-3 gap-1">
                {Array.from({length: 20}).map((_, i) => (
                    <div key={i} className="w-2 h-2 bg-white rounded-full"></div>
                ))}
            </div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${sizeClasses[size]} 
        bg-white border border-gray-300 rounded-lg shadow-md flex flex-col justify-between p-2 md:p-3
        transition-all duration-200 
        ${disabled ? 'cursor-not-allowed opacity-90' : 'cursor-pointer'}
        ${playable ? 'ring-4 ring-yellow-400 -translate-y-4 shadow-2xl' : 'hover:-translate-y-1'}
      `}
    >
      <div className={`flex flex-col items-start leading-none ${SuitColors[card.suit]}`}>
        <span className="font-bold text-lg">{card.rank}</span>
        <span className="text-xl">{card.suit}</span>
      </div>
      
      <div className={`text-4xl self-center ${SuitColors[card.suit]}`}>
        {card.suit}
      </div>
      
      <div className={`flex flex-col items-end leading-none rotate-180 ${SuitColors[card.suit]}`}>
        <span className="font-bold text-lg">{card.rank}</span>
        <span className="text-xl">{card.suit}</span>
      </div>
    </button>
  );
};

export default Card;
