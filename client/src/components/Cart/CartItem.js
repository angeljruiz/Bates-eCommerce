import React from "react";

import {
  removeProductCart,
  incrementProductCart,
  decrementProductCart,
} from "../../actions/cartActions";

import {
  Typography,
  makeStyles,
  IconButton,
  Card,
  CardContent,
  CardActions,
  CardHeader,
  CardMedia,
} from "@material-ui/core";

import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";

import { useSelector, shallowEqual, useDispatch } from "react-redux";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 400,
    marginBottom: theme.spacing(2),
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },

  amount: {
    fontSize: 28,
  },
}));

function CartItem({ sku }) {
  const product = useSelector(
    (state) => state.cart.products[sku],
    shallowEqual
  );
  const dispatch = useDispatch();
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardHeader
        action={
          <IconButton
            onClick={() => dispatch(removeProductCart(product))}
            aria-label="delete"
          >
            <DeleteIcon />
          </IconButton>
        }
        title={product.name}
        subheader={product.price}
      />
      <CardMedia
        className={classes.media}
        image={product.image}
        title={product.name}
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {product.description}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton
          onClick={() => dispatch(decrementProductCart(product))}
          aria-label="add to favorites"
        >
          <RemoveIcon />
        </IconButton>
        <Typography className={classes.amount} variant="body2">
          {product.amount}
        </Typography>
        <IconButton
          aria-label="share"
          onClick={() => dispatch(incrementProductCart(product))}
        >
          <AddIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}

export default CartItem;
