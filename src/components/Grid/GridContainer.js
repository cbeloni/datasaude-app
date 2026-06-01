import React from "react";
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";

export default function GridContainer({ children, spacing = 2.5, ...rest }) {
  return (
    <Grid container spacing={spacing} {...rest}>
      {children}
    </Grid>
  );
}

GridContainer.propTypes = {
  children: PropTypes.node,
  spacing: PropTypes.number,
};
