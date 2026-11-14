import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Game from './src/Game';

const BOARD_SIZES = [4, 6];

export default function App() {
  const [boardSize, setBoardSize] = useState(null); // null = show the menu

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {boardSize ? (
        <Game size={boardSize} onExit={() => setBoardSize(null)} />
      ) : (
        <>
          <Text style={styles.title}>🤪 Memory</Text>
          <Text style={styles.subtitle}>Pick a board</Text>
          {BOARD_SIZES.map((size) => (
            <Pressable key={size} style={styles.button} onPress={() => setBoardSize(size)}>
              <Text style={styles.buttonText}>
                {size} × {size}
              </Text>
            </Pressable>
          ))}
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
    backgroundColor: '#1e1b3a',
  },
  title: {
    fontSize: 44,
    fontWeight: '700',
    color: '#ffffff',
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 24,
    fontSize: 18,
    color: '#c9c5f0',
  },
  button: {
    width: 180,
    marginBottom: 12,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#6c5ce7',
  },
  buttonText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#ffffff',
  },
});
