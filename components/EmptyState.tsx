// components/EmptyState.tsx
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

const EMPTYIMAGE = "https://media.istockphoto.com/id/1302329435/vector/empty-food-bowl-with-a-spoon-sticking-out-of-it.jpg?s=612x612&w=0&k=20&c=WfH2XyvQkijX04bXsEODzeTlI_B1ejUDjk1iT3KIzik="

export default function EmptyState() {
  return (
    <View style={styles.container}>
      <Image
        source={{uri: EMPTYIMAGE}}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.text}>
        Tap the add button to add food
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginVertical: 20,
  },
  image: {
    width: 100,
    height: 100,
    opacity: 0.5,
    marginBottom: 10,
  },
  text: {
    color: '#999',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
