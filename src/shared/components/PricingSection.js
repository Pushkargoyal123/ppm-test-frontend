import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import {
  Typography,
  withWidth,
  withStyles
} from "@material-ui/core";

const styles = theme => ({
  containerFix: {
    [theme.breakpoints.down("md")]: {
      paddingLeft: theme.spacing(6),
      paddingRight: theme.spacing(6)
    },
    [theme.breakpoints.down("sm")]: {
      paddingLeft: theme.spacing(4),
      paddingRight: theme.spacing(4)
    },
    [theme.breakpoints.down("xs")]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    },
    overflow: "hidden",
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1)
  },
  cardWrapper: {
    [theme.breakpoints.down("xs")]: {
      marginLeft: "auto",
      marginRight: "auto",
      maxWidth: 340
    }
  },
  cardWrapperHighlighted: {
    [theme.breakpoints.down("xs")]: {
      marginLeft: "auto",
      marginRight: "auto",
      maxWidth: 360
    }
  }
});

function PricingSection(props) {
  const { classes } = props;
  return (
    <div className="lg-p-top" style={{ backgroundColor: "#FFFFFF" }}>
      <Typography variant="h3" align="center" style={{marginBottom:20}}>
        Who We Are
      </Typography>
      <div style={{fontSize:23}} className={classNames("container-fluid", classes.containerFix)}>
       Neural networks or neural nets were inspired by the architecture of neuron in the human brain and we at Praedico Global Research Pvt. Ltd. are creators of these financial neurones in the field of stock market intelligence. We are India’s first finance neuron developers who are using their specially designed neural networks to accurately predict performances of stock markets around the world. We are a modern generation Fintech company which believes in discovering new research products in the field of finance with the effective use of the Artificial Intelligence. We believe in providing free world class research to people across India with highest accuracy. Our products boast of an accurate prediction of Indian Stock Market and financial products with an accuracy of more than 80%. Average Indian investors spend an average of 40k-50k in form of advisory & research fees which Praedico will be bringing down to Nil in coming years.
       <br/>
        <span style={{fontWeight:"bold"}}>Our Vision –</span> To be the bellwethers in eradicating financial discrepancy around the world by providing financial access to people who don’t have money to access costly financial products.
        <br/>
        <span style={{fontWeight:"bold"}}>Our Mission –</span> To be the leader in financial products development world over. Products so developed should have highest performance and lowest fees in comparison to other financial products in the market.
      </div>
    </div>
  );
}

PricingSection.propTypes = {
  width: PropTypes.string.isRequired
};

export default withStyles(styles, { withTheme: true })(
  withWidth()(PricingSection)
);
