import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  makeStyles,
  withWidth,
} from "@material-ui/core";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";

import { showCart } from "../../actions/cartActions";
import { showSidebar } from "../../actions/sidebarActions";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: 9999,
  },
}));

function Header({ width }) {
  const showSB = useSelector((state) => state.sidebar.show);
  const showC = useSelector((state) => state.cart.show);
  const totalItems = useSelector((state) => state.cart.totalItems);
  const history = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();

  const handleBrandClick = () => {
    if (width === "xs") {
      dispatch(showSidebar(!showSB));
    } else {
      if (showC) dispatch(showCart(false));
      history.push("/");
    }
  };

  const handleCartClick = () => {
    if (showSB) dispatch(showSidebar(false));
    dispatch(showCart(!showC));
  };

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          onClick={handleBrandClick}
          aria-label="menu"
        >
          <p className="brand">BE</p>
        </IconButton>
        <div className="brand" />
        <IconButton
          color="inherit"
          edge="end"
          onClick={handleCartClick}
          aria-label="menu"
        >
          <Badge badgeContent={totalItems} color="secondary">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default withWidth()(Header);
