import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import './styles.css';
import NavHeader from '../../components/NavHeader';
import api from '../../services/api';


interface Param {
    id: string;
};

interface DataPoint {
    point: {
        image: string;
        image_url: string;
        name: string;
        email: string;
        whatsapp: string;
        city: string;
        uf: string;
    };
    items: {
        title: string;
    }[];
}

const PointShow = () => {

    const param = useParams() as Param;
    const [dataPoint, setDataPoint] = useState<DataPoint>({} as DataPoint);

    useEffect(() => {
        api.get(`points/${param.id}`).then(response => {
            setDataPoint(response.data);
        });
    }, []);


    // isso aqui que impede de quebrar, tem alguma forma de "carregar" o componente apenas quando ja tiver buscado o ponto
    if ( !dataPoint.point ) {
        return null;
    }
    
    return (

        <div id="page-show-point">
            <div className="container">
                <NavHeader />

                <main>
                    <img className="mini-header" src={dataPoint.point.image_url} alt=""/>
                    <h1>{dataPoint.point.name}</h1>
                    <span className="address">{dataPoint.point.city}, {dataPoint.point.uf}</span>

                    <h2>Itens coletados:</h2>
                    <span className="items">
                        {dataPoint.items.map(item => item.title).join(', ')}
                    </span>

                    <h3>Contato</h3>
                    <span>{dataPoint.point.email}</span>
                    <span>{dataPoint.point.whatsapp}</span>
                    


                </main>

            </div>
        </div>
    );
};

export default PointShow;