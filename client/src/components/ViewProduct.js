import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const ViewProduct = ({product}) => {
    return <div className='card'>
        <div className='card-header'>
            <img src={product.image} alt='main' />
            <h1>{product.name}</h1>
        </div>
        <div className='card-body'>
            <h3 className='text-muted'>${product.price}</h3>
            <p>{product.description}</p>
            <button className='btn btn-outline-primary form-control'>Add to cart</button>
        </div>
    </div>
}

ViewProduct.propTypes = {
    product: PropTypes.object
}

const mapStateToProps = (state, { match: { params: { sku }}}) => {            
    return { product: state.products.find( t => {
        return t.sku === sku;
    }) || {}};
} 

export default connect(mapStateToProps)(ViewProduct);

        