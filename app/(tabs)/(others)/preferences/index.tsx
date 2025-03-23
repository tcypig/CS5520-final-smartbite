// // app/(tabs)/(others)/preferences/index.tsx
// import React, { useEffect, useState, useContext } from 'react';
// import { View, Text, StyleSheet, Button, FlatList } from 'react-native';
// import { useRouter } from 'expo-router';
// import { ThemeContext } from '../../../../ThemeContext';
// import { getAllPreferences } from '@/firebase/firestore';
// import { PreferenceData } from '@/types';

// export default function PreferencesListScreen() {
//   const router = useRouter();
//   const { theme } = useContext(ThemeContext);
//   const [preferences, setPreferences] = useState<PreferenceData[]>([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       const data = await getAllPreferences();
//       setPreferences(data);
//     };
//     fetchData();
//   }, []);

//   return (
//     <View style={[styles.container, { backgroundColor: theme.background }]}>
//       <Text style={[styles.title, { color: theme.text }]}>User Preferences</Text>

//       {/* For each preference doc, we can display or navigate */}
//       <FlatList
//         data={preferences}
//         keyExtractor={(item) => item.id || ''}
//         renderItem={({ item }) => (
//           <View style={[styles.card, { backgroundColor: theme.cardBackground }]}>
//             <Text style={{ color: theme.text }}>{item.id}</Text>
//             {/* ... display fields ... */}
//             <Button
//               title="Edit"
//               onPress={() => {
//                 router.push(`/ (tabs)/ (others)/preferences/${item.id}`);
//               }}
//               color={theme.navigationBackgroundColor}
//             />
//           </View>
//         )}
//       />

//       <Button
//         title="Add New Preference"
//         onPress={() => {
//           // optional if you want an add screen
//           // router.push('/(tabs)/(others)/preferences/add');
//         }}
//         color={theme.navigationBackgroundColor}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 16 },
//   title: { fontSize: 20, marginBottom: 16 },
//   card: {
//     marginBottom: 12,
//     padding: 12,
//     borderRadius: 8,
//   },
// });
