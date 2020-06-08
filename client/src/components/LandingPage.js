import React from 'react';
import { connect } from 'react-redux';

import '../css/components/LandingPage.scss';

import { addProduct } from '../actions/productsActions';
import { addProductCart } from '../actions/cartActions';

import Product from './Product';

class LandingPage extends React.Component {
    componentDidMount() {
        fetch('/storelanding').then( async products => {
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
            <article>
                <div className="jumbotron jumbotron-fluid">
                    <div className="container-fluid">
                        <h1>Featured</h1>
                    </div>
                </div>
                {this.props.products.map( (product, i) => <Product key={i} product={{...product}} addProduct={ addProductCart } dispatch={this.props.dispatch}/>)}
            </article>
        )
    }
}

const mapStateToProps = ({products}) => {
    return {
      products,
    };
  };

export default connect(mapStateToProps)(LandingPage);

