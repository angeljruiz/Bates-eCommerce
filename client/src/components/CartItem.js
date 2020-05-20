import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { addProductCart, showCart, removeProduct } from '../actions/cartActions';

import '../css/components/CartItem.scss';

function hello() {
    console.log('@@@@');
    
}

class CartItem extends React.Component{
    render() { return(
        <div className='cart-item'>
            <div className='card'>
                <div className='card-body' >
                    <Link onClick={this.props.hideCart.bind(this)} to={`/viewproduct/${this.props.product.sku}`}>
                        <img className='rounded mr-2 d-inline-block' src={this.props.product.image} alt='Main product' />
                        <div className='d-inline-block'>
                            <h5>{this.props.product.name}</h5>
                            <p className='ml-1 d-inline'>${this.props.product.price}</p>
                            <br /> 
                            <span className='item-total'>${ (this.props.product.price * this.props.product.amount).toFixed(2) }</span>
                            <br />
                            <span className='text-muted' onClick={this.props.removeProduct(this.props.product).bind(this)}>remove</span>
                        </div>
                    </Link>
                    <div className='amount'> 
                        <span onClick={this.props.decrement(this.props.product).bind(this)}>{'<'}</span>
                        <input type='number' onClick={e => e.stopPropagation() && e.preventDefault()} className='text-center' value={ String(this.props.product.amount)} readOnly/>
                        <span onClick={this.props.increment(this.props.product)}>{'>'}</span>
                    </div>
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

function mapDispatchToProps(dispatch, t, d) {
    return {
        increment(product) {
            return function(e) {
                e.preventDefault();
                e.stopPropagation();
                dispatch(addProductCart(product, 1));
            }
        },
        
        decrement(product) {
            return function(e) {
                e.preventDefault();
                e.stopPropagation();
                if (product.amount === 1) {
                    dispatch(removeProduct(product));    
                    if (this.props.totalItems === 1) dispatch(showCart(false));
                } else {
                    dispatch(addProductCart(product, -1));
                }
            }
        },

        removeProduct(product) {
            return function(e) {
                e.preventDefault();
                e.stopPropagation();
                if (this.props.totalItems - product.amount === 0) dispatch(showCart(false));
                dispatch(removeProduct(product));                
            }
        },

        hideCart() {
            return function() {  
                console.log('@@@@@');
                              
                dispatch(showCart(false));
                this.forceUpdate();
            }
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CartItem);


 
