import React from "react";
import { connect } from "react-redux";

import Cart from "../Cart/Cart";

class Checkout extends React.Component {
  render() {
    return (
      <div className="Checkout">
        <Cart products={this.props.products} />
        {/* { Object.keys(this.props.products || {}).map( (k, i) => <CartItem product={this.props.products[k]} key={i} />)} */}
      </div>
    );
  }
}

const mapStateToProps = ({ cart: { products } }) => {
  return {
    products,
  };
};

export default connect(mapStateToProps)(Checkout);
