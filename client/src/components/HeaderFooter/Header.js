import React from "react";

import {
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Typography,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";

import { showCart } from "../../actions/cartActions";
import { showSidebar } from "../../actions/sidebarActions";
import { useSelector, useDispatch } from "react-redux";

function Header() {
  const showSB = useSelector((state) => state.sidebar.show);
  const showC = useSelector((state) => state.cart.show);
  const totalItems = useSelector((state) => state.cart.totalItems);
  const dispatch = useDispatch();
  return (
    <AppBar position="fixed">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          onClick={() => dispatch(showSidebar(!showSB))}
          aria-label="menu"
        >
          <Typography variant="subtitle1">BE</Typography>
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
