import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import AddressForm from "./AddressForm";
import PaymentForm from "./PaymentForm";
import Review from "./Review";
import { Container } from "@material-ui/core";
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  layout: {
    width: "auto",
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  stepper: {
    padding: theme.spacing(3, 0, 5),
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end",
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
}));

const steps = ["Review your order", "Shipping address", "Payment details"];

function getStepContent(step) {
  switch (step) {
    case 0:
      return <Review />;
    case 1:
      return <AddressForm />;
    case 2:
      return <PaymentForm />;
    default:
      throw new Error("Unknown step");
  }
}

export default function Checkout() {
  const cart = useSelector((state) => state.cart.products);
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handlePaypal = () => {
    let t = {};
    t.items = Object.keys(cart).map((k) => {
      let w = cart[k];
      w.quantity = cart[k].amount;
      delete w.amount;
      return w;
    });
    t.total = t.items
      .reduce((sum, i) => sum + i.price * i.quantity, 0)
      .toFixed(2);
    t.subtotal = t.total;
    t.shipping = 0;
    document.querySelector("#cart").value = JSON.stringify(t);
    document.querySelector("#paypalForm").submit();
    // fetch("/create_payment", {
    //   method: "POST",
    //   body: JSON.stringify(t),
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // }).then((data) => {
    //   console.log(data);
    // });
  };

  return (
    <>
      <Container className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h4" align="center">
            Checkout
          </Typography>
          <Stepper
            activeStep={activeStep}
            className={classes.stepper}
            alternativeLabel
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <>
            {activeStep === steps.length ? (
              <>
                <Typography variant="h5" gutterBottom>
                  Thank you for your order.
                </Typography>
                <Typography variant="subtitle1">
                  Your order number is #2001539. We have emailed your order
                  confirmation, and will send you an update when your order has
                  shipped.
                </Typography>
              </>
            ) : (
              <>
                {getStepContent(activeStep)}
                <div className={classes.buttons}>
                  {activeStep !== 0 && (
                    <Button onClick={handleBack} className={classes.button}>
                      Back
                    </Button>
                  )}
                  {activeStep === 0 && (
                    <Button
                      variant="contained"
                      onClick={handlePaypal}
                      className={`${classes.button} paypal-logo`}
                    >
                      <i>Pay</i>
                      <i>Pal</i>
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    className={classes.button}
                  >
                    {activeStep === steps.length - 1
                      ? "Place order"
                      : "Continue"}
                  </Button>
                </div>
              </>
            )}
          </>
        </Paper>
      </Container>
    </>
  );
}
