import React from "react";
import { connect } from "react-redux";

class AdminPage extends React.Component {
  render() {
    return <article>hi</article>;
  }
}

const mapStateToProps = ({
  cart: { show, totalItems, products },
  account: { account },
}) => {
  return {
    show,
    account,
    totalItems,
    products,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminPage);
