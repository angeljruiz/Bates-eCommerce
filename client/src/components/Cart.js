import React from 'react';
import { connect } from 'react-redux';

import CartItem from './CartItem';

import '../css/components/Cart.scss';

class Cart extends React.Component {
    render() {
        return(
            <aside className='cart-dropdown'>
                { Object.keys(this.props.cart.products).map( (k, i) => <CartItem product={this.props.cart.products[k]} key={i} />)}
            </aside>
    )}

}

function mapStateToProps({ cart }) {
    return { cart }
}

export default connect(mapStateToProps)(Cart);