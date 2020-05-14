import React from 'react';

import CartItem from './CartItem';

import '../css/components/Cart.scss';

export default (props) => {return(
    <aside className='cart-dropdown'>
        { Object.keys(props.products).map( (k, i) => <CartItem product={props.products[k]} key={i} />)}
    </aside>
)}
