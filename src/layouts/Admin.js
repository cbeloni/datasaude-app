import React, { useEffect, useState } from "react";
import { Switch, Route, Redirect, useLocation } from "react-router-dom";
import { Box, CircularProgress, Toolbar, Typography } from "@mui/material";

import Navbar from "components/Navbars/Navbar.js";
import Footer from "components/Footer/Footer.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import LoginForm from "views/Login/LoginForm";
import routes from "routes.js";
import { getCurrentUser, isAuthenticated } from "auth";

const canAccess = (route, user) =>
  (!route.permission && !route.permissions) ||
  user?.is_admin ||
  route.permissions?.some((permission) =>
    user?.permissions?.includes(permission)
  ) ||
  user?.permissions?.includes(route.permission) ||
  route.tabPermissions?.some((permission) =>
    user?.permissions?.includes(permission)
  );

export default function Admin() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const handleDrawerToggle = () => setMobileOpen((prev) => !prev);
  const isLoginRoute = location.pathname === "/admin/login";

  useEffect(() => {
    if (isLoginRoute) {
      setCurrentUser(null);
      setLoadingUser(false);
      return undefined;
    }
    if (!isAuthenticated()) {
      setCurrentUser(null);
      setLoadingUser(false);
      return undefined;
    }
    setLoadingUser(true);
    getCurrentUser()
      .then(setCurrentUser)
      .catch(() => setCurrentUser(null))
      .finally(() => setLoadingUser(false));
  }, [isLoginRoute]);

  const availableRoutes = routes.filter((route) =>
    canAccess(route, currentUser)
  );

  if (loadingUser && isAuthenticated()) {
    return <CircularProgress sx={{ m: 4 }} />;
  }

  if (isLoginRoute) {
    return <LoginForm />;
  }

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "background.default",
      }}
    >
      <Sidebar
        routes={availableRoutes}
        open={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Navbar handleDrawerToggle={handleDrawerToggle} />
        <Toolbar />
        <Box
          sx={{
            flex: 1,
            px: { xs: 2, md: 4 },
            py: { xs: 2, md: 3 },
            maxWidth: 1440,
            width: "100%",
            mx: "auto",
          }}
        >
          <Switch>
            <Route path="/admin/login" component={LoginForm} />
            {routes.map((prop, key) => {
              if (prop.layout !== "/admin") return null;
              return (
                <Route
                  path={prop.layout + prop.path}
                  key={key}
                  render={(props) => {
                    if (!isAuthenticated()) {
                      return <Redirect to="/admin/login" />;
                    }
                    if (!canAccess(prop, currentUser)) {
                      return (
                        <Typography color="error">
                          Você não possui permissão para acessar esta página.
                        </Typography>
                      );
                    }
                    return (
                      <prop.component
                        {...props}
                        permissions={currentUser?.permissions || []}
                        isAdmin={Boolean(currentUser?.is_admin)}
                      />
                    );
                  }}
                />
              );
            })}
            <Redirect from="/admin" to="/admin/dashboard" />
          </Switch>
        </Box>
        <Footer />
      </Box>
    </Box>
  );
}
