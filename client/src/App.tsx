import { ReactElement, useState } from 'react';

type CardStatus = 'hidden' | 'shown';

type CardData = {
  id: number;
  imgUrl: string;
  status: CardStatus;
};

const mockCards: Array<CardData> = [
  {
    id: 1,
    imgUrl: 'https://cdn2.thecatapi.com/images/MjAzOTQ2MA.jpg',
    status: 'shown',
  },
  {
    id: 2,
    imgUrl: 'https://cdn2.thecatapi.com/images/Oaoo1ky3A.jpg',
    status: 'shown',
  },
  {
    id: 3,
    imgUrl: 'https://cdn2.thecatapi.com/images/dEWWIiCgr.jpg',
    status: 'shown',
  },
  {
    id: 5,
    imgUrl: 'https://cdn2.thecatapi.com/images/c2f.jpg',
    status: 'shown',
  },
  {
    id: 6,
    imgUrl: 'https://cdn2.thecatapi.com/images/MjAzOTQ2MA.jpg',
    status: 'shown',
  },
  {
    id: 7,
    imgUrl: 'https://cdn2.thecatapi.com/images/Oaoo1ky3A.jpg',
    status: 'shown',
  },
  {
    id: 8,
    imgUrl: 'https://cdn2.thecatapi.com/images/dEWWIiCgr.jpg',
    status: 'shown',
  },
  {
    id: 9,
    imgUrl: 'https://cdn2.thecatapi.com/images/c2f.jpg',
    status: 'shown',
  },
];

function App() {
  const [cards, setCards] = useState<CardData[]>(mockCards);
  const [prevClickedCard, setPrevClickedCard] = useState<CardData | null>(null);

  const handleCardClick = (currClickedCard: CardData) => {
    if (prevClickedCard) {
      if (
        prevClickedCard.id !== currClickedCard.id &&
        prevClickedCard.imgUrl === currClickedCard.imgUrl
      ) {
        setCards(
          cards.filter((card) => card.imgUrl !== currClickedCard.imgUrl)
        );
      }
      setPrevClickedCard(null);
    } else {
      setPrevClickedCard(currClickedCard);
    }
  };

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
}

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
