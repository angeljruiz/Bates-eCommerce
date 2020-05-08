import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Header from '../components/Header.js';
import LandingPage from '../components/LandingPage';
import LoginDashboard from '../components/LoginDashboard';
import SignupDashboard from '../components/SignupDashboard';
import ViewProduct from '../components/ViewProduct';



export default (props) => {
    return (
        <BrowserRouter>
            <Header />
            <Switch>
                <Route path='/' exact component={LandingPage} products={props.products} />
                <Route path='/login' exact component={LoginDashboard} />/
                <Route path='/register' exact component={SignupDashboard} />
                <Route path='/auth/google' exact component={() => { 
                    window.location.href = 'http://localhost/auth/google'; 
                    return null;
                }} />
                <Route path='/viewproduct/:sku' exact component={ViewProduct}/>
            </Switch>
        </BrowserRouter>
    )
}
