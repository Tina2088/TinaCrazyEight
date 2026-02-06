
export enum Suit {
  HEARTS = '♥',
  DIAMONDS = '♦',
  CLUBS = '♣',
  SPADES = '♠'
}

export const SuitColors: Record<Suit, string> = {
  [Suit.HEARTS]: 'text-red-500',
  [Suit.DIAMONDS]: 'text-red-500',
  [Suit.CLUBS]: 'text-slate-900',
  [Suit.SPADES]: 'text-slate-900',
};

export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface CardType {
  id: string;
  suit: Suit;
  rank: Rank;
}

export enum GameState {
  LOBBY = 'LOBBY',
  DEALING = 'DEALING',
  PLAYER_TURN = 'PLAYER_TURN',
  AI_TURN = 'AI_TURN',
  SELECTING_SUIT = 'SELECTING_SUIT',
  GAME_OVER = 'GAME_OVER'
}

export type PlayerType = 'PLAYER' | 'AI';
