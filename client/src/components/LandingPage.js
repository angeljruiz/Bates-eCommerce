import React from 'react';
import { connect } from 'react-redux';

import '../css/components/LandingPage.scss';

import { addProduct } from '../actions/productsActions';

import Product from './Product';

class LandingPage extends React.Component {
    componentDidMount() {
        fetch('/storelanding', { method: 'GET', headers: authHeaders()}).then( async products => {
            let images = [];
            products = await products.json();
            if(this.props.products.length === 0) return;
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
    }
    render() {
        return (
            <main className='mt-3'>
                <h1>Featured</h1>
                {this.props.products.map( (product, i) => <Product key={i} product={product}/>)}
            </main>
        )
    }
}

const mapStateToProps = (state) => {
    return {
      products: state.products,
    };
  };

  function authHeaders() {
      return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
  }

export default connect(mapStateToProps)(LandingPage);

