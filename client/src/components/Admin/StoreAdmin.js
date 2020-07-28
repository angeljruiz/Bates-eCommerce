import React from "react";
import { connect } from "react-redux";

import Container from "react-bootstrap/Container";
import Jumbotron from "react-bootstrap/Jumbotron";
import Button from "@material-ui/core/Button";

class StoreAdmin extends React.Component {
  render() {
    return (
      <article className="text-left StoreAdmin">
        <Jumbotron fluid className="mb-3 text-center">
          <Container>
            <h1>##Store Name</h1>
          </Container>
        </Jumbotron>
        <section>
          <aside>
            <h3 className="d-inline-block mr-3">Orders: 0</h3>
            <h3 className="d-inline-block">Revenue: 0</h3>
          </aside>
          <Button variant="contained" color="primary">
            Products
          </Button>
        </section>
        <hr />
      </article>
    );
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

export default connect(mapStateToProps, mapDispatchToProps)(StoreAdmin);
