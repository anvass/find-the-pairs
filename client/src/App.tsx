import { ReactElement, useEffect, useState } from 'react';

type CardStatus = 'hidden' | 'shown';

type CardData = {
  id: number;
  imgUrl: string;
  status: CardStatus;
};

const rows = 3;
const cols = 2;

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

const App: React.FC = () => {
  const [cards, setCards] = useState<CardData[]>();
  const [prevClickedCard, setPrevClickedCard] = useState<CardData | null>(null);

  useEffect(() => {
    generateCards(cols * rows).then(setCards);
  }, []);

  const handleCardClick = (currClickedCard: CardData) => {
    if (prevClickedCard) {
      if (
        prevClickedCard.id !== currClickedCard.id &&
        prevClickedCard.imgUrl === currClickedCard.imgUrl
      ) {
        setCards(
          cards!.filter((card) => card.imgUrl !== currClickedCard.imgUrl)
        );
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
    <Board>
      {cards.map((card) => (
        <Card
          key={card.id}
          isSelected={card.id === prevClickedCard?.id}
          card={card}
          onClick={handleCardClick}
        />
      ))}
    </Board>
  );
};

interface BoardProps {
  children: Array<ReactElement>;
}

function Board({ children }: BoardProps) {
  return (
    <div
      style={{
        display: 'inline-grid',
        gap: '10px',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gridTemplateRows: 'repeat(4, 1fr)',
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

export default App;
