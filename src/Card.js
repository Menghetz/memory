import { Pressable, StyleSheet, Text } from 'react-native';

export default function Card({ emoji, size, faceUp, matched, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        { width: size, height: size },
        faceUp && styles.faceUp,
        matched && styles.matched,
      ]}
    >
      <Text style={{ fontSize: size * 0.55 }}>{faceUp ? emoji : '❓'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#6c5ce7',
  },
  faceUp: {
    backgroundColor: '#ffffff',
  },
  matched: {
    backgroundColor: '#b8f5c9',
  },
});
