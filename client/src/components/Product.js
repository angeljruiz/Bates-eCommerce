import React from 'react';
import { Link } from 'react-router-dom';

import '../css/components/Product.scss';

export default ({product, addProduct, dispatch}) => (
    <div className='Product'>
        <Link to={`/viewproduct/${product.sku}`} >
            <div className='card mb-3'>
                <div className='card-header'>
                    <img className='product-header-img rounded' src={product.image} alt='Main product' />
                    <h1>{product.name}</h1>
                </div>
                <div className='card-body px-2'>
                    <h2 className='text-muted'>${product.price}</h2>
                    <p>{product.description}</p>
                    <button className='btn btn-outline-primary form-control' onClick={ function(e) { e.preventDefault(); dispatch(addProduct(product, 1))}}>Add to cart</button>
                </div>
            </div>
        </Link>
    </div>
)
 
