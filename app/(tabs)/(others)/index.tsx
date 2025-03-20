import React from 'react';
import { View, Text, StyleSheet, Switch, Pressable } from 'react-native';
import { ThemeContext } from '../../../ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export default function OthersScreen() {
  const { theme, toggleTheme } = React.useContext(ThemeContext);
  
  // Determine if we're in dark mode based on the background color
  const isDarkMode = theme.background === '#131313';

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
      
      <View style={[styles.settingCard, { backgroundColor: theme.cardBackground }]}>
        <View style={styles.settingRow}>
          <View style={styles.settingLabelContainer}>
            <Ionicons 
              name={isDarkMode ? "moon" : "sunny"} 
              size={24} 
              color={theme.text} 
            />
            <Text style={[styles.settingLabel, { color: theme.text }]}>
              {isDarkMode ? 'Dark Mode' : 'Light Mode'}
            </Text>
          </View>
          
          <Switch
            trackColor={{ false: '#767577', true: '#7B68EE' }}
            thumbColor={isDarkMode ? '#f4f3f4' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleTheme}
            value={isDarkMode}
          />
        </View>
      </View>

      <View style={styles.infoContainer}>
        <Text style={[styles.infoText, { color: theme.text }]}>
          Switch between light and dark mode to change the app appearance.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  settingCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    marginLeft: 12,
  },
  infoContainer: {
    marginTop: 24,
  },
  infoText: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
  },
}); 