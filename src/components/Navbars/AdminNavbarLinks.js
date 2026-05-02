import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import LogoutIcon from "@mui/icons-material/LogoutOutlined";
import PersonIcon from "@mui/icons-material/PersonOutline";
import SettingsIcon from "@mui/icons-material/SettingsOutlined";
import NotificationsIcon from "@mui/icons-material/NotificationsNoneOutlined";
import { isAuthenticated } from "auth";

export default function AdminNavbarLinks() {
  const history = useHistory();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    handleClose();
    history.push("/admin/login");
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
      <Tooltip title="Notificações">
        <IconButton size="medium" sx={{ color: "text.secondary" }}>
          <NotificationsIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Conta">
        <IconButton onClick={handleOpen} size="small" sx={{ ml: 0.5 }}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: theme.palette.primary.main,
              color: "#fff",
              fontSize: "0.8125rem",
              fontWeight: 600,
            }}
          >
            DS
          </Avatar>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        slotProps={{
          paper: {
            sx: { mt: 1, minWidth: 200 },
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.25 }}>
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, color: "text.primary" }}
          >
            Sua conta
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            DataSaúde
          </Typography>
        </Box>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          Perfil
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          Configurações
        </MenuItem>
        {isAuthenticated() && [
          <Divider key="divider" sx={{ my: 0.5 }} />,
          <MenuItem
            key="logout"
            onClick={handleLogout}
            sx={{ color: "error.main" }}
          >
            <ListItemIcon>
              <LogoutIcon fontSize="small" sx={{ color: "error.main" }} />
            </ListItemIcon>
            Sair
          </MenuItem>,
        ]}
      </Menu>
    </Box>
  );
}
