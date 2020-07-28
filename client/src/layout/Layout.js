import React from "react";
import PropTypes from "prop-types";

import Header from "../components/HeaderFooter/Header";
import Footer from "../components/HeaderFooter/Footer";
import Cart from "../components/Cart/Cart";
import { makeStyles, Grid } from "@material-ui/core";

import Sidebar from "../components/HeaderFooter/Sidebar";

const useStyles = makeStyles((theme) => {
  let bigger = window.innerWidth > theme.breakpoints.values.sm ? true : false;
  let toolbarHeight =
    theme.mixins.toolbar[bigger ? "@media (min-width:600px)" : "minHeight"];
  if (bigger) toolbarHeight = toolbarHeight.minHeight;
  return {
    main: {
      paddingTop: toolbarHeight,
      paddingBottom: toolbarHeight,
    },
  };
});

function Layout(props) {
  const classes = useStyles();
  return (
    <>
      <Cart />
      <Header />
      <Footer />
      <Grid container>
        <Grid item md={2}>
          <Sidebar />
        </Grid>
        <Grid item xs={12} md={10}>
          <main className={classes.main}>{props.children}</main>
        </Grid>
      </Grid>
    </>
  );
}

Layout.propTypes = {
  children: PropTypes.any,
};

export default Layout;
