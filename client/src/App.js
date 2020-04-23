import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
// import configureStore from './store/configureStore';

import './App.scss';

import Header from './components/Header.js';
import LoginDashboard from './components/LoginDashboard';
import SignupDashboard from './components/SignupDashboard';

// const store = configureStore();

function App() {
  return (
    <div className="App container-fluid">
      <BrowserRouter>
        <Header />
        <Route path='/login' exact={true} component={LoginDashboard} />
        <Route path='/register' exact={true} component={SignupDashboard} />
      </BrowserRouter>
    </div>
  );
}

export default App;
 