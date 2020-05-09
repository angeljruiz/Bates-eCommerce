import React from 'react';
import ReactDOM from 'react-dom'
import { Provider, connect } from 'react-redux';
import Cookies from 'js-cookie'

import AppRouter from './router/AppRouter';
import configureStore from './store/configureStore';
import { init } from './actions/accountActions';
import { addProduct } from './actions/productsActions';

import './vendor/bootstrap.min.css'

import './App.scss';

const store = configureStore();

export default class App extends React.Component {
  componentDidMount() {
    console.log(Cookies.get());
    
    fetch('/storelanding').then( async products => {
      let images = [];
      products = await products.json();
      products = products.filter( p => store.getState().products.findIndex( s => s.sku === p.sku) === -1);
      products.forEach( product => {
          images.push(fetch('/main?sku=' + product.sku));
      });
      Promise.all(images).then( data => {
          data = data.map( d => d.blob());
          Promise.all(data).then( data => {
              products = products.map( (p, index) => { p.image = URL.createObjectURL(data[index]); return p });
              if(products.length > 0)
                  store.dispatch(addProduct(products));
          });
      });
    });
    store.dispatch(init(document.getElementById('logged').value))
  }
  render() {
    return(
      <div className='App'>
        <Provider store={store}>
          <AppRouter products={store.getState().products}/>
        </Provider>
      </div>
    )
  };
}

// const mapStateToProps = (state) => {
//   return {
//     state
//   };
// };

// export default connect(mapStateToProps)(App);
 