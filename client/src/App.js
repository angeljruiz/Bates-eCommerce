import React from 'react';
import { Provider } from 'react-redux';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSignOutAlt, faSignInAlt, faShoppingCart, faUserCircle } from '@fortawesome/free-solid-svg-icons'
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons'

import AppRouter from './router/AppRouter';
import configureStore from './store/configureStore';
import { init } from './actions/accountActions';
import { addProduct } from './actions/productsActions';

import './App.scss';

const store = configureStore();
library.add( faSignInAlt, faSignOutAlt, faShoppingCart, faLinkedin, faGithub, faUserCircle );

export default class App extends React.Component {
  componentDidMount() {        
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
    fetch('/isLogged').then( data => data.json()).then( data => {
      store.dispatch(init(data))
    });
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
 