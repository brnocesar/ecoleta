import React from 'react';
import { Link } from 'react-router-dom';

import './styles.css';
import logo from '../../assets/logo.svg';

const NavHeader = () => {

    return (

        <header>
            <img src={logo} alt="Ecoleta"/>
            <div>
                <Link to="/">
                    Inicio
                </Link>
                <Link to="/pontos">
                    Pontos de coleta
                </Link>
                <Link to="/cadastro">
                    Cadastrar
                </Link>
                <Link to="/mobile">
                    Versão mobile
                </Link>
            </div>
        </header>
    );
};

export default NavHeader;