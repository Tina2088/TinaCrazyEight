
import { Suit, Rank, CardType } from './types';

export const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
export const SUITS: Suit[] = [Suit.HEARTS, Suit.DIAMONDS, Suit.CLUBS, Suit.SPADES];

export function createDeck(): CardType[] {
  const deck: CardType[] = [];
  SUITS.forEach(suit => {
    RANKS.forEach(rank => {
      deck.push({
        id: `${rank}-${suit}-${Math.random()}`,
        suit,
        rank,
      });
    });
  });
  return shuffle(deck);
}

export function shuffle<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export function isValidMove(card: CardType, topCard: CardType, activeSuit: Suit): boolean {
  // If playing an 8, it's always valid
  if (card.rank === '8') return true;
  
  // Otherwise, match the active suit or the top card's rank
  return card.suit === activeSuit || card.rank === topCard.rank;
}
