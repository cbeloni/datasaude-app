import React from "react";
import PropTypes from "prop-types";
import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import AdminNavbarLinks from "./AdminNavbarLinks.js";
import { useRouteName } from "hooks";
import Sidebar from "components/Sidebar/Sidebar.js";

const SIDEBAR_WIDTH = Sidebar.drawerWidth || 248;

export default function Header({ handleDrawerToggle }) {
  const theme = useTheme();
  const routeName = useRouteName();

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        borderBottom: `1px solid ${theme.palette.divider}`,
        boxShadow: "none",
        zIndex: theme.zIndex.drawer - 1,
        width: { xs: "100%", md: `calc(100% - ${SIDEBAR_WIDTH}px)` },
        ml: { xs: 0, md: `${SIDEBAR_WIDTH}px` },
      }}
    >
      <Toolbar
        sx={{
          minHeight: 64,
          px: { xs: 2, md: 3 },
          gap: 2,
        }}
      >
        <IconButton
          edge="start"
          onClick={handleDrawerToggle}
          sx={{
            color: "text.secondary",
            display: { md: "none" },
          }}
          aria-label="abrir menu"
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="caption"
            sx={{
              display: "block",
              color: "text.secondary",
              fontSize: "0.6875rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              fontWeight: 500,
            }}
          >
            Painel
          </Typography>
          <Typography
            sx={{
              fontFamily: theme.tokens.typography.display,
              fontSize: "1.25rem",
              fontWeight: 500,
              letterSpacing: "-0.015em",
              lineHeight: 1.2,
              color: "text.primary",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {routeName || "DataSaúde"}
          </Typography>
        </Box>

        <AdminNavbarLinks />
      </Toolbar>
    </AppBar>
  );
}

Header.propTypes = {
  handleDrawerToggle: PropTypes.func,
};
