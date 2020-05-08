import React from 'react';
import ReactDOM from 'react-dom'
import { BrowserRouter, Route } from 'react-router-dom';
import configureStore from './store/configureStore';

import './App.scss';
import '../../vendor/bootstrap.min.css'

import Header from './components/Header.js';
import LoginDashboard from './components/LoginDashboard';
import SignupDashboard from './components/SignupDashboard';

const store = configureStore();

class App extends React.Component {
  render() {
    return (
      <div className="App container-fluid">
        <BrowserRouter>
          <Header />
          <Route path='/login' exact={true} component={LoginDashboard} />
          <Route path='/register' exact={true} component={SignupDashboard} />
        </BrowserRouter>
      </div>
    )
  }
}

ReactDOM.render(<App />, window.document.getElementById('root'));
 