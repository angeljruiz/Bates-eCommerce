import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  makeStyles,
} from "@material-ui/core";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";

import { showCart } from "../../actions/cartActions";
import { showSidebar } from "../../actions/sidebarActions";

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: 9999,
  },
}));

function Header() {
  const showSB = useSelector((state) => state.sidebar.show);
  const showC = useSelector((state) => state.cart.show);
  const totalItems = useSelector((state) => state.cart.totalItems);
  const classes = useStyles();
  const dispatch = useDispatch();
  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          onClick={() => dispatch(showSidebar(!showSB))}
          aria-label="menu"
        >
          <p className="brand">BE</p>
        </IconButton>
        <div className="brand" />
        <IconButton
          color="inherit"
          edge="end"
          onClick={() => dispatch(showCart(!showC))}
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

export default Header;
