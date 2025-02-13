import { Flex, Grid, Spin } from 'antd';
import { ReactElement, useEffect, useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { CardData, Level } from './types';
import Card from './components/Card/Card';

const IMAGE_LIMIT = 30;

function generateNumbers(size: number): Array<number> {
  return new Array(size).fill(0).map((_, index) => index + 1);
}

function shuffle<T>(items: Array<T>) {
  return items.sort(() => -0.5 + Math.random());
}

function generateUrls(size: number): Array<string> {
  const randomNumbers = shuffle(generateNumbers(IMAGE_LIMIT)).slice(0, size);

  return twice(
    randomNumbers.map(
      (randomNumber) => `${import.meta.env.BASE_URL}/images/${randomNumber}.jpg`
    )
  );
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

function generateCards(cardAmount: number): Array<CardData> {
  const catsAmount = Math.round(cardAmount / 2);

  return generateUrls(catsAmount).map(transformUrlToCardData);
}

interface BoardProps {
  level: Level;
  onComplete: (attempts: number, timer: number) => void;
}

const Board = ({ level, onComplete }: BoardProps) => {
  const [demensions, setDemensions] = useState<[number, number]>();
  const [cards, setCards] = useState<Array<CardData>>();
  const [currClickedCard, setCurrClickedCard] = useState<CardData | null>(null);
  const [prevClickedCard, setPrevClickedCard] = useState<CardData | null>(null);
  const [attemptsCount, setAttemptsCount] = useState<number>(0);
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
    setCards(generateCards(cols * rows));
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
          <Card key={card.id} card={card} onClick={handleCardClick} />
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

export default Board;
