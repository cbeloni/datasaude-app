import React from "react";
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";

export default function GridItem({ children, ...rest }) {
  return (
    <Grid item {...rest}>
      {children}
    </Grid>
  );
}

GridItem.propTypes = {
  children: PropTypes.node,
};
