import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Game from './src/Game';

const BOARD_SIZES = [4, 6];

// How many different images each difficulty uses, per board size.
// Fewer images than pairs means some images appear on 4 cards (two pairs),
// so it's easier to stumble on a match. "Hard" makes every pair unique.
const DIFFICULTIES = [
  { label: 'Easy', images: { 4: 4, 6: 9 } },
  { label: 'Medium', images: { 4: 6, 6: 12 } },
  { label: 'Hard', images: { 4: 8, 6: 18 } },
];

function Option({ selected, onPress, title, detail }) {
  return (
    <Pressable style={[styles.option, selected && styles.optionSelected]} onPress={onPress}>
      <Text style={[styles.optionTitle, selected && styles.optionTextSelected]}>{title}</Text>
      {detail ? (
        <Text style={[styles.optionDetail, selected && styles.optionTextSelected]}>{detail}</Text>
      ) : null}
    </Pressable>
  );
}

export default function App() {
  const [boardSize, setBoardSize] = useState(4);
  const [difficulty, setDifficulty] = useState(DIFFICULTIES.length - 1);
  const [playing, setPlaying] = useState(false);

  const imageCount = DIFFICULTIES[difficulty].images[boardSize];

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {playing ? (
        <Game size={boardSize} imageCount={imageCount} onExit={() => setPlaying(false)} />
      ) : (
        <>
          <Text style={styles.title}>🤪 Memory</Text>

          <Text style={styles.subtitle}>Board</Text>
          <View style={styles.row}>
            {BOARD_SIZES.map((size) => (
              <Option
                key={size}
                selected={size === boardSize}
                onPress={() => setBoardSize(size)}
                title={`${size} × ${size}`}
                detail={`${(size * size) / 2} pairs`}
              />
            ))}
          </View>

          <Text style={styles.subtitle}>Difficulty</Text>
          <View style={styles.row}>
            {DIFFICULTIES.map((level, index) => (
              <Option
                key={level.label}
                selected={index === difficulty}
                onPress={() => setDifficulty(index)}
                title={level.label}
                detail={`${level.images[boardSize]} images`}
              />
            ))}
          </View>

          <Pressable style={styles.playButton} onPress={() => setPlaying(true)}>
            <Text style={styles.playText}>Play</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#1e1b3a',
  },
  title: {
    marginBottom: 8,
    fontSize: 44,
    fontWeight: '700',
    color: '#ffffff',
  },
  subtitle: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: 18,
    color: '#c9c5f0',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  option: {
    minWidth: 96,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#6c5ce7',
    alignItems: 'center',
  },
  optionSelected: {
    backgroundColor: '#6c5ce7',
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#c9c5f0',
  },
  optionDetail: {
    marginTop: 2,
    fontSize: 13,
    color: '#a39fd6',
  },
  optionTextSelected: {
    color: '#ffffff',
  },
  playButton: {
    width: 180,
    marginTop: 32,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#00b894',
  },
  playText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
  },
});
