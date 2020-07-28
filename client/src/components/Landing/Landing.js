import React from "react";
import { connect } from "react-redux";
import { Typography, Paper, Grid, Box } from "@material-ui/core";

import { addProduct } from "../../actions/productsActions";
import { addProductCart } from "../../actions/cartActions";

import Product from "../Product/Product";

class Landing extends React.Component {
  componentDidMount() {
    fetch("/storelanding").then(async (products) => {
      let images = [];
      products = await products.json();
      if (this.props.products.length === 0) return;
      products = products.filter(
        (p) => this.props.products.findIndex((s) => s.sku === p.sku) === -1
      );
      products.forEach((product) => {
        images.push(fetch("/main?sku=" + product.sku));
      });
      Promise.all(images).then((data) => {
        data = data.map((d) => d.blob());
        Promise.all(data).then((data) => {
          products = products.map((p, index) => {
            p.image = URL.createObjectURL(data[index]);
            return p;
          });
          if (products.length > 0) this.props.dispatch(addProduct(products));
        });
      });
    });
  }
  render() {
    return (
      <article>
        <Grid container direction="row" justify="space-evenly">
          <Grid item xs={12}>
            <Box mb={3}>
              <Paper>
                <Typography variant="h2" align="center">
                  Featured
                </Typography>
              </Paper>
            </Box>
          </Grid>
          {this.props.products.map((product, i) => (
            <Grid item xs={12} md={4} key={i}>
              <Box mb={2}>
                <Product
                  product={{ ...product }}
                  addProduct={addProductCart}
                  dispatch={this.props.dispatch}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      </article>
    );
  }
}

const mapStateToProps = ({ products }) => {
  return {
    products,
  };
};

export default connect(mapStateToProps)(Landing);
