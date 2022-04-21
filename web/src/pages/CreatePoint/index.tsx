import React, {
  useState,
  useEffect,
  ChangeEvent,
  FormEvent,
} from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import { FiArrowLeft } from 'react-icons/fi';
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from 'react-leaflet';

import api from '../../services/api';

import './styles.css';

import logo from '../../assets/logo.svg';

interface Item {
  id: number;
  title: String;
  image_url: String;
}

interface IBGEUFResponse {
  sigla: String;
}

interface IBGECityResponse {
  nome: String;
}

const CreatePoint = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [ufs, setUfs] = useState<String[]>([]);
  const [cities, setCities] = useState<String[]>([]);

  const [initialPosition, setInitialPosition] = useState<
    [number, number]
  >([-23.5740177, -46.6226925]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
  });

  const [selectedUf, setSelectedUf] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');
  const [selectedPosition, setSelectedPosition] =
    useState<[number, number]>(initialPosition);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const history = useHistory();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      setInitialPosition([latitude, longitude]);
    });
  }, []);

  useEffect(() => {
    (async () => {
      const items = await api.get('items');
      setItems(items.data);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const ufs = await axios.get<IBGEUFResponse[]>(
        'https://servicodados.ibge.gov.br/api/v1/localidades/estados'
      );
      const ufInitials = ufs.data.map(uf => uf.sigla);
      setUfs(ufInitials);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (selectedUf === '0') return;

      const cities = await axios.get<IBGECityResponse[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`
      );
      const cityNames = cities.data.map(city => city.nome);
      setCities(cityNames);
    })();
  }, [selectedUf]);

  function handleSelectUf(e: ChangeEvent<HTMLSelectElement>) {
    const uf = e.target.value;
    setSelectedUf(uf);
  }

  function handleSelectCity(e: ChangeEvent<HTMLSelectElement>) {
    const city = e.target.value;
    setSelectedCity(city);
  }

  function MapInteractions() {
    const map = useMapEvents({
      click: location => {
        setSelectedPosition([
          location.latlng.lat,
          location.latlng.lng,
        ]);
        map.flyTo(location.latlng, 15);
      },
    });
    return null;
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  }

  function handleSelectItem(id: number) {
    const alreadySelected = selectedItems.findIndex(
      item => item === id
    );

    if (alreadySelected >= 0) {
      const filteredItems = selectedItems.filter(item => item !== id);
      setSelectedItems(filteredItems);
    } else setSelectedItems([...selectedItems, id]);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const { name, email, whatsapp } = formData;
    const [latitude, longitude] = selectedPosition;
    const uf = selectedUf;
    const city = selectedCity;
    const items = selectedItems;

    const data = {
      name,
      email,
      whatsapp,
      uf,
      city,
      latitude,
      longitude,
      items,
    };

    const response = await api.post('points', data);
    alert(response.data.message);

    history.push('/');
  }

  return (
    <div id='page-create-point'>
      <div className='content'>
        <header>
          <img src={logo} alt='Ecoleta' />
          <Link to='/'>
            <FiArrowLeft />
            Voltar para home
          </Link>
        </header>

        <form onSubmit={handleSubmit}>
          <h1>
            Cadastro do <br /> ponto de coleta
          </h1>

          <fieldset>
            <legend>
              <h2>Dados</h2>
            </legend>

            <div className='field'>
              <label htmlFor='name'>Nome da entidade</label>
              <input
                type='text'
                name='name'
                id='name'
                onChange={handleInputChange}
              />
            </div>

            <div className='field-group'>
              <div className='field'>
                <label htmlFor='email'>Email</label>
                <input
                  type='email'
                  name='email'
                  id='email'
                  onChange={handleInputChange}
                />
              </div>

              <div className='field'>
                <label htmlFor='whatsapp'>Whatsapp</label>
                <input
                  type='text'
                  name='whatsapp'
                  id='whatsapp'
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>
              <h2>Endereço</h2>
              <span>Selecione o endereço no mapa</span>
            </legend>

            <MapContainer center={initialPosition} zoom={15}>
              <MapInteractions />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
              />
              <Marker position={selectedPosition} />
            </MapContainer>

            <div className='field-group'>
              <div className='field'>
                <label htmlFor='uf'>Estado (UF)</label>
                <select
                  name='uf'
                  id='uf'
                  onChange={handleSelectUf}
                  value={selectedUf}>
                  <option value='0'>Selecione uma UF</option>
                  {ufs.map(uf => (
                    <option key={String(uf)} value={String(uf)}>
                      {uf}
                    </option>
                  ))}
                </select>
              </div>

              <div className='field'>
                <label htmlFor='city'>Cidade</label>
                <select
                  name='city'
                  id='city'
                  onChange={handleSelectCity}
                  value={selectedCity}>
                  <option value='0'>Selecione uma cidade</option>
                  {cities.map(city => (
                    <option key={String(city)} value={String(city)}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>
              <h2>Ítens de coleta</h2>
              <span>Selecione um ou mais ítens de coleta</span>
            </legend>

            <ul className='items-grid'>
              {items.map(item => (
                <li
                  className={
                    selectedItems.includes(item.id) ? 'selected' : ''
                  }
                  key={item.id}
                  onClick={() => handleSelectItem(item.id)}>
                  <img
                    src={String(item.image_url)}
                    alt={String(item.title)}
                  />
                  <span>{item.title}</span>
                </li>
              ))}
            </ul>
          </fieldset>

          <button type='submit'>Cadastrar ponto de coleta</button>
        </form>
      </div>
    </div>
  );
};

export default CreatePoint;
