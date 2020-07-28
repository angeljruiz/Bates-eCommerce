import React from "react";
// import { useHistory } from "react-router-dom";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { Modal, makeStyles, Box, Button } from "@material-ui/core";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";

import { showCart } from "../../actions/cartActions";
import CartItem from "./CartItem";

const useStyles = makeStyles((theme) => {
  let bigger = window.innerWidth > theme.breakpoints.values.sm ? true : false;
  let toolbarHeight =
    theme.mixins.toolbar[bigger ? "@media (min-width:600px)" : "minHeight"];
  if (bigger) toolbarHeight = toolbarHeight.minHeight;
  return {
    modal: {
      overflow: "scroll",
    },
    modalBox: {
      paddingBottom: theme.spacing(2),
      position: "absolute",
      top: toolbarHeight,
      right: 0,
    },
  };
});

function Cart() {
  // let history = useHistory();
  let classes = useStyles();
  let { show, products, totalItems } = useSelector(
    (state) => state.cart,
    shallowEqual
  );
  let dispatch = useDispatch();

  if (!show) return <></>;

  if (totalItems === 0) {
    hideCart();
    return <></>;
  }

  function hideCart() {
    dispatch(showCart(false));
  }

  return (
    <>
      <Modal
        open={show}
        className={classes.modal}
        onBackdropClick={hideCart}
        onEscapeKeyDown={hideCart}
      >
        <Box className={classes.modalBox}>
          {Object.keys(products || {}).map((k, i) => (
            <CartItem sku={products[k].sku} key={i} />
          ))}
          <Button
            variant="contained"
            color="primary"
            startIcon={<ShoppingCartIcon />}
            fullWidth
          >
            Checkout
          </Button>
        </Box>
      </Modal>
    </>
  );
}

export default Cart;
