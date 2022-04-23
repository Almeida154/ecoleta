import React from 'react';
import {
  StyleSheet,
  ImageBackground,
  View,
  Image,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { RectButton } from 'react-native-gesture-handler';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

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

const Home = ({ navigation }: Props) => {
  return (
    // @ts-ignore
    <ImageBackground
      source={require('../../assets/home-background.png')}
      imageStyle={{ width: 274, height: 368 }}
      style={styles.container}>
      <View style={styles.main}>
        <Image source={require('../../assets/logo.png')} />
        <Text style={styles.title}>
          Seu marketplace de coleta de resíduos
        </Text>
        <Text style={styles.description}>
          Ajudamos pessoas a encontrarem pontos de coleta de forma
          eficiente
        </Text>
      </View>

      <View style={styles.footer}>
        <TouchableWithoutFeedback
          onPress={() => navigation.navigate('Points')}>
          <RectButton style={styles.button}>
            <View style={styles.buttonIcon}>
              <Text>
                {/* @ts-ignore */}
                <Icon name='arrow-right' color='#fff' size={24} />
              </Text>
            </View>
            <Text style={styles.buttonText}>Entrar</Text>
          </RectButton>
        </TouchableWithoutFeedback>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    backgroundColor: '#f0f0f5',
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  },
});

export default Home;
