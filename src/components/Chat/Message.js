import React from "react";
import PropTypes from "prop-types";
import { Avatar, Box, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import SmartToyIcon from "@mui/icons-material/AutoAwesomeOutlined";
import PersonIcon from "@mui/icons-material/PersonOutline";

const Message = ({ text, isUser, timestamp }) => {
  const theme = useTheme();

  return (
    <Stack
      direction="row"
      spacing={1.25}
      sx={{
        flexDirection: isUser ? "row-reverse" : "row",
        alignItems: "flex-end",
        maxWidth: "100%",
      }}
    >
      <Avatar
        sx={{
          width: 28,
          height: 28,
          bgcolor: isUser ? "primary.main" : "grey.200",
          color: isUser ? "#fff" : "text.secondary",
          flexShrink: 0,
          "& svg": { fontSize: 16 },
        }}
      >
        {isUser ? <PersonIcon /> : <SmartToyIcon />}
      </Avatar>

      <Box sx={{ maxWidth: { xs: "85%", md: "70%" } }}>
        <Box
          sx={{
            px: 1.75,
            py: 1.25,
            borderRadius: 2,
            backgroundColor: isUser
              ? theme.palette.primary.main
              : theme.palette.background.paper,
            color: isUser ? "#fff" : "text.primary",
            border: isUser ? "none" : `1px solid ${theme.palette.divider}`,
            boxShadow: isUser
              ? "0 2px 8px -2px rgba(15, 118, 110, 0.25)"
              : "none",
            borderTopRightRadius: isUser ? 4 : 16,
            borderTopLeftRadius: isUser ? 16 : 4,
            wordBreak: "break-word",
            whiteSpace: "pre-wrap",
            fontSize: "0.9375rem",
            lineHeight: 1.5,
          }}
        >
          {text}
        </Box>
        {timestamp && (
          <Typography
            variant="caption"
            sx={{
              display: "block",
              mt: 0.5,
              fontSize: "0.6875rem",
              color: "text.secondary",
              textAlign: isUser ? "right" : "left",
              px: 0.5,
            }}
          >
            {timestamp}
          </Typography>
        )}
      </Box>
    </Stack>
  );
};

Message.propTypes = {
  text: PropTypes.string,
  isUser: PropTypes.bool,
  timestamp: PropTypes.string,
};

export default Message;
