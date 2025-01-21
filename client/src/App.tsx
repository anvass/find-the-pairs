import { useState } from 'react';
import Board from './Board';

type Level = 'easy' | 'medium' | 'hard';

interface SceneStartProps {
  onComplete: (level: Level) => void;
}

function SceneStart({ onComplete }: SceneStartProps) {
  return (
    <div>
      start
      <br />
      <button onClick={() => onComplete('easy')}>play easy</button>
      <button onClick={() => onComplete('medium')}>play medium</button>
      <button onClick={() => onComplete('hard')}>play hard</button>
    </div>
  );
}

interface ScenePlayProps {
  level: Level;
  onComplete: (attempts: number, timer: number) => void;
}

function ScenePlay({ level, onComplete }: ScenePlayProps) {
  return (
    <Board
      level={level}
      onComplete={(attempts, timer) => onComplete(attempts, timer)}
    />
  );
}

interface SceneFinalProps {
  attemptsCount: number;
  finalTime: number;
  level: Level;
  onComplete: () => void;
}

function SceneFinal({
  attemptsCount,
  finalTime,
  onComplete,
  level,
}: SceneFinalProps) {
  return (
    <div>
      final
      <button onClick={() => onComplete()}>play again</button>
      <div>Results:</div>
      <p>level - {level}</p>
      <p>time - {finalTime} second(s)</p>
      <p>attempts count - {attemptsCount}</p>
    </div>
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
