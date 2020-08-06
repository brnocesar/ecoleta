import React from 'react';
import { FiSearch, FiEdit } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import './styles.css';
import NavHeader from '../../components/NavHeader';

const Home = () => {

    return (

        <div id="page-home">
            <div className="content">
            
                <NavHeader />

                <main>
                    <h1>Seu marketplace de coleta de resíduos</h1>
                    <p>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente</p>

                    <div className="buttons">
                        <Link to="/pontos">
                            <span>
                                <FiSearch />
                            </span>
                            <strong>
                                Encontre um ponto próximo de você
                            </strong>
                        </Link>
                        <Link to="/cadastro">
                            <span>
                                <FiEdit />
                            </span>
                            <strong>
                                Cadastre um ponto de coleta
                            </strong>
                        </Link>
                    </div>
                </main>

            </div>
        </div>
    );
};

export default Home;