import React from "react";
import PropTypes from "prop-types";
import { makeStyles, Grid } from "@material-ui/core";

import Header from "../components/HeaderFooter/Header";
import Footer from "../components/HeaderFooter/Footer";
import Sidebar from "../components/HeaderFooter/Sidebar";
import Cart from "../components/Cart/Cart";
import dStyles from "../style/style";

const useStyles = makeStyles((theme) => {
  return {
    toolbar: theme.mixins.toolbar,
    main: {
      // flex: 1,
      [theme.breakpoints.up("sm")]: {
        marginLeft: dStyles.drawerWidth,
      },
    },
    bottomPage: {
      marginBottom: theme.spacing(2),
    },
  };
});

function Layout(props) {
  const classes = useStyles();
  return (
    <>
      <div className={classes.toolbar} />
      <Cart />
      <Header />
      <Grid container>
        <Grid item md={2}>
          <Sidebar />
        </Grid>
        <Grid item xs={12}>
          <main className={classes.main}>{props.children}</main>
        </Grid>
      </Grid>
      <div className={`${classes.toolbar} ${classes.bottomPage}`} />
      <Footer />
    </>
  );
}

Layout.propTypes = {
  children: PropTypes.any,
};

export default Layout;
