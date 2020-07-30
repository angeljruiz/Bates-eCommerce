import React from "react";
import PropTypes from "prop-types";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Layout from "../layout/Layout";
import ScrollToTop from "../layout/ScrollToTop";

import LandingPage from "../components/Landing/Landing";
import SuperAdmin from "../components/Admin/SuperAdmin";
import StoreAdmin from "../components/Admin/StoreAdmin";
import Checkout from "../components/Checkout/Checkout";
import LoginDashboard from "../components/LoginSignup/LoginDashboard";
import SignupDashboard from "../components/LoginSignup/SignupDashboard";
import ViewProduct from "../components/Product/ViewProduct";

function Router(props) {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout>
        <Switch>
          <Route
            path="/"
            exact
            component={LandingPage}
            products={props.products}
          />
          <Route path="/admin" exact component={SuperAdmin} />
          <Route path="/storeadmin" exact component={StoreAdmin} />
          <Route path="/checkout" exact component={Checkout} />
          <Route path="/login" exact component={LoginDashboard} />
          <Route path="/signup" exact component={SignupDashboard} />
          <Route
            path="/viewproduct/:sku"
            exact
            component={ViewProduct}
            dispatch={props.dispatch}
          />
        </Switch>
      </Layout>
    </BrowserRouter>
  );
}

Router.propTypes = {
  products: PropTypes.array,
  cart: PropTypes.object,
};

export default Router;
