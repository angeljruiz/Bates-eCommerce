import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  AppBar,
  Toolbar,
  IconButton,
  makeStyles,
  Typography,
  Box,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: 1299,
    position: "absolute",
    bottom: 0,
    left: 0,
    top: "auto",
  },

  buttonsContainer: {
    position: "absolute",
    right: theme.spacing(1),
  },

  buttons: {
    color: "white",
  },
}));

export default () => {
  const classes = useStyles();
  return (
    <AppBar position="static" className={classes.appBar} component="footer">
      <Toolbar>
        <Typography>
          <strong>&copy; 2017 RB Implementations</strong>
        </Typography>
        <Box className={classes.buttonsContainer}>
          <IconButton size="small" aria-label="menu">
            <a
              href="https://www.linkedin.com/in/angel-ruiz-bates-1b68a2142/"
              className={classes.buttons}
            >
              <FontAwesomeIcon
                icon={["fab", "linkedin"]}
                size="lg"
                className="mr-2"
              />
            </a>
          </IconButton>
          <IconButton size="small" aria-label="menu">
            <a href="https://github.com/angeljruiz" className={classes.buttons}>
              <FontAwesomeIcon icon={["fab", "github"]} size="lg" />
            </a>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
