import React, { useState, useEffect } from 'react';
import Constants from 'expo-constants';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Text,
  TouchableWithoutFeedback,
  SafeAreaView,
  Linking,
} from 'react-native';
import { Feather as Icon, FontAwesome } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RectButton } from 'react-native-gesture-handler';
import * as MailComposer from 'expo-mail-composer';

import api from '../../services/api';

type RootStackParamList = {
  Home: undefined;
  Points: { uf: string; city: string };
  Detail: { point_id: number };
};

type Props = NativeStackScreenProps<
  RootStackParamList,
  'Detail',
  'MyStack'
>;

interface Data {
  point: {
    image: string;
    name: string;
    email: string;
    whatsapp: string;
    city: string;
    uf: string;
  };
  items: { title: string }[];
}

const Detail = ({ navigation, route }: Props) => {
  const [data, setData] = useState<Data>({} as Data);

  useEffect(() => {
    (async () => {
      const response = await api.get(
        `points/${route.params.point_id}`
      );
      setData(response.data);
    })();
  }, []);

  function handleWhatsapp() {
    console.log('wpp');
    Linking.openURL(
      `whatsapp://send?phone=${data.point.whatsapp}&text=Interesse na coleta`
    );
  }

  function handleComposeMail() {
    MailComposer.composeAsync({
      subject: 'Interesse na coleta de resíduos',
      recipients: [data.point.email],
    });
  }

  if (!data.point) return null;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          {/* @ts-ignore */}
          <Icon name='arrow-left' color='#34cb79' size={20} />
        </TouchableOpacity>

        <Image
          style={styles.pointImage}
          source={{
            uri: data.point.image,
          }}
        />

        <Text style={styles.pointName}>{data.point.name}</Text>
        <Text style={styles.pointItems}>
          {data.items.map(item => item.title).join(', ')}
        </Text>

        <View style={styles.address}>
          <Text style={styles.addressTitle}>Endereço</Text>
          <Text style={styles.addressContent}>
            {data.point.city}, {data.point.uf}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableWithoutFeedback onPress={handleWhatsapp}>
          <RectButton style={styles.button}>
            {/* @ts-ignore */}
            <FontAwesome name='whatsapp' size={20} color='#fff' />
            <Text style={styles.buttonText}>Whatsapp</Text>
          </RectButton>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback onPress={handleComposeMail}>
          <RectButton style={styles.button}>
            {/* @ts-ignore */}
            <Icon name='mail' size={20} color='#fff' />
            <Text style={styles.buttonText}>E-mail</Text>
          </RectButton>
        </TouchableWithoutFeedback>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    paddingTop: 20 + Constants.statusBarHeight,
  },

  pointImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
    borderRadius: 10,
    marginTop: 32,
  },

  pointName: {
    color: '#322153',
    fontSize: 28,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 24,
  },

  pointItems: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80',
  },

  address: {
    marginTop: 32,
  },

  addressTitle: {
    color: '#322153',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  },

  addressContent: {
    fontFamily: 'Roboto_400Regular',
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80',
  },

  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#999',
    paddingVertical: 20,
    paddingHorizontal: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  button: {
    width: '48%',
    backgroundColor: '#34CB79',
    borderRadius: 10,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    marginLeft: 8,
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Roboto_500Medium',
  },
});

export default Detail;
