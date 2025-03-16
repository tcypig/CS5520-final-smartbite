// components/TopNavBar.tsx
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TopNavBar() {
  const handleMenuPress = () => {
    // TODO: open a left side menu or show a dropdown
  };
  const handleSettingsPress = () => {
    // TODO: navigate to a settings screen or show a popup
  };

  // For a dynamic title, you can pass props or read from route data; here we show a static example
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleMenuPress} style={styles.iconContainer}>
        <Ionicons name="menu" size={24} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.title}>My AI Recipes</Text>
      <TouchableOpacity onPress={handleSettingsPress} style={styles.iconContainer}>
        <Ionicons name="settings" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    backgroundColor: 'purple',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    justifyContent: 'space-between',
  },
  iconContainer: {
    padding: 8,
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
