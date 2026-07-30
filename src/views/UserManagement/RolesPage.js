import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import {
  createRole,
  listPermissions,
  listRoles,
  updateRole,
} from "services/AdminUserService";
import { TAB_PERMISSION_GROUPS } from "config/tabPermissions";

const emptyRole = { name: "", permission_codes: [] };
const groupedPermissionCodes = new Set(
  TAB_PERMISSION_GROUPS.flatMap((group) => [
    group.parentCode,
    ...group.items.map((item) => item.code),
  ])
);

export default function RolesPage({ showHeader = true, createRequest = 0 }) {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [role, setRole] = useState(emptyRole);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [editingRoleId, setEditingRoleId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [roleData, permissionData] = await Promise.all([
        listRoles(),
        listPermissions(),
      ]);
      setRoles(roleData || []);
      setPermissions(permissionData.items || []);
    } catch (error) {
      setFeedback({
        severity: "error",
        message: "Não foi possível carregar os perfis.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreateDialog = () => {
    setRole(emptyRole);
    setEditingRoleId(null);
    setOpen(true);
  };

  useEffect(() => {
    if (createRequest > 0) {
      openCreateDialog();
    }
  }, [createRequest]);

  const openEditDialog = (item) => {
    setRole({
      name: item.name,
      permission_codes: (item.permissions || []).map(
        (permission) => permission.code
      ),
    });
    setEditingRoleId(item.id);
    setOpen(true);
  };

  const togglePermission = (code) => {
    setRole((current) => {
      const isAdding = !current.permission_codes.includes(code);
      const newCodes = isAdding
        ? [...current.permission_codes, code]
        : current.permission_codes.filter((item) => item !== code);

      // Handle cascade logic for grouped permissions (pai/filhos)
      for (const group of TAB_PERMISSION_GROUPS) {
        const childCodes = group.items.map((item) => item.code);

        if (code === group.parentCode) {
          // Toggling parent: add/remove all children
          if (isAdding) {
            childCodes.forEach((childCode) => {
              if (!newCodes.includes(childCode)) newCodes.push(childCode);
            });
          } else {
            return {
              ...current,
              permission_codes: newCodes.filter(
                (item) => !childCodes.includes(item)
              ),
            };
          }
        } else if (childCodes.includes(code)) {
          // Toggling a child: check if all children are now selected
          const allChildrenSelected = childCodes.every((childCode) =>
            newCodes.includes(childCode)
          );
          if (allChildrenSelected && !newCodes.includes(group.parentCode)) {
            newCodes.push(group.parentCode);
          } else if (!allChildrenSelected) {
            return {
              ...current,
              permission_codes: newCodes.filter(
                (item) => item !== group.parentCode
              ),
            };
          }
        }
      }

      return { ...current, permission_codes: newCodes };
    });
  };

  const handleSave = async (event) => {
    event.preventDefault();
    try {
      if (editingRoleId) {
        await updateRole(editingRoleId, role);
      } else {
        await createRole(role);
      }
      setRole(emptyRole);
      setEditingRoleId(null);
      setOpen(false);
      await load();
      setFeedback({
        severity: "success",
        message: editingRoleId ? "Perfil atualizado." : "Perfil criado.",
      });
    } catch (error) {
      setFeedback({
        severity: "error",
        message:
          error.response?.data?.detail ||
          `Não foi possível ${editingRoleId ? "atualizar" : "criar"} o perfil.`,
      });
    }
  };

  return (
    <Stack spacing={3}>
      {showHeader && (
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          gap={2}
        >
          <Box>
            <Typography variant="overline" color="primary">
              Administração
            </Typography>
            <Typography variant="h4">Perfis e permissões</Typography>
            <Typography color="text.secondary">
              Defina quais módulos cada perfil pode acessar.
            </Typography>
          </Box>
          <Button variant="contained" onClick={openCreateDialog}>
            Novo perfil
          </Button>
        </Stack>
      )}
      {feedback && (
        <Alert onClose={() => setFeedback(null)} severity={feedback.severity}>
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
                <TableCell>Perfil</TableCell>
                <TableCell>Permissões</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {roles.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>
                    {item.permissions
                      ?.map((permission) => permission.name)
                      .join(", ") || "Nenhuma"}
                  </TableCell>
                  <TableCell>{item.is_active ? "Ativo" : "Inativo"}</TableCell>
                  <TableCell align="right">
                    <Button size="small" onClick={() => openEditDialog(item)}>
                      Editar
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
        <Box component="form" onSubmit={handleSave}>
          <DialogTitle>
            {editingRoleId ? "Editar perfil" : "Novo perfil"}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={1} sx={{ pt: 1 }}>
              <TextField
                label="Nome"
                required
                value={role.name}
                onChange={(event) =>
                  setRole({ ...role, name: event.target.value })
                }
              />
              <Typography variant="subtitle2" sx={{ pt: 1 }}>
                Permissões gerais
              </Typography>
              {permissions
                .filter(
                  (permission) => !groupedPermissionCodes.has(permission.code)
                )
                .map((permission) => (
                  <FormControlLabel
                    key={permission.code}
                    control={
                      <Checkbox
                        checked={role.permission_codes.includes(
                          permission.code
                        )}
                        onChange={() => togglePermission(permission.code)}
                      />
                    }
                    label={permission.name}
                  />
                ))}
              {TAB_PERMISSION_GROUPS.map((group) => {
                const parent = permissions.find(
                  (permission) => permission.code === group.parentCode
                );
                const children = permissions.filter((permission) =>
                  group.items.some((item) => item.code === permission.code)
                );
                if (!parent && !children.length) return null;
                return (
                  <Box key={group.parentCode} sx={{ pt: 1 }}>
                    <Typography variant="subtitle2">{group.label}</Typography>
                    {parent && (
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={role.permission_codes.includes(
                              parent.code
                            )}
                            onChange={() => togglePermission(parent.code)}
                          />
                        }
                        label={parent.name}
                      />
                    )}
                    <Box sx={{ pl: 2 }}>
                      {children.map((permission) => (
                        <FormControlLabel
                          key={permission.code}
                          control={
                            <Checkbox
                              checked={role.permission_codes.includes(
                                permission.code
                              )}
                              onChange={() => togglePermission(permission.code)}
                            />
                          }
                          label={permission.name}
                        />
                      ))}
                    </Box>
                  </Box>
                );
              })}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" variant="contained">
              {editingRoleId ? "Salvar" : "Criar"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Stack>
  );
}

RolesPage.propTypes = {
  showHeader: PropTypes.bool,
  createRequest: PropTypes.number,
};
