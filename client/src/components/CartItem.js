import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { setProductsCart, showCart } from '../actions/cartActions';

import '../css/components/CartItem.scss';

class CartItem extends React.Component{
    render() { return(
        <div className='cart-item'>
            <div className='card'>
                <div className='card-header' >
                    <Link to={`/viewproduct/${this.props.product.sku}`} >
                        <img className='rounded mr-2 d-inline-block' src={this.props.product.image} alt='Main product' />
                        <div className='d-inline-block'>
                            <h5>{this.props.product.name}</h5>
                            <p className='ml-1 d-inline'>${this.props.product.price}</p>
                            <br /> 
                            <span className='item-total'>${ (this.props.product.price * this.props.product.amount).toFixed(2) }</span>
                        </div>
                    </Link>
                    <div className='amount'> 
                        <span onClick={this.props.decrement(this.props.product)}>{'<'}</span>
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
        },

        hideCart() {
            return function() {
                console.log('@@@@');
                
                dispatch(showCart(false));
            }
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CartItem);


 
