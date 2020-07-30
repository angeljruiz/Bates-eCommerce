import React from "react";

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
import { shallowEqual, useSelector, useDispatch } from "react-redux";

import { addProductCart } from "../../actions/cartActions";

const useStyles = makeStyles((theme) => ({
  card: {
    margin: theme.spacing(0, 2),
  },
  productImg: {
    height: "250px",
  },
}));

function Product({ sku }) {
  const product = useSelector(
    (state) => state.products.find((p) => p.sku === sku),
    shallowEqual
  );
  const classes = useStyles();
  const dispatch = useDispatch();

  return (
    <Card className={classes.card}>
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
            dispatch(addProductCart(product, 1));
          }}
        >
          Add to cart
        </Button>
      </CardActions>
    </Card>
  );
}

export default Product;
