import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';

import Home from './pages/Home';
import PointCreate from './pages/PointCreate';
import PointIndex from './pages/PointIndex';
import PointShow from './pages/PointShow';
import MobileScreens from './pages/MobileScreens';

const Routes = () => {

    return (
        <BrowserRouter>
            <Route exact component={Home}           path="/" />
            <Route exact component={PointCreate}    path="/cadastro" />
            <Route exact component={PointIndex}     path="/pontos" />
            <Route exact component={PointShow}      path="/pontos/:id" />
            <Route exact component={MobileScreens}  path="/mobile" />
        </BrowserRouter>
    );
}

export default Routes;
