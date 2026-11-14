import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Card from './Card';
import { EMOJIS } from './emojis';

const GAP = 6;
const FLIP_BACK_DELAY_MS = 800;

function shuffle(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Builds a deck of size*size cards using `imageCount` different emojis.
// With fewer images than pairs, some emojis get more than one pair (4 cards),
// and any two cards with the same emoji count as a match.
function createDeck(size, imageCount) {
  const pairCount = (size * size) / 2;
  const picked = shuffle(EMOJIS).slice(0, Math.min(imageCount, pairCount));
  const pairs = Array.from({ length: pairCount }, (_, i) => picked[i % picked.length]);
  return shuffle([...pairs, ...pairs]);
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export default function Game({ size, imageCount, onExit }) {
  const [deck, setDeck] = useState(() => createDeck(size, imageCount));
  const [flipped, setFlipped] = useState([]); // indexes of the cards currently turned over (max 2)
  const [matched, setMatched] = useState([]); // indexes of the cards already paired up
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [started, setStarted] = useState(false);

  const won = matched.length === deck.length;

  // The timer starts on the first flip and stops when the board is cleared.
  useEffect(() => {
    if (!started || won) return;
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [started, won]);

  // When two cards are face up, either keep them (match) or flip them back.
  useEffect(() => {
    if (flipped.length < 2) return;
    const [first, second] = flipped;
    if (deck[first] === deck[second]) {
      setMatched((m) => [...m, first, second]);
      setFlipped([]);
      return;
    }
    const timeout = setTimeout(() => setFlipped([]), FLIP_BACK_DELAY_MS);
    return () => clearTimeout(timeout);
  }, [flipped, deck]);

  function handleCardPress(index) {
    const alreadyVisible = flipped.includes(index) || matched.includes(index);
    if (flipped.length === 2 || alreadyVisible) return;

    setStarted(true);
    setFlipped([...flipped, index]);
    if (flipped.length === 1) setMoves(moves + 1);
  }

  function restart() {
    setDeck(createDeck(size, imageCount));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setSeconds(0);
    setStarted(false);
  }

  // Fit a square board on the screen, leaving room for the header and buttons.
  const { width, height } = useWindowDimensions();
  const boardSize = Math.min(width - 24, height - 220, 640);
  const cardSize = (boardSize - GAP * (size - 1)) / size;

  return (
    <View style={styles.container}>
      <View style={styles.stats}>
        <Text style={styles.stat}>⏱ {formatTime(seconds)}</Text>
        <Text style={styles.stat}>👆 {moves} moves</Text>
      </View>

      <View style={[styles.board, { width: boardSize }]}>
        {deck.map((emoji, index) => (
          <Card
            key={index}
            emoji={emoji}
            size={cardSize}
            faceUp={flipped.includes(index) || matched.includes(index)}
            matched={matched.includes(index)}
            onPress={() => handleCardPress(index)}
          />
        ))}
      </View>

      <Text style={styles.message}>
        {won ? `🎉 Done in ${formatTime(seconds)} with ${moves} moves!` : ' '}
      </Text>

      <View style={styles.buttons}>
        <Pressable style={styles.button} onPress={restart}>
          <Text style={styles.buttonText}>Restart</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={onExit}>
          <Text style={styles.buttonText}>Menu</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  stats: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 12,
  },
  stat: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
  },
  board: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
  },
  message: {
    marginVertical: 12,
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 10,
    backgroundColor: '#6c5ce7',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});
