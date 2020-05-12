import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { setProductsCart } from '../actions/cartActions';

import '../css/components/CartItem.scss';

class CartItem extends React.Component{
    render() { return(
        <div className='cart-item'>
            <div className='card'>
                <div className='card-header'>
                    <Link to={`/viewproduct/${this.props.product.sku}`} >
                        <img className='this.props.product-header-img rounded mr-2 d-inline-block' src={this.props.product.image} alt='Main this.props.product' />
                        <div className='d-inline-block'>
                            <h5>{this.props.product.name}</h5>
                            <h6 className='text-muted ml-2'>${this.props.product.price}</h6>
                            <br /> 
                            <span className='item-total'>${ (this.props.product.price * this.props.product.amount).toFixed(2) }</span>
                            <div className='amount'> 
                                <span onClick={this.props.decrement(this.props.product)}>{'<'}</span>
                                <input type='number' className='text-center' value={ String(this.props.product.amount)} readOnly/>
                                <span onClick={this.props.increment(this.props.product)}>{'>'}</span>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )}
}

function mapStateToProps(_, t) {    
    return {
        ...t
    }
}

function mapDispatchToProps(dispatch) {
    return {
        increment(product) {
            return function(e) {
                e.preventDefault();
                e.stopPropagation();
                dispatch(setProductsCart(product, 1))
            }
        },
        
        decrement(product) {
            return function(e) {
                e.preventDefault();
                e.stopPropagation();
                if (product.amount === 1) return
                dispatch(setProductsCart(product, -1))
            }
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CartItem);


 
