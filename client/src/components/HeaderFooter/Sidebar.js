import React from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  List,
  makeStyles,
  ListItem,
  ListItemText,
  Hidden,
  Drawer,
  useTheme,
  ListItemAvatar,
  Avatar,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
} from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import LockIcon from "@material-ui/icons/Lock";
import MenuIcon from "@material-ui/icons/Menu";
import { faUserPlus, faTicketAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { showSidebar } from "../../actions/sidebarActions";
import dStyle from "../../style/style";

function ListItemButton(props) {
  return <ListItem button component="button" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    zIndex: 900,
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: dStyle.drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${dStyle.drawerWidth}px)`,
      marginLeft: dStyle.drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: dStyle.drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

function Sidebar() {
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();
  const show = useSelector((state) => state.sidebar.show);
  const dispatch = useDispatch();

  const handleDrawerToggle = () => {
    dispatch(showSidebar(!show));
  };

  const followLink = (link) => {
    dispatch(showSidebar(false));
    history.push(link);
  };

  const drawer = (
    <>
      <div className={classes.toolbar} />
      <List component="nav">
        <ListItemButton selected onClick={() => followLink("/")}>
          <ListItemAvatar>
            <Avatar>
              <HomeIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Home" />
        </ListItemButton>
        <ListItemButton onClick={() => followLink("/storeadmin")}>
          <ListItemAvatar>
            <Avatar>
              <LockIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Admin" />
        </ListItemButton>
        <ListItemButton onClick={() => followLink("/login")}>
          <ListItemAvatar>
            <Avatar>
              <FontAwesomeIcon icon="sign-in-alt" />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Login" />
        </ListItemButton>
        <ListItemButton onClick={() => followLink("/signup")}>
          <ListItemAvatar>
            <Avatar>
              <FontAwesomeIcon icon={faUserPlus} />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Sign up" />
        </ListItemButton>
        <ListItemButton onClick={() => followLink("/support")}>
          <ListItemAvatar>
            <Avatar>
              <FontAwesomeIcon icon={faTicketAlt} />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Support" />
        </ListItemButton>
      </List>
    </>
  );

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Responsive drawer
          </Typography>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        <Hidden smUp>
          <Drawer
            variant="temporary"
            anchor={theme.direction === "rtl" ? "right" : "left"}
            open={show}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true,
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown>
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
    </div>
  );
}

export default Sidebar;
