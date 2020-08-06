import React from 'react';
import './styles.css';
import NavHeader from '../../components/NavHeader';

import screen1 from '../../assets/mobile-screens/1-home.png';
import screen2 from '../../assets/mobile-screens/2-point-search.png';
import screen3 from '../../assets/mobile-screens/3-point-index.png';
import screen4 from '../../assets/mobile-screens/4-point-search.png';
import screen5 from '../../assets/mobile-screens/5-point-search.png';
import screen6 from '../../assets/mobile-screens/6-point-detail.png';

const screens = [
    screen1,
    screen2,
    screen3,
    screen4,
    screen5,
    screen6
];


const MobileScreens = () => {

    return (

        <div id="page-mobile-screens">
            <div className="container">
                <NavHeader />

                <main>
                    <h1>Versão mobile</h1>

                    <span>Abaixo são apresentadas as telas da versão mobile da aplicação, onde é possível encontrar Pontos de coleta próximos a sua posição geográfica.</span>

                    <ul className="screens-grid">
                        {screens.map(screen => (
                            <li className="point-box" >
                                <img src={screen} alt="" />
                            </li>
                        ))}
                    </ul>

                </main>

            </div>
        </div>
    );
};

export default MobileScreens;