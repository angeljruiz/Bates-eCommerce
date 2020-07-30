import React from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { Typography, Paper, Grid, Box, makeStyles } from "@material-ui/core";

import { addProduct } from "../../actions/productsActions";

import Product from "../Product/Product";

const useStyles = makeStyles((theme) => ({
  container: {
    width: "100%",
  },
}));

function Landing() {
  const products = useSelector((state) => state.products, shallowEqual);
  const dispatch = useDispatch();
  const classes = useStyles();

  fetch("/storelanding").then(async (newproducts) => {
    let images = [];
    newproducts = await newproducts.json();
    if (products.length === 0) return;
    newproducts = newproducts.filter(
      (p) => products.findIndex((s) => s.sku === p.sku) === -1
    );
    newproducts.forEach((product) => {
      images.push(fetch("/main?sku=" + product.sku));
    });
    Promise.all(images).then((data) => {
      data = data.map((d) => d.blob());
      Promise.all(data).then((data) => {
        newproducts = newproducts.map((p, index) => {
          p.image = URL.createObjectURL(data[index]);
          return p;
        });
        if (newproducts.length > 0) dispatch(addProduct(newproducts));
      });
    });
  });
  return (
    <Grid>
      <Grid item xs={12}>
        <Box mb={3}>
          <Paper>
            <Typography variant="h2" align="center">
              Featured
            </Typography>
          </Paper>
        </Box>
      </Grid>
      <Grid
        container
        direction="row"
        justify="space-around"
        // spacing={2}
        className={classes.container}
      >
        {products.map((product, i) => (
          <Grid item xs={12} md={4} key={i}>
            <Box mb={2}>
              <Product sku={product.sku} />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
}

export default Landing;
