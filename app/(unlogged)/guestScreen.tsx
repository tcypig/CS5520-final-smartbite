import { View, Text, StyleSheet, ScrollView, Image, Button, TouchableOpacity, FlatList, Pressable, Alert, Linking } from 'react-native';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from '@/constants/styles';
import { router } from 'expo-router';
import { auth } from '@/firebase/firebaseSetup';

export default function GuestHomeScreen({ onLoginPress }: { onLoginPress: () => void }) {
  const recipeOptions = [
    {
      id: '1',
      title: 'Avocado Toast',
      icon: require('@/assets/recipePhoto/avocado_toast.png'),
      url: 'https://www.delish.com/cooking/recipe-ideas/a20089646/avocado-toast-recipe/',
    },
    {
      id: '2',
      title: 'Chicken Bowl',
      icon: require('@/assets/recipePhoto/spicy_chicken_bowl.png'),
      url: 'https://www.delish.com/cooking/recipe-ideas/a40733793/hot-honey-chicken-and-rice-bowls-recipe/',
    },
    {
      id: '3',
      title: 'Smoothie Bowl',
      icon: require('@/assets/recipePhoto/smoothie_bowl.png'),
      url: 'https://www.delish.com/cooking/menus/g27664093/smoothie-bowl-recipes/?utm_source=google&utm_medium=cpc&utm_campaign=mgu_ga_del_md_pmx_hybd_mix_ca_18639947754&gad_source=1&gbraid=0AAAAACq-IPxPBYBN8dDsmF0kBa80j8y2R&gclid=Cj0KCQjw2ZfABhDBARIsAHFTxGxfBhOeefn1dN8StFHznKrsn5PYKX2Ftxg58gtbOsYUHEH1Ypu9MbEaAmhLEALw_wcB',
    },
    {
      id: '4',
      title: 'Grilled Salmon',
      icon: require('@/assets/recipePhoto/grilled_salmon.png'),
      url: 'https://www.delish.com/cooking/recipe-ideas/recipes/a58718/best-grilled-salmon-fillets-recipe/',
    },  
  ];

  const tools = [
    { id: '1', label: 'Recipe Generator', icon: 'restaurant' },
    { id: '2', label: 'Nutrition Tracker', icon: 'bar-chart' },
    { id: '3', label: 'Recipes Keeper', icon: 'bookmark' },
    { id: '4', label: 'Meal Log', icon: 'clipboard' },
  ];

  function handleLogIn() {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      Alert.alert('Login Required', 'Please log in to access your personalized recipes.', [
        { text: 'Go to Login', onPress: () => router.push('/(auth)/login') },
      ]);
    } else {
      router.replace('/(protected)/(tabs)/(recipes)');
    }
  }

  return (
    <View style={styles.container}>
      {/* Top horizontal scroll of recipe types */}
      <View style={styles.topSection}>
        <Text style={styles.sectionTitle}>Popular Recipes</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
          {recipeOptions.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => Linking.openURL(item.url)}
            style={({ pressed }) => [
              styles.recipeOption,
              pressed && { opacity: 0.6 },
            ]}
          >
            <Image source={item.icon} style={styles.recipeIcon} />
            <Text style={styles.recipeLabel}>{item.title}</Text>
          </Pressable>
        ))}
        </ScrollView>
      </View>

      {/* Login prompt */}
      <Pressable
        onPress={handleLogIn}
        style={({ pressed }) => [
          styles.loginBanner,
          pressed && styles.pressedHighlight,
        ]}
      >
        <Text style={styles.loginText}>Log in to unlock personalized tools and insights 🔓</Text>
        <Text style={styles.loginButton}>Go to Login ›</Text>
      </Pressable>

      {/* Tool Grid */}
      <View style={styles.gridSection}>
        <FlatList
          data={tools}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.gridRow}
          renderItem={({ item }) => (
            <Pressable
              onPress={handleLogIn}
              style={({ pressed }) => [
                styles.gridItem,
                pressed && styles.pressedHighlight,
              ]}
            >
              <Ionicons name={item.icon as any} size={32} color={Colors.lightGreen} />
              <Text style={styles.gridLabel}>{item.label}</Text>
              <Text style={styles.gridDesc}>Helpful tool</Text>
            </Pressable>
          )}
        />
      </View>

      {/* Bottom Login Prompt */}
      <View style={styles.bottomBanner}>
        <Text style={styles.bottomText}>One-tap login to unlock more features !</Text>
        <Pressable 
          onPress={handleLogIn}
          style={({ pressed }) => [
            pressed && styles.pressedHighlight,
          ]}
        >
          <Text style={styles.loginAction}>Login</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
    paddingHorizontal: 16,
    paddingTop: 30,
  },
  topSection: {
    marginBottom: 20,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  horizontalScroll: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recipeOption: {
    alignItems: 'center',
    marginRight: 20,
  },
  recipeIcon: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#E6F0FA',
  },
  recipeLabel: {
    fontSize: 12,
    marginTop: 6,
    color: '#333',
  },
  loginBanner: {
    backgroundColor: '#E8F5E9',
    padding: 16,
    borderRadius: 12,
    marginVertical: 20,
  },
  loginText: {
    color: '#333',
    fontSize: 14,
    marginBottom: 8,
  },
  loginButton: {
    color: '#00AA55',
    fontWeight: '600',
  },
  gridSection: {
    flex: 1,
    marginTop: 20,
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  gridItem: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 1,
  },
  gridLabel: {
    fontSize: 14,
    marginTop: 8,
    color: Colors.lightGreen,
  },
  gridDesc: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#00cc66',
    borderRadius: 30,
    padding: 16,
    elevation: 4,
  },
  bottomBanner: {
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomText: {
    color: '#555',
    fontSize: 14,
  },
  loginAction: {
    color: '#00cc66',
    fontWeight: 'bold',
    fontSize: 14,
  },
  pressedHighlight: {
    opacity: 0.6,
    transform: [{ scale: 0.97 }],
  },
  
});
