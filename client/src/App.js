import React from 'react';
import { connect } from 'react-redux';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSignOutAlt, faSignInAlt, faShoppingCart, faUserCircle } from '@fortawesome/free-solid-svg-icons'
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons'

import AppRouter from './router/AppRouter';
import { init } from './actions/accountActions';
import { addProduct } from './actions/productsActions';

import './App.scss';

library.add( faSignInAlt, faSignOutAlt, faShoppingCart, faLinkedin, faGithub, faUserCircle );

class App extends React.Component {
  componentDidMount() {        
    fetch('/storelanding').then( async products => {
      let images = [];
      products = await products.json();
      products = products.filter( p => this.props.products.findIndex( s => s.sku === p.sku) === -1);
      products.forEach( product => {
          images.push(fetch('/main?sku=' + product.sku));
      });
      Promise.all(images).then( data => {
          data = data.map( d => d.blob());
          Promise.all(data).then( data => {
              products = products.map( (p, index) => { p.image = URL.createObjectURL(data[index]); return p });
              if(products.length > 0)
                  this.props.dispatch(addProduct(products));
          });
      });
    });
    fetch('/isLogged').then( data => data.json()).then( data => {
      this.props.dispatch(init(data))
    });
  }
  render() {
    return(
      <div className={'App ' + (this.props.cart.show ? 'noscroll' : 'noscroll')} >
        <AppRouter products={this.props.products} cart={this.props.cart} />
      </div>
    )
  };
}

 const mapStateToProps = ({ products, cart }) => {
   return {
    products,
    cart
   }
 }

 export default connect(mapStateToProps)(App);