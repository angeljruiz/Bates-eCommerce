import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { useSelector, shallowEqual } from "react-redux";
import { useHistory } from "react-router-dom";

// const addresses = [
//   "1 Material-UI Drive",
//   "Reactville",
//   "Anytown",
//   "99999",
//   "USA",
// ];
// const payments = [
//   { name: "Card type", detail: "Visa" },
//   { name: "Card holder", detail: "Mr John Smith" },
//   { name: "Card number", detail: "xxxx-xxxx-xxxx-1234" },
//   { name: "Expiry date", detail: "04/2024" },
// ];

const useStyles = makeStyles((theme) => ({
  listItem: {
    padding: theme.spacing(1, 0),
  },
  total: {
    fontWeight: 700,
  },
  title: {
    marginTop: theme.spacing(2),
  },
}));

export default function Review() {
  const products = useSelector((state) => state.cart.products, shallowEqual);
  const history = useHistory();
  const classes = useStyles();

  if (Object.keys(products).length === 0) history.push("/");

  return (
    <>
      <form action="/create_payment" method="post" id="paypalForm">
        <input type="hidden" id="cart" name="cart" />
      </form>
      <Typography variant="h6" gutterBottom>
        Order summary
      </Typography>
      <List disablePadding>
        {Object.keys(products || {}).map((k, i) => (
          // <CartItem sku={products[k].sku} key={i} />
          <ListItem className={classes.listItem} key={products[k].name}>
            <ListItemText
              primary={`${products[k].amount} x ${products[k].name}`}
              secondary={products[k].description}
            />
            <Typography variant="body2">
              {"$" + (products[k].price * products[k].amount).toFixed(2)}
            </Typography>
          </ListItem>
        ))}
        <ListItem className={classes.listItem}>
          <ListItemText primary="Total" />
          <Typography variant="subtitle1" className={classes.total}>
            {`$${Object.keys(products || {})
              .reduce(
                (sum, k) => sum + products[k].price * products[k].amount,
                0
              )
              .toFixed(2)}`}
          </Typography>
        </ListItem>
      </List>
    </>
  );
}
