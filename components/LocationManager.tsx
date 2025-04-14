import {
    Alert,
    Button,
    Dimensions,
    Image,
    StyleSheet,
    View,
  } from 'react-native';
  import React, { useEffect, useState } from 'react';
  import {
    getCurrentPositionAsync,
    useForegroundPermissions,
  } from 'expo-location';
  import { router, useLocalSearchParams } from 'expo-router';
  import { auth } from '@/firebase/firebaseSetup';
  import { getUserProfile, updateUserProfile } from '@/firebase/firestore'; // ← 用你已有的 Helper
  import { LocationData } from '@/types';
  
  export default function LocationManager() {
    const params = useLocalSearchParams();
    const [permission, requestPermission] = useForegroundPermissions();
    const [location, setLocation] = useState<LocationData | null>(null);
  
    /** 1. 组件挂载时，从 users/{uid} 读取已保存的坐标 */
    useEffect(() => {
      async function fetchProfile() {
        const uid = auth.currentUser?.uid;
        if (!uid) return;
        const profile = await getUserProfile(uid);
        if (profile?.address?.geo) {
          setLocation({
            latitude: parseFloat(profile.address.geo.lat!),
            longitude: parseFloat(profile.address.geo.lng!),
          });
        }
      }
      fetchProfile();
    }, []);
  
    /** 2. 如果从 map 选择器返回经纬度 → 更新 state */
    useEffect(() => {
      if (params.latitude && params.longitude) {
        setLocation({
          latitude: parseFloat(
            Array.isArray(params.latitude) ? params.latitude[0] : params.latitude
          ),
          longitude: parseFloat(
            Array.isArray(params.longitude)
              ? params.longitude[0]
              : params.longitude
          ),
        });
      }
    }, [params]);
  
    async function verifyPermission() {
      if (permission?.granted) return true;
      const res = await requestPermission();
      return res.granted;
    }
  
    /** 3. 定位当前设备 */
    async function locateUserHandler() {
      if (!(await verifyPermission())) {
        Alert.alert('需要定位权限');
        return;
      }
      const pos = await getCurrentPositionAsync();
      setLocation({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      });
    }
  
    /** 4. 跳转到地图选择器 */
    function chooseLocationHandler() {
      router.push({
        pathname: '/(tabs)/(others)/map',
        params: location
          ? { initLatitude: location.latitude, initLongitude: location.longitude }
          : {},
      });
    }
  
    /** 5. 保存到 Firestore（users/{uid} 文档） */
    async function saveHandler() {
      const uid = auth.currentUser?.uid;
      if (!uid || !location) return;
      await updateUserProfile(uid, {
        address: {
          geo: {
            lat: location.latitude.toString(),
            lng: location.longitude.toString(),
          },
        },
      });
      router.back();
    }
  
    return (
      <View>
        <Button title="Find My Location" onPress={locateUserHandler} />
        <Button title="Choose on Map" onPress={chooseLocationHandler} />
        {location && (
          <Image
            source={{
              uri: `https://maps.googleapis.com/maps/api/staticmap?center=${location.latitude},${location.longitude}&zoom=14&size=400x200&maptype=roadmap&markers=color:red%7C${location.latitude},${location.longitude}&key=${process.env.EXPO_PUBLIC_mapsAPIKey}`,
            }}
            style={styles.map}
          />
        )}
        <Button
          title="Save Location"
          disabled={!location}
          onPress={saveHandler}
        />
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    map: {
      width: Dimensions.get('window').width,
      height: 200,
      marginTop: 10,
    },
  });
  