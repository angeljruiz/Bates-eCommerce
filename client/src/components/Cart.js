import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import CartItem from './CartItem';

import '../css/components/Cart.scss';

function Cart(props) {
    let history = useHistory();

    function gotoCheckout(e) {
        this.hide(e);
        history.push('/checkout');
    }

    return(
        <aside className='cart-dropdown'>
            { Object.keys(props.products || {}).map( (k, i) => <CartItem product={props.products[k]} totalItems={props.totalItems} key={i} />)}
            <Card>
                <Card.Body className='text-left'>
                    <p>Total <em className='cart-total'>${ Object.keys(props.products || {}).reduce( (s, k) => s + props.products[k].price * props.products[k].amount, 0).toFixed(2) }</em></p>
                    <Button variant='outline-primary' onClick={gotoCheckout.bind(props)}>Checkout</Button>
                </Card.Body>
            </Card>
        </aside>
)}

Cart.propTypes = {
    products: PropTypes.object,
    totalItems: PropTypes.number,
    hide: PropTypes.func
};

export default Cart;