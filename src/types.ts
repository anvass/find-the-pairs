export type Level = 'easy' | 'medium' | 'hard';

export type CardStatus = 'hidden' | 'shown' | 'guessed';

export type CardData = {
  id: number;
  imgUrl: string;
  status: CardStatus;
};

