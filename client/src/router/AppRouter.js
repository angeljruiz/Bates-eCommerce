import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Layout from '../components/Layout';
import ScrollToTop from '../components/ScrollToTop';

import LandingPage from '../components/LandingPage';
import AdminPage from '../components/AdminPage';
import StoreAdmin from '../components/StoreAdmin';
import Checkout from '../components/Checkout';
import LoginDashboard from '../components/LoginDashboard';
import SignupDashboard from '../components/SignupDashboard';
import ViewProduct from '../components/ViewProduct';



function AppRouter(props) {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <Layout>
                <Switch>
                    <Route path='/' exact component={LandingPage} products={props.products} />
                    <Route path='/admin' exact component={AdminPage} />/
                    <Route path='/storeadmin' exact component={StoreAdmin} />/
                    <Route path='/checkout' exact component={Checkout} cart={props.cart} />
                    <Route path='/login' exact component={LoginDashboard} />/
                    <Route path='/register' exact component={SignupDashboard} />
                    <Route path='/viewproduct/:sku' exact component={ViewProduct}/>
                </Switch>
            </Layout>
        </BrowserRouter>
    )
}

AppRouter.propTypes = {
    products: PropTypes.array,
    cart: PropTypes.object
}

export default AppRouter;