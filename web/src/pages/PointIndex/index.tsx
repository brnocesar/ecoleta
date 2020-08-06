import React, { useState, useEffect, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './styles.css';
import NavHeader from '../../components/NavHeader';
import api from '../../services/api';


interface UF {
    id: number;
    sigla: string;
    nome: string;
};

interface City {
    id: number;
    nome: string;
};

interface Point {
    id: number;
    name: string;
    city: string;
    uf: string;
    image_url: string;
    items: string;
};

const PointIndex = () => {

    const [ufs, setUfs] = useState<UF[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [selectedUf, setSelectedUf] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [points, setPoints] = useState<Point[]>([]);


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
        api.get('points').then(response => {
            setPoints(response.data);
        });
    }, []);


    function handleSelectedUf(event: ChangeEvent<HTMLSelectElement>) {
        const uf = event.target.value;

        setSelectedUf(uf);

        if ( uf === '' ) setSelectedCity('');
    }

    function handleSelectedCity(event: ChangeEvent<HTMLSelectElement>) {
        setSelectedCity(event.target.value);
    }

    function handleFilter() {
        api.get('points', {
            params: {
                uf: selectedUf,
                city: selectedCity
            }
        }).then(response => {
            setPoints(response.data);
        });
    }
    

    return (

        <div id="page-index-point">
            <div className="container">
                <NavHeader />

                <main>
                    <h1>Pontos de coleta</h1>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado</label>
                            <select 
                                name="uf" 
                                id="uf" 
                                value={selectedUf} 
                                onChange={handleSelectedUf}
                            >
                                <option value="">Todos os Estados</option>
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
                                    { !selectedUf ? "Selecione um Estado" : "Selecione uma Cidade" }
                                </option>
                                {cities.map(city => (
                                    <option key={city.id} value={city.nome}>{city.nome}</option>
                                ))}
                            </select>
                        </div>
                        <button onClick={handleFilter}>
                            Filtrar
                        </button>
                    </div>

                    { points.length === 0 ? (

                        <span className="not-found">Não foram encontrados Pontos de coleta nessa região</span>
                        
                        ) : (

                        <ul className="points-grid">
                            {points.map(point => (
                                <li 
                                    key={point.id}
                                    className="point-box"
                                >
                                    <Link to={`/pontos/${point.id}`}>
                                        <img src={point.image_url} alt={point.name} />
                                    </Link>
                                    <h2>{point.name}</h2>
                                    <h3>{point.items}</h3>
                                    <span>
                                        {point.city}, {point.uf}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}

                </main>

            </div>
        </div>
    );
};

export default PointIndex;