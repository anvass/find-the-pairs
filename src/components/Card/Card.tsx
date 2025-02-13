import { CardData } from '../../types';
import styles from './Card.module.css';

interface CardProps {
  card: CardData;
  onClick: (cardData: CardData) => void;
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
          backgroundImage: `url("${
            import.meta.env.BASE_URL
          }/images/cover.jpg")`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          boxSizing: 'border-box',
        }}
        className={styles.card}
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
      className={styles.card}
    />
  );
}

export default Card;
