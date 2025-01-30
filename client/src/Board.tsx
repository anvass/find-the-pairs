import { Flex, Grid, Spin } from 'antd';
import { ReactElement, useEffect, useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';

type CardStatus = 'hidden' | 'shown';

type CardData = {
  id: number;
  imgUrl: string;
  status: CardStatus;
};

interface CatResponse {
  url: string;
}

function fetchCatUrls(limit: number): Promise<string[]> {
  return fetch(
    `https://api.thecatapi.com/v1/images/search?api_key=17d94b92-754f-46eb-99a0-65be65b5d18f&limit=${limit}`
  )
    .then((res) => res.json())
    .then((items: CatResponse[]) => items.map((item) => item.url));
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
  const catsAmount = Math.round(cardAmount / 2);

  return fetchCatUrls(catsAmount)
    .then(twice)
    .then(shuffle)
    .then((urls) => urls.map(transformUrlToCardData));
}

type Level = 'easy' | 'medium' | 'hard';

interface BoardProps {
  level: Level;
  onComplete: (attempts: number, timer: number) => void;
}

const Board = ({ level, onComplete }: BoardProps) => {
  const [demensions, setDemensions] = useState<[number, number]>();
  const [cards, setCards] = useState<CardData[]>();
  const [prevClickedCard, setPrevClickedCard] = useState<CardData | null>(null);
  const [attemptsCount, setAttemptsCount] = useState<number>(1);
  const [timer, setTimer] = useState<number>(0);

  useEffect(() => {
    if (level === 'easy') {
      setDemensions([4, 3]);
    }
    if (level === 'medium') {
      setDemensions([6, 4]);
    }
    if (level === 'hard') {
      setDemensions([6, 6]);
    }
  }, [level]);

  useEffect(() => {
    if (!demensions) {
      return;
    }
    const [cols, rows] = demensions;
    generateCards(cols * rows).then(setCards);
  }, [demensions]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

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
          onComplete(attemptsCount, timer);
          return;
        } else {
          setCards(newCards);
        }
      }
      // setAttemptsCount((prev) => prev + 1);
      setAttemptsCount(attemptsCount + 1);
      setPrevClickedCard(null);
    } else {
      setPrevClickedCard(currClickedCard);
    }
  };

  if (!cards) {
    return (
      <Flex justify="center" align="center">
        <Spin
          fullscreen={true}
          indicator={
            <LoadingOutlined style={{ fontSize: 80, color: '#ffffff' }} spin />
          }
        ></Spin>
      </Flex>
    );
  }

  return (
    <>
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
    </>
  );
};

interface ContainerProps {
  children: Array<ReactElement>;
  cols: number;
  rows: number;
}

const { useBreakpoint } = Grid;

function Container({ children, cols, rows }: ContainerProps) {
  const { sm } = useBreakpoint();

  return (
    <div
      style={{
        display: 'inline-grid',
        gap: '10px',
        gridTemplateColumns: sm ? `repeat(${cols}, 1fr)` : `repeat(2, 1fr)`,
        // gridTemplateRows: `repeat(${rows}, 1fr)`,
        width: '100%',
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
        borderRadius: '8px',
        outlineColor: isSelected ? 'blue' : 'transparent',
        outlineStyle: 'solid',
        outlineWidth: isSelected ? 3 : 0,
        width: '100%',
        // maxWidth: 200,
        height: 0,
        paddingBottom: '100%',
        backgroundImage: `url(${card.imgUrl})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        boxSizing: 'border-box',
      }}
      className="card"
    />
  );
}

export default Board;
