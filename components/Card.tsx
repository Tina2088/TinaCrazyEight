
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
    sm: 'w-12 h-18 text-[10px]',
    md: 'w-20 h-28 md:w-24 md:h-36 text-sm',
    lg: 'w-28 h-40 md:w-32 md:h-48 text-base'
  };

  // 根据尺寸调整内部文字大小
  const rankSize = size === 'sm' ? 'text-xs' : 'text-base md:text-lg';
  const suitSize = size === 'sm' ? 'text-sm' : 'text-lg md:text-xl';
  const centerSuitSize = size === 'sm' ? 'text-2xl' : 'text-3xl md:text-5xl';

  if (hidden) {
    return (
      <div 
        className={`${sizeClasses[size]} bg-blue-800 border-2 border-white rounded-lg shadow-lg flex items-center justify-center transition-transform hover:-translate-y-2 overflow-hidden`}
      >
        <div className="w-full h-full p-1 opacity-20">
            <div className="grid grid-cols-3 gap-1">
                {Array.from({length: 21}).map((_, i) => (
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
        bg-white border border-gray-300 rounded-lg shadow-md flex flex-col justify-between p-1.5 md:p-2.5
        transition-all duration-200 overflow-hidden relative
        ${disabled ? 'cursor-not-allowed opacity-90' : 'cursor-pointer'}
        ${playable ? 'ring-4 ring-yellow-400 -translate-y-4 shadow-2xl z-20' : 'hover:-translate-y-1'}
      `}
    >
      {/* 左上角 */}
      <div className={`flex flex-col items-start leading-tight ${SuitColors[card.suit]}`}>
        <span className={`font-black ${rankSize}`}>{card.rank}</span>
        <span className={`${suitSize}`}>{card.suit}</span>
      </div>
      
      {/* 中间大图标 */}
      <div className={`${centerSuitSize} self-center leading-none ${SuitColors[card.suit]} drop-shadow-sm`}>
        {card.suit}
      </div>
      
      {/* 右下角 (旋转180度) */}
      <div className={`flex flex-col items-start leading-tight rotate-180 ${SuitColors[card.suit]}`}>
        <span className={`font-black ${rankSize}`}>{card.rank}</span>
        <span className={`${suitSize}`}>{card.suit}</span>
      </div>
    </button>
  );
};

export default Card;
