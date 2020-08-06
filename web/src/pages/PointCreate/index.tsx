import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { useHistory } from 'react-router-dom';
import { Map, Marker, TileLayer } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import './styles.css';
import axios from 'axios';
import api from '../../services/api';
import NavHeader from '../../components/NavHeader';
import Dropzone from '../../components/Dropzone';


interface Item {
    id: number;
    title: string;
    image_url: string;
};

interface UF {
    id: number;
    sigla: string;
    nome: string;
};

interface City {
    id: number;
    nome: string;
};

const PointCreate = () => {

    const [items, setItems] = useState<Item[]>([]);
    const [ufs, setUfs] = useState<UF[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: ''
    });
    const [selectedUf, setSelectedUf] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [initialPosition, setInitialPosition] = useState<[number, number]>([-25.476088, -49.291985]);
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>(initialPosition);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [selectedImage, setSelectedImage] = useState<File>();

    const history = useHistory();

    useEffect(() => {
        api.get('items').then(response => {
            setItems(response.data);
        });
    }, []);

    useEffect(() => {
        axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome').then(response => {
            setUfs(response.data);
        });
    }, []);

    useEffect(() => {
        axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios?orderBy=nome`).then(response => {
            setCities(response.data);
        });
    }, [selectedUf]);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            setInitialPosition([latitude, longitude]);
        });
    }, []);


    function handleSelectedUf(event: ChangeEvent<HTMLSelectElement>) {
        const uf = event.target.value;
        setSelectedUf(uf);
    }

    function handleSelectedCity(event: ChangeEvent<HTMLSelectElement>) {
        setSelectedCity(event.target.value);
    }

    function handleMapClick(event: LeafletMouseEvent) {
        setSelectedPosition([
            event.latlng.lat,
            event.latlng.lng
        ]);
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value});
    }

    function handleSelectItem(id: number) {
        const alreadySelected = selectedItems.findIndex(item => item === id);

        if ( alreadySelected >= 0 ) {
            const filteredItems = selectedItems.filter(item => item !== id);
            setSelectedItems(filteredItems);
            return;
        }
        setSelectedItems([ ...selectedItems, id]);
    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        const { name, email, whatsapp } = formData;
        const uf = selectedUf;
        const city = selectedCity;
        const [latitude , longitude] = selectedPosition;
        const items = selectedItems;

        const data = new FormData();

        data.append('name', name);
        data.append('email', email);
        data.append('whatsapp', whatsapp);
        data.append('uf', uf);
        data.append('city', city);
        data.append('latitude', String(latitude));
        data.append('longitude', String(longitude));
        data.append('items', items.join(','));
        
        if ( selectedImage ) {
            data.append('image', selectedImage);
        }

        await api.post('points', data);

        alert('Ponto de coleta criado');

        history.push('/');
    }


    return (
        <div id="page-create-point">
            <div className="container">
                <NavHeader />

                <form onSubmit={handleSubmit}>
                    <h1>Cadastro do ponto de coleta</h1>

                    <Dropzone onFileUploaded={setSelectedImage} />

                    <fieldset>
                        <legend>
                            <h2>Dados</h2>
                        </legend>

                        <div className="field">
                            <label htmlFor="name">Nome da entidade</label>
                            <input 
                                type="text"
                                name="name"
                                id="name"
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="field-group">
                            <div className="field">
                                <label htmlFor="email">E-mail</label>
                                <input 
                                    type="email"
                                    name="email"
                                    id="email"
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="field">
                                <label htmlFor="whatsapp">WhatsApp</label>
                                <input 
                                    type="text"
                                    name="whatsapp"
                                    id="whatsapp"
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

                        <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
                            <TileLayer
                                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker position={selectedPosition} />
                        </Map>

                        <div className="field-group">
                            <div className="field">
                                <label htmlFor="uf">Estado</label>
                                <select 
                                    name="uf" 
                                    id="uf" 
                                    value={selectedUf} 
                                    onChange={handleSelectedUf}
                                >
                                    <option value="">Selecione o Estado</option>
                                    {ufs.map(uf => (
                                        <option key={uf.id} value={uf.sigla}>{uf.nome}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="field">
                                <label htmlFor="uf">Cidade</label>
                                <select 
                                    name="city" 
                                    id="city" 
                                    value={selectedCity} 
                                    onChange={handleSelectedCity}
                                    disabled={ !selectedUf }
                                >
                                    <option value="">
                                        { !selectedUf ? "Selecione um Estado primeiro" : "Selecione uma Cidade" }
                                    </option>
                                    {cities.map(city => (
                                        <option key={city.id} value={city.nome}>{city.nome}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </fieldset>

                    <fieldset>
                        <legend>
                            <h2>Itens de coleta</h2>
                            <span>Selecione um ou mais items abaixo</span>
                        </legend>

                        <ul className="items-grid">
                            {items.map(item => (
                                <li 
                                    key={item.id} 
                                    onClick={() => handleSelectItem(item.id)}
                                    className={selectedItems.includes(item.id) ? 'selected' : ''}
                                >
                                    <img src={item.image_url} alt="Lâmpadas"/>
                                    <span>{item.title}</span>
                                </li>
                            ))}
                        </ul>
                    </fieldset>

                    <button type="submit">
                        Cadastrar ponto de coleta
                    </button>
                </form>

            </div>
        </div>
    );
};

export default PointCreate;