import { Flex, Grid, Spin } from 'antd';
import { ReactElement, useEffect, useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';

type CardStatus = 'hidden' | 'shown' | 'guessed';

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
  const [currClickedCard, setCurrClickedCard] = useState<CardData | null>(null);
  const [prevClickedCard, setPrevClickedCard] = useState<CardData | null>(null);
  const [attemptsCount, setAttemptsCount] = useState<number>(1);
  const [timer, setTimer] = useState<number>(0);

  const processPair = (
    currClickedCard: CardData,
    prevClickedCard: CardData
  ) => {
    const isPairGuessed =
      prevClickedCard.id !== currClickedCard.id &&
      prevClickedCard.imgUrl === currClickedCard.imgUrl;

    if (isPairGuessed) {
      setCards((prevCards) => {
        return prevCards?.map((card) => {
          if (card.id === prevClickedCard.id) {
            return {
              ...card,
              status: 'guessed',
            };
          }

          if (card.id === currClickedCard.id) {
            return {
              ...card,
              status: 'guessed',
            };
          }

          return card;
        });
      });
    } else {
      setCards((prevCards) => {
        return prevCards?.map((card) => {
          if (card.status === 'shown') {
            return {
              ...card,
              status: 'hidden',
            };
          }

          return card;
        });
      });
    }

    setAttemptsCount(attemptsCount + 1);

    setCurrClickedCard(null);
    setPrevClickedCard(null);
  };

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

  useEffect(() => {
    if (!currClickedCard || !prevClickedCard) {
      return;
    }
    const timerId = setTimeout(function () {
      processPair(currClickedCard, prevClickedCard);
    }, 1_000);

    return () => {
      clearTimeout(timerId);
    };
  }, [currClickedCard, prevClickedCard]);

  useEffect(() => {
    const isCompletedLevel = cards?.every((card) => card.status === 'guessed');

    if (isCompletedLevel) {
      onComplete(attemptsCount, timer);
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards]);

  const handleCardClick = (clickedCard: CardData) => {
    if (clickedCard.status !== 'hidden') {
      return;
    }
    if (currClickedCard && prevClickedCard) {
      return;
    }

    setCards((prevCards) => {
      return prevCards?.map((card) => {
        if (card.id === clickedCard.id) {
          return {
            ...card,
            status: 'shown',
          };
        }

        return card;
      });
    });

    if (currClickedCard) {
      setPrevClickedCard({
        ...currClickedCard,
        status: 'shown',
      });
    }

    setCurrClickedCard({
      ...clickedCard,
      status: 'shown',
    });
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

function Container({ children, cols }: ContainerProps) {
  const { sm } = useBreakpoint();

  return (
    <div
      style={{
        display: 'inline-grid',
        gap: '10px',
        gridTemplateColumns: sm ? `repeat(${cols}, 1fr)` : `repeat(2, 1fr)`,
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

function Card({ card, onClick }: CardProps) {
  if (card.status === 'guessed') {
    return (
      <div
        style={{
          width: '100%',
          height: 0,
          paddingBottom: '100%',
          boxSizing: 'border-box',
          backgroundColor: 'transparent',
        }}
      />
    );
  }

  if (card.status === 'hidden') {
    return (
      <div
        onClick={() => onClick(card)}
        style={{
          borderRadius: '8px',
          width: '100%',
          height: 0,
          paddingBottom: '100%',
          backgroundImage: 'url("public/images/cover.jpg")',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          boxSizing: 'border-box',
        }}
        className="card"
      />
    );
  }

  return (
    <div
      onClick={() => onClick(card)}
      style={{
        borderRadius: '8px',
        width: '100%',
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
