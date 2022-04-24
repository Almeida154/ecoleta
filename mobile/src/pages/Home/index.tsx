import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  ImageBackground,
  View,
  Image,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { RectButton } from 'react-native-gesture-handler';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ModalDropdown from 'react-native-modal-dropdown';
import axios from 'axios';

type RootStackParamList = {
  Home: undefined;
  Points: { uf: string; city: string };
  Detail: { point_id: number };
};

type Props = NativeStackScreenProps<
  RootStackParamList,
  'Home',
  'MyStack'
>;

interface IBGEUFResponse {
  sigla: String;
}

interface IBGECityResponse {
  nome: String;
}

const Home = ({ navigation }: Props) => {
  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const [selectedUf, setSelectedUf] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');

  useEffect(() => {
    (async () => {
      const ufs = await axios.get<IBGEUFResponse[]>(
        'https://servicodados.ibge.gov.br/api/v1/localidades/estados'
      );
      const ufInitials = ufs.data.map(uf => uf.sigla.toString());
      setUfs(ufInitials);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (selectedUf === '0') return;

      const cities = await axios.get<IBGECityResponse[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`
      );
      const cityNames = cities.data.map(city => city.nome.toString());
      setCities(cityNames);
    })();
  }, [selectedUf]);

  const ufDropdownRef = useRef<ModalDropdown>();
  const cityDropdownRef = useRef<ModalDropdown>();

  const UfRow = (rowData: string, index: number) => {
    return (
      <TouchableOpacity
        onPress={() => {
          ufDropdownRef.current?.select(index);
          ufDropdownRef.current?.hide();
          setSelectedUf(String(ufs[index]));
        }}
        style={styles.rowContainer}>
        <Text style={styles.rowText}>{rowData}</Text>
      </TouchableOpacity>
    );
  };

  const CityRow = (rowData: string, index: number) => {
    return (
      <TouchableOpacity
        onPress={() => {
          cityDropdownRef.current?.select(index);
          cityDropdownRef.current?.hide();
          setSelectedCity(String(cities[index]));
        }}
        style={styles.rowContainer}>
        <Text style={styles.rowText}>{rowData}</Text>
      </TouchableOpacity>
    );
  };

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
        {/* @ts-ignore */}
        <ModalDropdown
          ref={ufDropdownRef}
          defaultValue='Selecione a UF'
          textStyle={styles.dropdownPlaceholder}
          style={styles.dropdown}
          dropdownStyle={styles.dropdownModal}
          showsVerticalScrollIndicator={false}
          adjustFrame={style => {
            style.left = 32;
            style.right = 32;
            return style;
          }}
          renderRow={UfRow}
          options={ufs}
        />

        {/* @ts-ignore */}
        <ModalDropdown
          ref={cityDropdownRef}
          defaultValue='Selecione a cidade'
          textStyle={styles.dropdownPlaceholder}
          style={styles.dropdown}
          dropdownStyle={styles.dropdownModal}
          showsVerticalScrollIndicator={false}
          adjustFrame={style => {
            style.left = 32;
            style.right = 32;
            return style;
          }}
          renderRow={CityRow}
          options={cities}
        />

        <TouchableWithoutFeedback
          onPress={() =>
            navigation.navigate('Points', {
              uf: selectedUf,
              city: selectedCity,
            })
          }>
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

  dropdown: {
    backgroundColor: '#FFF',
    height: 60,
    borderRadius: 10,
    justifyContent: 'center',
    paddingHorizontal: 24,
    marginBottom: 8,
  },

  dropdownPlaceholder: {
    fontFamily: 'Roboto_400Regular',
    color: '#6C6C80',
    fontSize: 16,
  },

  dropdownModal: {
    overflow: 'hidden',
    borderRadius: 10,
    height: 220,
    elevation: 20,
    shadowColor: '#00000070',
  },

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  rowContainer: {
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  rowText: {
    fontFamily: 'Roboto_400Regular',
    color: '#6C6C80',
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
