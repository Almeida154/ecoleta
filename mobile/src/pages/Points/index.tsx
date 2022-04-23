import React from 'react';
import Constants from 'expo-constants';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  Image,
} from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MapView, { Marker } from 'react-native-maps';
import { SvgUri } from 'react-native-svg';

type RootStackParamList = {
  Home: undefined;
  Points: undefined;
  Detail: undefined;
};

type Props = NativeStackScreenProps<
  RootStackParamList,
  'Home',
  'MyStack'
>;

const Points = ({ navigation }: Props) => {
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
          {/* @ts-ignore */}
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: -23.5180352,
              longitude: -46.4104784,
              latitudeDelta: 0.014,
              longitudeDelta: 0.014,
            }}>
            {/* @ts-ignore */}
            <Marker
              style={styles.mapMarker}
              onPress={() => navigation.navigate('Detail')}
              coordinate={{
                latitude: -23.5180352,
                longitude: -46.4104784,
              }}>
              <View style={styles.mapMarkerContainer}>
                <Image
                  style={styles.mapMarkerImage}
                  source={{
                    uri: 'https://images.unsplash.com/photo-1585861299373-491140ca920e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=871&q=60',
                  }}
                />
                <Text style={styles.mapMarkerTitle}>Mercado</Text>
              </View>
            </Marker>
          </MapView>
        </View>
      </View>

      <View style={styles.itemsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 32 }}>
          {[1, 2, 3, 4, 5, 6].map(item => (
            <TouchableOpacity
              key={item}
              style={styles.item}
              onPress={() => {}}>
              <SvgUri
                uri={'http://192.168.0.13:3333/uploads/baterias.svg'}
                width={32}
                height={32}
              />
              <Text style={styles.itemTitle}>Baterias</Text>
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
