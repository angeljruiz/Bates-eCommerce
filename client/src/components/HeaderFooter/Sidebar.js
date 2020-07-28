import React from "react";

import { NavLink, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Paper,
  List,
  makeStyles,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from "@material-ui/core";

import HomeIcon from "@material-ui/icons/Home";
import LockIcon from "@material-ui/icons/Lock";
import { faUserPlus, faTicketAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const useStyles = makeStyles((theme) => {
  let bigger = window.innerWidth > theme.breakpoints.values.sm ? true : false;
  let toolbarHeight =
    theme.mixins.toolbar[bigger ? "@media (min-width:600px)" : "minHeight"];
  if (bigger) toolbarHeight = toolbarHeight.minHeight;
  return {
    sidebar: {
      paddingTop: toolbarHeight,
      paddingBottom: toolbarHeight,
      marginRight: theme.spacing(1),
    },

    avatar: {
      width: 40,
      height: 40,
    },
  };
});

function ListItemButton(props) {
  return <ListItem button component="button" {...props} />;
}

function Sidebar() {
  const history = useHistory();
  const show = useSelector((state) => state.sidebar.show);
  const auth = useSelector((state) => state.account.auth);
  const classes = useStyles();

  if (!show) return <></>;

  return (
    <Paper className={classes.sidebar} elevation={3}>
      <List component="nav">
        <ListItemButton selected onClick={() => history.push("/")}>
          <ListItemAvatar>
            <Avatar className={classes.avatar}>
              <HomeIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Home" />
        </ListItemButton>
        <ListItemButton onClick={() => history.push("/storeadmin")}>
          <ListItemAvatar>
            <Avatar className={classes.avatar}>
              <LockIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Admin" />
        </ListItemButton>
        <ListItemButton onClick={() => history.push("/login")}>
          <ListItemAvatar>
            <Avatar className={classes.avatar}>
              <FontAwesomeIcon icon="sign-in-alt" />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Login" />
        </ListItemButton>
        <ListItemButton onClick={() => history.push("/signup")}>
          <ListItemAvatar>
            <Avatar className={classes.avatar}>
              <FontAwesomeIcon icon={faUserPlus} />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Sign up" />
        </ListItemButton>
        <ListItemButton onClick={() => history.push("/support")}>
          <ListItemAvatar>
            <Avatar className={classes.avatar}>
              <FontAwesomeIcon icon={faTicketAlt} />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Support" />
        </ListItemButton>
      </List>
    </Paper>
  );
}

export default Sidebar;
