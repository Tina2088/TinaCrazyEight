
import React from 'react';
import { Suit, SuitColors } from '../types';

interface SuitSelectorProps {
  onSelect: (suit: Suit) => void;
}

const SuitSelector: React.FC<SuitSelectorProps> = ({ onSelect }) => {
  const suits = [Suit.HEARTS, Suit.DIAMONDS, Suit.CLUBS, Suit.SPADES];
  
  const getSuitName = (suit: Suit) => {
    switch (suit) {
      case Suit.HEARTS: return '红心';
      case Suit.DIAMONDS: return '方块';
      case Suit.CLUBS: return '梅花';
      case Suit.SPADES: return '黑桃';
      default: return '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full animate-in zoom-in duration-300">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">万能 8 点！请选择花色</h2>
        <div className="grid grid-cols-2 gap-4">
          {suits.map(suit => (
            <button
              key={suit}
              onClick={() => onSelect(suit)}
              className={`
                h-24 rounded-xl border-2 border-gray-100 hover:border-blue-500 hover:bg-blue-50
                flex flex-col items-center justify-center transition-all group
              `}
            >
              <span className={`text-5xl ${SuitColors[suit]} group-hover:scale-125 transition-transform`}>
                {suit}
              </span>
              <span className="mt-2 font-semibold text-gray-600">
                {getSuitName(suit)}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuitSelector;
