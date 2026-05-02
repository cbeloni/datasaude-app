import React from "react";
import PropTypes from "prop-types";
import { NavLink, useLocation } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

const DRAWER_WIDTH = 248;

const NavItem = ({ route }) => {
  const location = useLocation();
  const theme = useTheme();
  const to = route.layout + route.path;
  const active = location.pathname === to;
  const Icon = route.icon;

  return (
    <ListItem disablePadding sx={{ display: "block", px: 1.5, my: 0.25 }}>
      <ListItemButton
        component={NavLink}
        to={to}
        disableRipple
        sx={{
          position: "relative",
          borderRadius: 1.5,
          px: 1.5,
          py: 1,
          color: active
            ? theme.palette.primary.dark
            : theme.palette.text.secondary,
          backgroundColor: active ? theme.palette.primary.light : "transparent",
          transition: theme.transitions.create(["background-color", "color"], {
            duration: 180,
          }),
          "&:hover": {
            backgroundColor: active
              ? theme.palette.primary.light
              : theme.palette.action.hover,
            color: active
              ? theme.palette.primary.dark
              : theme.palette.text.primary,
          },
          "&::before": active
            ? {
                content: '""',
                position: "absolute",
                left: -6,
                top: 8,
                bottom: 8,
                width: 3,
                borderRadius: 2,
                backgroundColor: theme.palette.primary.main,
              }
            : {},
        }}
      >
        {Icon && (
          <ListItemIcon
            sx={{
              minWidth: 32,
              color: "inherit",
              "& svg": { fontSize: 20 },
            }}
          >
            {typeof Icon === "string" ? null : <Icon />}
          </ListItemIcon>
        )}
        <ListItemText
          primary={route.name}
          primaryTypographyProps={{
            fontSize: "0.875rem",
            fontWeight: active ? 600 : 500,
            letterSpacing: "0.01em",
          }}
        />
      </ListItemButton>
    </ListItem>
  );
};

NavItem.propTypes = {
  route: PropTypes.shape({
    layout: PropTypes.string,
    path: PropTypes.string,
    icon: PropTypes.elementType,
    name: PropTypes.string,
  }).isRequired,
};

const Brand = () => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        px: 3,
        pt: 3,
        pb: 2,
        display: "flex",
        alignItems: "center",
        gap: 1.25,
      }}
    >
      <Box
        component="img"
        src={`${process.env.PUBLIC_URL}/logo.png`}
        alt="DataSaúde"
        sx={{
          width: 56,
          height: 36,
          objectFit: "contain",
          flexShrink: 0,
          filter: "brightness(0) saturate(100%)",
        }}
      />
      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            fontFamily: theme.tokens.typography.display,
            fontSize: "1.125rem",
            fontWeight: 600,
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            color: theme.palette.text.primary,
          }}
        >
          DataSaúde
        </Typography>
        <Typography
          variant="caption"
          sx={{
            display: "block",
            color: theme.palette.text.secondary,
            fontSize: "0.6875rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            fontWeight: 500,
          }}
        >
          Vigilância · BR
        </Typography>
      </Box>
    </Box>
  );
};

const Content = ({ routes }) => (
  <Stack sx={{ height: "100%" }}>
    <Brand />
    <Box sx={{ px: 3, pb: 1, pt: 1 }}>
      <Typography
        variant="overline"
        sx={{
          color: "text.secondary",
          fontSize: "0.625rem",
          letterSpacing: "0.14em",
        }}
      >
        Navegação
      </Typography>
    </Box>
    <List sx={{ flex: 1, py: 0 }} component="nav">
      {routes.map((route) => (
        <NavItem key={route.path} route={route} />
      ))}
    </List>
  </Stack>
);

Content.propTypes = {
  routes: PropTypes.array.isRequired,
};

export default function Sidebar({ routes, open, handleDrawerToggle }) {
  const theme = useTheme();

  const paperSx = {
    width: DRAWER_WIDTH,
    backgroundColor: theme.palette.background.paper,
    borderRight: `1px solid ${theme.palette.divider}`,
    boxSizing: "border-box",
  };

  return (
    <Box
      component="nav"
      sx={{
        width: { md: DRAWER_WIDTH },
        flexShrink: { md: 0 },
      }}
      aria-label="navegação principal"
    >
      <Drawer
        variant="temporary"
        open={open}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": paperSx,
        }}
      >
        <Content routes={routes} />
      </Drawer>
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": paperSx,
        }}
      >
        <Content routes={routes} />
      </Drawer>
    </Box>
  );
}

Sidebar.propTypes = {
  routes: PropTypes.array.isRequired,
  open: PropTypes.bool,
  handleDrawerToggle: PropTypes.func,
};

Sidebar.drawerWidth = DRAWER_WIDTH;
