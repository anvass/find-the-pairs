import { ReactElement, useEffect, useState } from 'react';

type CardStatus = 'hidden' | 'shown';

type CardData = {
  id: number;
  imgUrl: string;
  status: CardStatus;
};

interface CatResponse {
  url: string;
}

function fetchCatUrl(): Promise<string> {
  return fetch(`https://api.thecatapi.com/v1/images/search`)
    .then((res) => res.json())
    .then((data: CatResponse[]) => data[0].url);
}

function shuffle<T>(items: Array<T>) {
  return items.sort(() => -0.5 + Math.random());
}

function twice<T>(items: Array<T>) {
  return [...items, ...items];
}

function transformUrlToCardData(imgUrl: string, id: number): CardData {
  return {
    id,
    imgUrl,
    status: 'hidden',
  };
}

function generateCards(cardAmount: number): Promise<CardData[]> {
  const requestAmount = Math.round(cardAmount / 2);
  const requests = new Array(requestAmount).fill(0).map(() => fetchCatUrl());

  return Promise.all(requests)
    .then(twice)
    .then(shuffle)
    .then((urls) => urls.map(transformUrlToCardData));
}

interface BoardProps {
  level: any;
  onComplete: () => void;
}

const Board = ({ level, onComplete }: BoardProps) => {
  const [demensions, setDemensions] = useState<[number, number]>();
  const [cards, setCards] = useState<CardData[]>();
  const [prevClickedCard, setPrevClickedCard] = useState<CardData | null>(null);

  useEffect(() => {
    if (level === 'easy') {
      setDemensions([2, 2]);
    }
    if (level === 'medium') {
      setDemensions([2, 3]);
    }
    if (level === 'hard') {
      setDemensions([3, 4]);
    }
  }, [level]);

  useEffect(() => {
    if (!demensions) {
      return;
    }
    const [cols, rows] = demensions;
    generateCards(cols * rows).then(setCards);
  }, [demensions]);

  const handleCardClick = (currClickedCard: CardData) => {
    if (prevClickedCard) {
      if (
        prevClickedCard.id !== currClickedCard.id &&
        prevClickedCard.imgUrl === currClickedCard.imgUrl
      ) {
        const newCards = cards!.filter(
          (card) => card.imgUrl !== currClickedCard.imgUrl
        );

        if (!newCards.length) {
          onComplete();
          return;
        } else {
          setCards(newCards);
        }
      }
      setPrevClickedCard(null);
    } else {
      setPrevClickedCard(currClickedCard);
    }
  };

  if (!cards) {
    return 'loading..';
  }

  return (
    <Container cols={demensions![0]} rows={demensions![1]}>
      {cards.map((card) => (
        <Card
          key={card.id}
          isSelected={card.id === prevClickedCard?.id}
          card={card}
          onClick={handleCardClick}
        />
      ))}
    </Container>
  );
};

interface ContainerProps {
  children: Array<ReactElement>;
  cols: number;
  rows: number;
}

function Container({ children, cols, rows }: ContainerProps) {
  return (
    <div
      style={{
        display: 'inline-grid',
        gap: '10px',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      }}
    >
      {children}
    </div>
  );
}

interface CardProps {
  card: CardData;
  onClick: (cardData: CardData) => void;
  isSelected: boolean;
}

function Card({ card, onClick, isSelected }: CardProps) {
  return (
    <div
      onClick={() => onClick(card)}
      style={{
        borderStyle: 'solid',
        borderColor: isSelected ? 'blue' : ' black',
        borderWidth: 5,
        width: 150,
        height: 150,
        backgroundImage: `url(${card.imgUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    />
  );
}

export default Board;
