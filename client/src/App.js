import React from 'react';
import { Provider } from 'react-redux';

import configureStore from './store/configureStore';
import AppRouter from './router/AppRouter';

import { addProduct } from './actions/productsActions';

import './App.scss';

const store = configureStore();

class App extends React.Component {
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

export default App;
 