import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';

let show = false;

function toggler(e) {
  show = !show;
  renderApp();
}

function Tester(props) {
  return (<div>hello {props.name}</div>)
}

Tester.defaultProps = {
  name: 'Angel'
}

function renderApp() {
  ReactDOM.render(
    <React.StrictMode>
      <App />
      <button onClick={toggler}>{!show ? 'Show info' : 'Hide info'}</button>
      <Tester />
      {show && (<p>You found me!</p>)}
    </React.StrictMode>,
    document.getElementById('root')
  );
}

renderApp();



serviceWorker.unregister();
