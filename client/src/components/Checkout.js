import React from 'react';

import CartItem from './CartItem';

import '../css/components/Checkout.scss';
import { faDivide } from '@fortawesome/free-solid-svg-icons';

export default (props) => {
    return (
        <div className='Checkout'>
            { Object.keys(props.cart || {}).map( (k, i) => <CartItem product={props.cart[k]} key={i} />)}
        </div>
    )
}