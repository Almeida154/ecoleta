import React, { useState, useEffect } from 'react';
import Constants from 'expo-constants';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MapView, { Marker } from 'react-native-maps';
import { SvgUri } from 'react-native-svg';
import * as Location from 'expo-location';

import api from '../../services/api';

type RootStackParamList = {
  Home: undefined;
  Points: { uf: string; city: string };
  Detail: { point_id: number };
};

type Props = NativeStackScreenProps<
  RootStackParamList,
  'Points',
  'MyStack'
>;

interface Item {
  id: number;
  title: string;
  image_url: string;
}

interface Point {
  id: number;
  name: string;
  image: string;
  image_url: string;
  latitude: number;
  longitude: number;
}

const Points = ({ navigation, route }: Props) => {
  const [items, setItems] = useState<Item[]>([]);
  const [points, setPoints] = useState<Point[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [initialPosition, setInitialPosition] = useState<
    [number, number]
  >([0, 0]);

  useEffect(() => {
    (async () => {
      const items = await api.get('items');
      setItems(items.data);
      console.log(items.data);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      console.log(route.params.city, route.params.uf, selectedItems);

      const points = await api.get('points', {
        params: {
          city: route.params.city,
          uf: route.params.uf,
          items: selectedItems,
        },
      });

      setPoints(points.data);
      console.log(points.data);
    })();
  }, [selectedItems]);

  useEffect(() => {
    (async () => {
      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Oops...',
          'Precisamos de sua permissão para obter a localização'
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync();
      const { latitude, longitude } = location.coords;
      setInitialPosition([latitude, longitude]);
    })();
  }, []);

  function handleSelectItem(id: number) {
    const alreadySelected = selectedItems.findIndex(
      item => item === id
    );

    if (alreadySelected >= 0) {
      const filteredItems = selectedItems.filter(item => item !== id);
      setSelectedItems(filteredItems);
    } else setSelectedItems([...selectedItems, id]);
  }

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          {/* @ts-ignore */}
          <Icon name='arrow-left' color='#34cb79' size={20} />
        </TouchableOpacity>

        <Text style={styles.title}>Bem vindo.</Text>
        <Text style={styles.description}>
          Encontre no mapa um ponto de coleta.
        </Text>

        <View style={styles.mapContainer}>
          {initialPosition[0] !== 0 && (
            <>
              {/* @ts-ignore */}
              <MapView
                style={styles.map}
                loadingEnabled={initialPosition[0] === 0}
                initialRegion={{
                  latitude: initialPosition[0],
                  longitude: initialPosition[1],
                  latitudeDelta: 0.014,
                  longitudeDelta: 0.014,
                }}>
                {points.map(point => (
                  <View key={String(point.id)}>
                    {/* @ts-ignore */}
                    <Marker
                      style={styles.mapMarker}
                      onPress={() =>
                        navigation.navigate('Detail', {
                          point_id: point.id,
                        })
                      }
                      coordinate={{
                        latitude: point.latitude,
                        longitude: point.longitude,
                      }}>
                      <View style={styles.mapMarkerContainer}>
                        <Image
                          style={styles.mapMarkerImage}
                          source={{ uri: point.image_url }}
                        />
                        <Text style={styles.mapMarkerTitle}>
                          {point.name}
                        </Text>
                      </View>
                    </Marker>
                  </View>
                ))}
              </MapView>
            </>
          )}
        </View>
      </View>

      <View style={styles.itemsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 32 }}>
          {items.map(item => (
            <TouchableOpacity
              activeOpacity={0.6}
              key={item.id}
              style={[
                styles.item,
                selectedItems.includes(item.id)
                  ? styles.selectedItem
                  : {},
              ]}
              onPress={() => handleSelectItem(item.id)}>
              <SvgUri uri={item.image_url} width={32} height={32} />
              <Text style={styles.itemTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    backgroundColor: '#f0f0f5',
    paddingTop: 20 + Constants.statusBarHeight,
  },

  title: {
    fontSize: 20,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 24,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 4,
    fontFamily: 'Roboto_400Regular',
  },

  mapContainer: {
    flex: 1,
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 16,
  },

  map: {
    width: '100%',
    height: '100%',
  },

  mapMarker: {
    width: 90,
    height: 80,
  },

  mapMarkerContainer: {
    width: 90,
    height: 70,
    backgroundColor: '#34CB79',
    flexDirection: 'column',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
  },

  mapMarkerImage: {
    width: 90,
    height: 45,
    resizeMode: 'cover',
  },

  mapMarkerTitle: {
    flex: 1,
    fontFamily: 'Roboto_400Regular',
    color: '#FFF',
    fontSize: 13,
    lineHeight: 23,
  },

  itemsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 32,
  },

  item: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#eee',
    height: 120,
    width: 120,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'space-between',

    textAlign: 'center',
  },

  selectedItem: {
    borderColor: '#34CB79',
    borderWidth: 2,
  },

  itemTitle: {
    fontFamily: 'Roboto_400Regular',
    textAlign: 'center',
    fontSize: 13,
  },
});

export default Points;
