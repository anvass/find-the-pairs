import { useState } from 'react';
import Board from './Board';
import {
  Button,
  Divider,
  Flex,
  Grid,
  Image,
  Layout,
  Space,
  Table,
  TableColumnsType,
} from 'antd';
import { Content, Footer } from 'antd/es/layout/layout';
import Title from 'antd/es/typography/Title';
import Paragraph from 'antd/es/typography/Paragraph';

type Level = 'easy' | 'medium' | 'hard';

interface SceneStartProps {
  onComplete: (level: Level) => void;
}

interface ScenePlayProps {
  level: Level;
  onComplete: (attempts: number, timer: number) => void;
}

interface SceneFinalProps {
  attemptsCount: number;
  finalTime: number;
  level: Level;
  onComplete: () => void;
}

const { useBreakpoint } = Grid;

function SceneStart({ onComplete }: SceneStartProps) {
  const { sm, md } = useBreakpoint();

  return (
    <Layout
      style={{ textAlign: 'center', minHeight: '100vh', display: 'flex' }}
    >
      <Content style={{ display: 'flex', justifyContent: 'center' }}>
        <Flex
          vertical
          justify="center"
          align="center"
          style={{ width: '95%', maxWidth: '900px', padding: '30px 15px' }}
        >
          <Image
            width={'150px'}
            src={`${import.meta.env.BASE_URL}/images/logo.svg`}
            alt="Найди пару"
            preview={false}
          />
          <Title
            style={{
              fontFamily: 'Comfortaa',
              fontWeight: 700,
              fontSize: md ? '4.5rem' : '2.5rem',
            }}
          >
            Найди пару
          </Title>
          <Paragraph style={{ fontSize: sm ? 'inherit' : '0.9rem' }}>
            Игра, которая поможет вам улучшить навыки памяти и внимания.
            <br></br>Вам предстоит запомнить расположение изображений на поле, а
            затем найти их.
          </Paragraph>
          <Divider
            style={{
              margin: '3rem 0',
              fontSize: md ? '1.5rem' : '1.2rem',
              textWrap: sm ? 'nowrap' : 'wrap',
            }}
          >
            Выберите уровень сложности
          </Divider>
          <Flex justify={'center'} align={'center'}>
            <Space
              size={'large'}
              style={{
                display: 'flex',
                flexDirection: sm ? 'row' : 'column',
              }}
            >
              <Button
                type="primary"
                size="large"
                onClick={() => onComplete('easy')}
              >
                Лёгкий
              </Button>
              <Button
                type="primary"
                size="large"
                onClick={() => onComplete('medium')}
              >
                Средний
              </Button>
              <Button
                type="primary"
                size="large"
                onClick={() => onComplete('hard')}
              >
                Сложный
              </Button>
            </Space>
          </Flex>
        </Flex>
      </Content>

      <Footer>
        <Paragraph style={{ fontSize: '0.9rem' }}>
          &copy; 2025 "Найди пару". Все права защищены.
        </Paragraph>
      </Footer>
    </Layout>
  );
}

function ScenePlay({ level, onComplete }: ScenePlayProps) {
  return (
    <Flex
      vertical
      justify="center"
      align="center"
      style={{
        minHeight: '100vh',
        width: '95%',
        maxWidth: '1000px',
        padding: '30px 15px',
        boxSizing: 'border-box',
        textAlign: 'center',
      }}
    >
      <Board
        level={level}
        onComplete={(attempts, timer) => onComplete(attempts, timer)}
      />
    </Flex>
  );
}

const LevelNames: Record<Level, string> = {
  easy: 'Простой',
  medium: 'Средний',
  hard: 'Сложный',
};

interface DataType {
  key: React.Key;
  param: string;
  val: string;
}

const columns: TableColumnsType<DataType> = [
  {
    title: 'Показатель',
    dataIndex: 'param',
  },
  {
    title: 'Значение',
    dataIndex: 'val',
    align: 'center',
  },
];

function SceneFinal({
  attemptsCount,
  finalTime,
  onComplete,
  level,
}: SceneFinalProps) {
  const { sm } = useBreakpoint();

  const data: DataType[] = [
    {
      key: '1',
      param: 'Уровень',
      val: LevelNames[level],
    },
    {
      key: '2',
      param: 'Время (секунды)',
      val: String(finalTime),
    },
    {
      key: '3',
      param: 'Количество попыток',
      val: String(attemptsCount),
    },
  ];

  return (
    <Flex
      vertical
      justify="center"
      align="center"
      style={{
        minHeight: '100vh',
        width: '95%',
        maxWidth: '900px',
        padding: '30px 15px',
        textAlign: 'center',
      }}
    >
      <Title
        level={2}
        style={{
          fontFamily: 'Comfortaa',
          fontWeight: 700,
          fontSize: sm ? '2.5rem' : '1.5rem',
          margin: 0,
        }}
      >
        Поздравляем!
      </Title>

      <Paragraph style={{ margin: '1rem 0' }}>Вы нашли все пары</Paragraph>

      <Image
        width={'300px'}
        src={`${import.meta.env.BASE_URL}/images/pair.svg`}
        alt="Пара котиков"
        preview={false}
      />

      <Table
        columns={columns}
        dataSource={data}
        showHeader={false}
        pagination={false}
        // bordered
        title={() => (
          <div style={{ textAlign: 'center', fontWeight: '600' }}>
            Ваш результат
          </div>
        )}
        style={{ margin: '3.5rem 0' }}
        size={sm ? 'large' : 'small'}
      />

      <Button type="primary" size="large" onClick={() => onComplete()}>
        Попробовать снова
      </Button>
    </Flex>
  );
}

interface GameStart {
  scene: 'start';
}

interface GamePlay {
  scene: 'play';
  level: Level;
}

interface GameFinal {
  scene: 'final';
  level: Level;
  attemptsCount: number;
  finalTime: number;
}

export type GameState = GameStart | GamePlay | GameFinal;

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    scene: 'start',
  });

  if (gameState.scene === 'start') {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <SceneStart
          onComplete={(level) => {
            setGameState({
              scene: 'play',
              level,
            });
          }}
        />
      </div>
    );
  }
  if (gameState.scene === 'play') {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ScenePlay
          level={gameState.level}
          onComplete={(attemptsCount, finalTime) => {
            setGameState({
              scene: 'final',
              attemptsCount,
              finalTime,
              level: gameState.level,
            });
          }}
        />
      </div>
    );
  }
  if (gameState.scene === 'final') {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <SceneFinal
          attemptsCount={gameState.attemptsCount}
          finalTime={gameState.finalTime}
          level={gameState.level}
          onComplete={() => {
            setGameState({
              scene: 'start',
            });
          }}
        />
      </div>
    );
  }
};

export default App;
