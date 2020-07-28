import React from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";

import {
  Button,
  Card,
  CardContent,
  CardActionArea,
  CardMedia,
  CardActions,
  Typography,
  makeStyles,
} from "@material-ui/core";

const useStyles = makeStyles({
  productImg: {
    height: "250px",
  },
});

function Product({ product, addProduct, dispatch }) {
  const history = useHistory();
  const classes = useStyles();
  return (
    <Card>
      <CardActionArea
      // onClick={() => history.push(`/viewproduct/${product.sku}`)}
      >
        <CardMedia
          className={classes.productImg}
          image={product.image}
          title={product.name}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {product.name}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {product.description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button
          color="primary"
          onClick={() => {
            dispatch(addProduct(product, 1));
          }}
        >
          Add to cart
        </Button>
      </CardActions>
    </Card>
  );
}

Product.propTypes = {
  product: PropTypes.object,
  addProduct: PropTypes.func,
  dispatch: PropTypes.func,
};

export default Product;
