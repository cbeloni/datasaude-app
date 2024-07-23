import React from "react";
import { Modal, Box, CircularProgress, Typography } from "@mui/material";
import PropTypes from "prop-types";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  bgcolor: "background.paper",
  p: 4,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const LoadingModal = ({ isOpen, onRequestClose }) => {
  return (
    <Modal
      open={isOpen}
      onClose={onRequestClose}
      aria-labelledby="loading-modal-title"
      aria-describedby="loading-modal-description"
    >
      <Box sx={style}>
        <Typography id="loading-modal-title" variant="h6" component="h2">
          Carregando...
        </Typography>
        <CircularProgress />
      </Box>
    </Modal>
  );
};

LoadingModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.any,
};

export default LoadingModal;
