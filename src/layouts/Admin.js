import React, { useState } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { Box, Toolbar } from "@mui/material";

import Navbar from "components/Navbars/Navbar.js";
import Footer from "components/Footer/Footer.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import LoginForm from "views/Login/LoginForm";
import routes from "routes.js";
import { isAuthenticated } from "auth";

const switchRoutes = (
  <Switch>
    <Route path="/admin/login" component={LoginForm} />
    {routes.map((prop, key) => {
      if (prop.layout !== "/admin") return null;
      return (
        <Route
          path={prop.layout + prop.path}
          key={key}
          render={(props) =>
            isAuthenticated() ? (
              <prop.component {...props} />
            ) : (
              <Redirect
                to={{
                  pathname: "/admin/login",
                  state: { from: props.location },
                }}
              />
            )
          }
        />
      );
    })}
    <Redirect from="/admin" to="/admin/dashboard" />
  </Switch>
);

export default function Admin() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => setMobileOpen((prev) => !prev);

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "background.default",
      }}
    >
      <Sidebar
        routes={routes}
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
          {switchRoutes}
        </Box>
        <Footer />
      </Box>
    </Box>
  );
}
