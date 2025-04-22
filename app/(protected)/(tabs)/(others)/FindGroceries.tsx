// app/(protected)/(tabs)/(others)/FindGroceries.tsx
import React, {
    useEffect,
    useState,
    useCallback,
    useContext,
    useRef,
  } from 'react';
  import {
    View,
    TextInput,
    StyleSheet,
    Dimensions,
    ActivityIndicator,
    Alert,
    TouchableOpacity,
    Text,
    ScrollView,
    FlatList,
    Animated,
    PanResponder,
  } from 'react-native';
  import MapView, { Marker, Region } from 'react-native-maps';
  import * as Location from 'expo-location';
  import axios from 'axios';
  import { updateUserProfile } from '@/firebase/firestore';
  import { auth } from '@/firebase/firebaseSetup';
  import { ThemeContext } from '@/ThemeContext';
  import { Ionicons } from '@expo/vector-icons';
  
  /* ---------- Types ---------- */
  type Place = {
    place_id: string;
    name: string;
    formatted_address?: string;
    vicinity?: string;
    geometry: { location: { lat: number; lng: number } };
    types?: string[];
    rating?: number;
    user_ratings_total?: number;
    opening_hours?: { open_now?: boolean };
  
    /* Runtime‑only fields */
    distance?: number;
    isGroceryStore?: boolean;
  };
  
  type Coordinates = { latitude: number; longitude: number };
  
  /* ---------- Helpers ---------- */
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
  
  const kmBetween = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };
  
  /* ---------- Component ---------- */
  export default function FindGroceries() {
    /* --- Basic state --- */
    const [curLoc, setCurLoc] = useState<Coordinates | null>(null);
    const [region, setRegion] = useState<Region | null>(null);
    const [initDone, setInitDone] = useState(false);
  
    const [query, setQuery] = useState('');
    const [radiusKm, setRadiusKm] = useState(5);
  
    const [places, setPlaces] = useState<Place[]>([]);
    const [selPlace, setSelPlace] = useState<Place | null>(null);
    const [lastClickedMarkerId, setLastClickedMarkerId] = useState<string | null>(null);
  
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);
  
    const [isExpanded, setIsExpanded] = useState(false);
    const [showDetail, setShowDetail] = useState(false);
    const [lastTap, setLastTap] = useState(0);
  
    /* --- refs --- */
    const mapRef = useRef<MapView>(null);
    const markerRefs = useRef<{ [k: string]: any }>({});
    const resHeight = useRef(new Animated.Value(150)).current;
    const listRef = useRef<FlatList>(null);
  
    /* --- theme --- */
    const { theme } = useContext(ThemeContext);
  
    /* --- Draggable results panel --- */
    const screenH = Dimensions.get('window').height;
    const COLLAPSED = 150;
    const EXPANDED = screenH * 0.6;
  
    const panResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (_, g) => {
          const h = isExpanded ? EXPANDED - g.dy : COLLAPSED - g.dy;
          if (h >= COLLAPSED && h <= EXPANDED) resHeight.setValue(h);
        },
        onPanResponderRelease: (_, g) => {
          if (g.dy < -40 && !isExpanded) {
            Animated.spring(resHeight, {
              toValue: EXPANDED,
              useNativeDriver: false,
            }).start();
            setIsExpanded(true);
          } else if (g.dy > 40 && isExpanded) {
            Animated.spring(resHeight, {
              toValue: COLLAPSED,
              useNativeDriver: false,
            }).start();
            setIsExpanded(false);
          } else {
            Animated.spring(resHeight, {
              toValue: isExpanded ? EXPANDED : COLLAPSED,
              useNativeDriver: false,
            }).start();
          }
        },
      })
    ).current;
  
    /* ---------- Geolocation ---------- */
    const locate = useCallback(async () => {
      setLoading(true);
      
      // Collapse the panel if expanded
      if (isExpanded) {
        Animated.spring(resHeight, {
          toValue: COLLAPSED,
          useNativeDriver: false,
        }).start();
        setIsExpanded(false);
      }
      
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') throw new Error('Location permission denied');
        const pos = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        const coords = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        };
        const r = { ...coords, latitudeDelta: 0.02, longitudeDelta: 0.02 };
        setCurLoc(coords);
        setRegion(r);
        mapRef.current?.animateToRegion(r, 500);
  
        if (initDone) {
          const uid = auth.currentUser?.uid;
          uid &&
            updateUserProfile(uid, {
              address: { geo: { lat: `${coords.latitude}`, lng: `${coords.longitude}` } },
            });
        }
        setInitDone(true);
      } catch (e: any) {
        setErr(e.message || 'Failed to get location');
        Alert.alert('Location Error', e.message || 'Unable to get current position');
      } finally {
        setLoading(false);
      }
    }, [initDone, isExpanded, resHeight, COLLAPSED]);
  
    useEffect(() => {
      locate();
    }, []);
  
    /* ---------- Search logic ---------- */
    const WHITE_TYPES = [
      'grocery_or_supermarket',
      'convenience_store',
      'department_store',
      'store',
    ];
    const NAME_RE =
    /grocery|supermarket|market|mart|food|foods|walmart|target|kroger|safeway|aldi|costco|fresh|save on|save-on-foods/i;
  
    const nearbyOnce = async (
      keyword: string,
      radius: number,
      token?: string
    ): Promise<{
      results: Place[];
      next_page_token?: string;
      status: string;
    }> => {
      const key = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;
      if (!key) throw new Error('Missing Google API key');
  
      const params: any = {
        key,
        location: `${curLoc!.latitude},${curLoc!.longitude}`,
        radius,
        keyword,
        type: 'grocery_or_supermarket',
      };
      if (token) params.pagetoken = token;
  
      const { data } = await axios.get(
        'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
        { params }
      );
      return data;
    };
  
    const fitToMarkers = (ps: Place[]) => {
      if (!curLoc || ps.length === 0 || !mapRef.current) return;
      
      // Collapse the panel if expanded
      if (isExpanded) {
        Animated.spring(resHeight, {
          toValue: COLLAPSED,
          useNativeDriver: false,
        }).start();
        setIsExpanded(false);
      }
      
      const pts = [
        { latitude: curLoc.latitude, longitude: curLoc.longitude },
        ...ps.map((p) => ({
          latitude: p.geometry.location.lat,
          longitude: p.geometry.location.lng,
        })),
      ];
      const minLat = Math.min(...pts.map((p) => p.latitude));
      const maxLat = Math.max(...pts.map((p) => p.latitude));
      const minLng = Math.min(...pts.map((p) => p.longitude));
      const maxLng = Math.max(...pts.map((p) => p.longitude));
      const r = {
        latitude: (minLat + maxLat) / 2,
        longitude: (minLng + maxLng) / 2,
        latitudeDelta: Math.max(maxLat - minLat + 0.02, 0.02),
        longitudeDelta: Math.max(maxLng - minLng + 0.02, 0.02),
      };
      mapRef.current.animateToRegion(r, 700);
      setRegion(r);
    };
  
    const handleSearch = useCallback(async () => {
      if (!curLoc) {
        Alert.alert('Location needed', 'Please get your location first');
        return;
      }
      const kw = query.trim();
      if (!kw) {
        Alert.alert('Input needed', 'Enter an ingredient or store name');
        return;
      }
  
      setLoading(true);
      setErr(null);
      setPlaces([]);
      setSelPlace(null);
  
      try {
        let rKm = radiusKm;
        for (let attempt = 0; attempt < 3; attempt++) {
          const radiusM = rKm * 1000;
          let token: string | undefined;
          let page = 0;
          let collected: Place[] = [];
  
          do {
            const res = await nearbyOnce(kw, radiusM, token);
            if (res.status !== 'OK' && res.status !== 'ZERO_RESULTS')
              throw new Error(res.status);
            collected = [...collected, ...res.results];
            token = res.next_page_token;
            page++;
            if (token) await sleep(2000);
          } while (token && page < 3);
  
          const filtered = collected.filter((p) => {
            if (!p.place_id || !p.geometry?.location) return false;
            if (p.types?.some((t) => WHITE_TYPES.includes(t))) return true;
            if (NAME_RE.test(p.name)) return true;
            return false;
          });
  
          if (filtered.length) {
            const uniq = Array.from(
              new Map(
                filtered.map((p) => [
                  p.place_id,
                  {
                    ...p,
                    distance: kmBetween(
                      curLoc.latitude,
                      curLoc.longitude,
                      p.geometry.location.lat,
                      p.geometry.location.lng
                    ),
                    isGroceryStore: true,
                  } as Place,
                ])
              ).values()
            ).sort((a, b) => (a.distance! - b.distance!));
  
            setPlaces(uniq);
            setTimeout(() => fitToMarkers(uniq), 400);
            return;
          }
          rKm *= 1;
        }
        setErr('No matching stores found nearby. Try a larger radius or another keyword.');
      } catch (e: any) {
        console.error(e);
        setErr(e.message || 'Search failed');
      } finally {
        setLoading(false);
      }
    }, [query, curLoc, radiusKm]);
  
    /* ---------- Marker press / detail ---------- */
    const DOUBLE_DELAY = 300;
    const onMarkerPress = (p: Place, isMapMarker: boolean = false) => {
      if (!mapRef.current) return;
      const now = Date.now();
      const dbl = now - lastTap < DOUBLE_DELAY;
      setLastTap(now);
      
      // For map markers, check if it's the second click on the same marker
      const isSecondClickOnSameMarker = isMapMarker && lastClickedMarkerId === p.place_id;
      
      // Update the last clicked marker ID
      setLastClickedMarkerId(isMapMarker ? p.place_id : null);
      
      setSelPlace(p);
      
      // Find the index of the selected place to scroll to it
      const index = places.findIndex(place => place.place_id === p.place_id);
      
      // Collapse the panel if expanded
      if (isExpanded) {
        Animated.spring(resHeight, {
          toValue: COLLAPSED,
          useNativeDriver: false,
        }).start();
        setIsExpanded(false);
      }
      
      // Scroll to the selected item with a slight delay to ensure it happens after collapse
      if (index !== -1 && listRef.current) {
        setTimeout(() => {
          listRef.current?.scrollToIndex({
            index,
            animated: true,
            viewOffset: 8,
          });
        }, 300);
      }
  
      mapRef.current.animateToRegion(
        {
          latitude: p.geometry.location.lat,
          longitude: p.geometry.location.lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        500
      );
      
      // Show the marker's callout when selected from list or map
      if (markerRefs.current[p.place_id]) {
        setTimeout(() => {
          markerRefs.current[p.place_id]?.showCallout();
        }, 600); // Delay to allow map animation to complete
      }
  
      // Show detail view if:
      // 1. It's a double tap on list item, OR
      // 2. It's the second click on the same map marker
      if ((!isMapMarker && dbl) || isSecondClickOnSameMarker) {
        setShowDetail(true);
      }
    };
  
    /* ---------- Render ---------- */
    if (!region)
      return (
        <View style={[styles.center, { backgroundColor: theme.background }]}>
          <ActivityIndicator size="large" color={theme.navigationBackgroundColor} />
          <Text style={{ color: theme.text, marginTop: 10 }}>Locating…</Text>
        </View>
      );
  
    return (
      <View style={styles.container}>
        {/* --- Search bar --- */}
        <View
          style={[
            styles.searchContainer,
            {
              backgroundColor: theme.cardBackground,
              borderColor:
                theme.background === '#131313' ? '#444' : theme.navigationBackgroundColor,
            },
          ]}
        >
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search ingredients / stores…"
            placeholderTextColor="#888"
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          <TouchableOpacity
            onPress={handleSearch}
            disabled={loading}
            style={styles.searchIcon}
          >
            <Ionicons name="search" size={20} color={loading ? '#aaa' : theme.text} />
          </TouchableOpacity>
        </View>
  
        {/* --- Radius buttons --- */}
        <View style={styles.radiusContainer}>
          <Text style={[styles.radiusLabel, { color: theme.text }]}>
            Radius: {radiusKm} km
          </Text>
          <View style={styles.sliderWrapper}>
            {[1, 3, 5, 10, 20].map((r) => (
              <TouchableOpacity
                key={r}
                style={[
                  styles.radiusBtn,
                  radiusKm === r && styles.radiusBtnActive,
                ]}
                onPress={() => setRadiusKm(r)}
              >
                <Text style={radiusKm === r ? styles.radiusTxtActive : styles.radiusTxt}>
                  {r}k
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
  
        {/* --- Map --- */}
        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            style={styles.map}
            region={region}
            showsUserLocation
            showsMyLocationButton={false}
          >
            {curLoc && <Marker coordinate={curLoc} title="You" pinColor="#7B68EE" />}
            {places.map((p) => (
              <Marker
                key={p.place_id}
                ref={(ref) => (markerRefs.current[p.place_id] = ref)}
                coordinate={{
                  latitude: p.geometry.location.lat,
                  longitude: p.geometry.location.lng,
                }}
                title={p.name}
                description={
                  p.distance ? `${p.distance.toFixed(1)} km away` : (p.formatted_address || p.vicinity || '')
                }
                onPress={() => onMarkerPress(p, true)}
                onCalloutPress={() => setShowDetail(true)}
                tracksViewChanges={false}
              />
            ))}
          </MapView>
  
          {/* Action buttons on map */}
          <View style={styles.mapButtonsContainer}>
            {places.length > 0 && (
              <TouchableOpacity 
                style={[styles.mapButton, styles.fitButton]} 
                onPress={() => fitToMarkers(places)}
              >
                <Ionicons 
                  name="contract" 
                  size={22} 
                  color="#fff" 
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              style={styles.mapButton} 
              onPress={locate}
            >
              <Ionicons 
                name="locate" 
                size={22} 
                color="#fff" 
              />
            </TouchableOpacity>
          </View>
  
          {/* Loading overlay */}
          {loading && (
            <View style={styles.mapLoader}>
              <ActivityIndicator size="large" color={theme.navigationBackgroundColor} />
            </View>
          )}
  
          {/* Detail modal */}
          {showDetail && selPlace && (
            <View style={styles.detailMask}>
              <View style={styles.detailBox}>
                <View style={styles.detailHeader}>
                  <Text style={styles.detailTitle}>
                    {selPlace.name}
                    {selPlace.isGroceryStore && ' 🛒'}
                  </Text>
                  <TouchableOpacity onPress={() => setShowDetail(false)}>
                    <Ionicons name="close" size={24} />
                  </TouchableOpacity>
                </View>
                <ScrollView style={{ padding: 15 }}>
                  <Text style={styles.detailLine}>
                    📍 {selPlace.formatted_address || selPlace.vicinity || 'No address'}
                  </Text>
                  {selPlace.distance && (
                    <Text style={styles.detailLine}>
                      🚗 {selPlace.distance.toFixed(1)} km away
                    </Text>
                  )}
                  {selPlace.rating && (
                    <Text style={styles.detailLine}>
                      ⭐ {selPlace.rating} ({selPlace.user_ratings_total})
                    </Text>
                  )}
                  {selPlace.opening_hours && (
                    <Text style={styles.detailLine}>
                      🕑 {selPlace.opening_hours.open_now ? 'Open now' : 'Closed'}
                    </Text>
                  )}
                  {selPlace.types && (
                    <Text style={styles.detailLine}>
                      🏷️{' '}
                      {selPlace.types
                        .filter((t) => !['point_of_interest', 'establishment'].includes(t))
                        .map((t) => t.replace(/_/g, ' '))
                        .join(', ')}
                    </Text>
                  )}
                </ScrollView>
              </View>
            </View>
          )}
        </View>
  
        {/* --- Results list --- */}
        <Animated.View
          style={[
            styles.resultsBox,
            { height: resHeight, backgroundColor: theme.cardBackground },
          ]}
        >
          <View style={styles.dragHandle} {...panResponder.panHandlers}>
            <View
              style={[
                styles.dragBar,
                { backgroundColor: theme.background === '#131313' ? '#555' : '#ccc' },
              ]}
            />
          </View>
  
          {/* Results count */}
          <View style={styles.resultsHeader}>
            {places.length > 0 && (
              <Text style={[styles.resultsCount, { color: theme.text }]}>
                {places.length} result{places.length !== 1 ? 's' : ''}
              </Text>
            )}
          </View>
  
          {err && <Text style={styles.errTxt}>{err}</Text>}
  
          {places.length === 0 ? (
            <Text style={[styles.placeholder, { color: theme.text }]}>
              Search results will appear here…
            </Text>
          ) : (
            <FlatList
              ref={listRef}
              data={places}
              keyExtractor={(i) => i.place_id}
              contentContainerStyle={styles.resultsList}
              onScrollToIndexFailed={(info) => {
                // Handle potential failures (when item is not in visible range)
                setTimeout(() => {
                  if (listRef.current) {
                    listRef.current.scrollToOffset({
                      offset: info.averageItemLength * info.index,
                      animated: true,
                    });
                  }
                }, 100);
              }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.resultItem,
                    selPlace?.place_id === item.place_id && [
                      styles.resultSel,
                      { borderLeftColor: theme.navigationBackgroundColor || '#7B68EE' },
                    ],
                  ]}
                  onPress={() => onMarkerPress(item)}
                  activeOpacity={0.7}
                >
                  <View style={styles.resultContent}>
                    <Text
                      style={[
                        styles.resultName,
                        { color: theme.text },
                        item.isGroceryStore && [
                          styles.resultGro,
                          { color: theme.navigationBackgroundColor || '#007bff' },
                        ],
                      ]}
                      numberOfLines={1}
                    >
                      {item.name}
                    </Text>
                    <Text style={[styles.resultAddr, { color: '#666' }]} numberOfLines={2}>
                      {item.distance ? `${item.distance.toFixed(1)} km • ` : ''}
                      {item.formatted_address || item.vicinity || ''}
                    </Text>
                  </View>
                  <View style={styles.resultIndicator}>
                    <Ionicons
                      name="chevron-forward"
                      size={18}
                      color={theme.background === '#131313' ? '#555' : '#ccc'}
                    />
                  </View>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => (
                <View style={[styles.separator, { backgroundColor: '#eee' }]} />
              )}
              showsVerticalScrollIndicator={false}
            />
          )}
        </Animated.View>
      </View>
    );
  }
  
  /* ---------- Styles ---------- */
  const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  
    /* Search */
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      margin: 12,
      borderWidth: 1,
      borderRadius: 8,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    },
    searchInput: { flex: 1, paddingVertical: 10, paddingLeft: 12, fontSize: 16 },
    searchIcon: { padding: 10 },
  
    /* Radius */
    radiusContainer: { paddingHorizontal: 12, marginBottom: 6 },
    radiusLabel: { fontSize: 13, marginBottom: 4 },
    sliderWrapper: { flexDirection: 'row', justifyContent: 'space-between' },
    radiusBtn: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 14,
      backgroundColor: '#eee',
    },
    radiusBtnActive: { backgroundColor: '#7B68EE' },
    radiusTxt: { fontSize: 12, color: '#555' },
    radiusTxtActive: { fontSize: 12, color: '#fff', fontWeight: '600' },
  
    /* Map */
    mapContainer: { flex: 1 },
    map: { ...StyleSheet.absoluteFillObject },
    mapButtonsContainer: {
      position: 'absolute',
      right: 16,
      bottom: 166, // Position above the results container (150 + padding)
      alignItems: 'center',
    },
    mapButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: '#7B68EE',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      elevation: 5,
    },
    fitButton: {
      backgroundColor: '#5553B7',
    },
    mapLoader: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.25)',
      justifyContent: 'center',
      alignItems: 'center',
    },
  
    /* Results panel */
    resultsBox: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -3 },
      shadowOpacity: 0.15,
      shadowRadius: 5,
    },
    dragHandle: { height: 24, justifyContent: 'center', alignItems: 'center' },
    dragBar: { width: 40, height: 5, borderRadius: 3 },
  
    /* Results header with count */
    resultsHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingBottom: 8,
    },
    resultsCount: {
      fontSize: 15,
      fontWeight: '500',
    },
  
    placeholder: { textAlign: 'center', marginTop: 40, fontSize: 15 },
    resultsList: { paddingHorizontal: 16, paddingBottom: 20 },
    resultItem: { paddingVertical: 12, flexDirection: 'row', alignItems: 'center' },
    resultSel: {
      backgroundColor: 'rgba(123,104,238,0.12)',
      borderLeftWidth: 4,
      paddingLeft: 12,
      marginLeft: -16,
      borderRadius: 4,
    },
    resultContent: { flex: 1, paddingHorizontal: 8 },
    resultIndicator: { paddingRight: 8 },
    separator: { height: 1 },
    resultName: { fontSize: 16, fontWeight: '500', marginBottom: 4 },
    resultGro: { fontWeight: '700' },
    resultAddr: { fontSize: 13 },
    errTxt: { color: 'red', textAlign: 'center', padding: 16, fontWeight: '500' },
  
    /* Detail modal */
    detailMask: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    detailBox: {
      width: '90%',
      maxHeight: '80%',
      backgroundColor: '#fff',
      borderRadius: 12,
      overflow: 'hidden',
    },
    detailHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
    },
    detailTitle: { fontSize: 18, fontWeight: 'bold', flex: 1 },
    detailLine: { marginBottom: 8, fontSize: 15 },
  });
  