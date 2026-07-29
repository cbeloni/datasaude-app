import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { getCurrentUser } from "auth";
import {
  createUser,
  listRoles,
  listUsers,
  setUserActive,
} from "services/AdminUserService";
import RolesPage from "views/UserManagement/RolesPage";

const initialForm = { email: "", nickname: "", password: "", role_id: "" };

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [permissions, setPermissions] = useState([]);

  const load = async (userPermissions = permissions) => {
    setLoading(true);
    try {
      if (userPermissions.includes("users.manage")) {
        const userData = await listUsers({ limit: 100 });
        setUsers(userData.items || []);
      }
      if (userPermissions.includes("roles.manage")) {
        const roleData = await listRoles();
        setRoles(roleData || []);
      }
    } catch (error) {
      setFeedback({
        severity: "error",
        message: "Não foi possível carregar os usuários.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCurrentUser()
      .then((user) => {
        const userPermissions = user?.permissions || [];
        setPermissions(userPermissions);
        if (!userPermissions.includes("users.manage")) {
          setActiveTab(1);
        }
        return load(userPermissions);
      })
      .catch(() => {
        setFeedback({
          severity: "error",
          message: "Não foi possível carregar as permissões do usuário.",
        });
        setLoading(false);
      });
  }, []);

  const canManageUsers = permissions.includes("users.manage");
  const canManageRoles = permissions.includes("roles.manage");

  const updateForm = (field) => (event) =>
    setForm((current) => ({ ...current, [field]: event.target.value }));

  const handleCreate = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await createUser({
        ...form,
        role_id: form.role_id ? Number(form.role_id) : null,
      });
      setOpen(false);
      setForm(initialForm);
      await load();
      setFeedback({ severity: "success", message: "Usuário criado." });
    } catch (error) {
      setFeedback({
        severity: "error",
        message:
          error.response?.data?.detail || "Não foi possível criar o usuário.",
      });
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (user) => {
    try {
      await setUserActive(user.id, !user.is_active);
      await load();
    } catch (error) {
      setFeedback({
        severity: "error",
        message: "Não foi possível alterar o status do usuário.",
      });
    }
  };

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        gap={2}
      >
        <Box>
          <Typography variant="overline" color="primary">
            Administração
          </Typography>
          <Typography variant="h4">Usuários</Typography>
          <Typography color="text.secondary">
            Gerencie acesso, status e perfil de cada usuário.
          </Typography>
        </Box>
        {activeTab === 0 && canManageUsers && (
          <Button variant="contained" onClick={() => setOpen(true)}>
            Novo usuário
          </Button>
        )}
      </Stack>
      <Tabs value={activeTab} onChange={(_, value) => setActiveTab(value)}>
        <Tab label="Usuários" disabled={!canManageUsers} />
        <Tab label="Perfis" disabled={!canManageRoles} />
      </Tabs>
      {activeTab === 1 && canManageRoles ? (
        <RolesPage showHeader={false} />
      ) : (
        <>
          {feedback && (
            <Alert
              onClose={() => setFeedback(null)}
              severity={feedback.severity}
            >
              {feedback.message}
            </Alert>
          )}
          <Paper sx={{ overflowX: "auto" }}>
            {loading ? (
              <CircularProgress sx={{ m: 3 }} />
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nome</TableCell>
                    <TableCell>E-mail</TableCell>
                    <TableCell>Perfil</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.nickname}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {user.role_name ||
                          (user.is_admin ? "Administrador" : "Sem perfil")}
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={user.is_active ? "Ativo" : "Inativo"}
                          color={user.is_active ? "success" : "default"}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Button size="small" onClick={() => toggleActive(user)}>
                          {user.is_active ? "Desativar" : "Ativar"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Paper>
          <Dialog
            open={open}
            onClose={() => setOpen(false)}
            fullWidth
            maxWidth="sm"
          >
            <Box component="form" onSubmit={handleCreate}>
              <DialogTitle>Novo usuário</DialogTitle>
              <DialogContent>
                <Stack spacing={2} sx={{ pt: 1 }}>
                  <TextField
                    label="Nome"
                    required
                    value={form.nickname}
                    onChange={updateForm("nickname")}
                  />
                  <TextField
                    label="E-mail"
                    type="email"
                    required
                    value={form.email}
                    onChange={updateForm("email")}
                  />
                  <TextField
                    label="Senha"
                    type="password"
                    required
                    inputProps={{ minLength: 8 }}
                    value={form.password}
                    onChange={updateForm("password")}
                  />
                  <TextField
                    label="Perfil"
                    select
                    required
                    value={form.role_id}
                    onChange={updateForm("role_id")}
                  >
                    {roles
                      .filter((role) => role.is_active)
                      .map((role) => (
                        <MenuItem key={role.id} value={role.id}>
                          {role.name}
                        </MenuItem>
                      ))}
                  </TextField>
                </Stack>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpen(false)}>Cancelar</Button>
                <Button type="submit" variant="contained" disabled={saving}>
                  {saving ? "Salvando..." : "Criar"}
                </Button>
              </DialogActions>
            </Box>
          </Dialog>
        </>
      )}
    </Stack>
  );
}
