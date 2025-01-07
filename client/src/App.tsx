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
  onComplete: () => void;
}

function ScenePlay({ level, onComplete }: ScenePlayProps) {
  return <Board level={level} onComplete={() => onComplete()} />;
}

interface SceneFinalProps {
  onComplete: () => void;
}

function SceneFinal({ onComplete }: SceneFinalProps) {
  return (
    <div>
      final
      <button onClick={() => onComplete()}>play again</button>
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
}

export type GameState = GameStart | GamePlay | GameFinal;

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    scene: 'start',
  });

  if (gameState.scene === 'start') {
    return (
      <SceneStart
        onComplete={(level) => {
          setGameState({
            scene: 'play',
            level,
          });
        }}
      />
    );
  }
  if (gameState.scene === 'play') {
    return (
      <ScenePlay
        level={gameState.level}
        onComplete={() => {
          setGameState({
            scene: 'final',
          });
        }}
      />
    );
  }
  if (gameState.scene === 'final') {
    return (
      <SceneFinal
        onComplete={() => {
          setGameState({
            scene: 'start',
          });
        }}
      />
    );
  }
};

export default App;
