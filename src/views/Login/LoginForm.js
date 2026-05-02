import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import VisibilityIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOffOutlined";
import LockIcon from "@mui/icons-material/LockOutlined";
import EmailIcon from "@mui/icons-material/MailOutline";
import { login, isAuthenticated } from "auth";

const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export default function LoginForm() {
  const theme = useTheme();
  const history = useHistory();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!email) next.email = "Informe seu e-mail";
    else if (!validateEmail(email)) next.email = "E-mail inválido";
    if (!password) next.password = "Informe sua senha";
    setErrors(next);
    if (Object.keys(next).length) return;

    try {
      setSubmitting(true);
      const ok = await login(email, password);
      if (ok && isAuthenticated()) {
        history.push("/admin/dashboard");
      } else {
        setFeedback({
          severity: "error",
          message: "Credenciais inválidas. Verifique e tente novamente.",
        });
      }
    } catch (err) {
      setFeedback({
        severity: "error",
        message: err?.message || "Não foi possível autenticar.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1.05fr 1fr" },
        backgroundColor: "background.default",
      }}
    >
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "space-between",
          p: 6,
          color: "common.white",
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 60%, ${theme.tokens.palette.accent[600]} 100%)`,
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 80% 10%, rgba(255,255,255,0.18), transparent 40%), radial-gradient(circle at 10% 90%, rgba(255,255,255,0.14), transparent 35%)",
            pointerEvents: "none",
          },
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            component="img"
            src={`${process.env.PUBLIC_URL}/logo.png`}
            alt="DataSaúde"
            sx={{
              width: 40,
              height: 40,
              objectFit: "contain",
              filter: "brightness(0) invert(1)",
            }}
          />
          <Typography
            sx={{
              fontFamily: theme.tokens.typography.display,
              fontWeight: 600,
              fontSize: "1.125rem",
              letterSpacing: "-0.02em",
            }}
          >
            DataSaúde
          </Typography>
        </Stack>

        <Box sx={{ position: "relative", zIndex: 1, maxWidth: 480 }}>
          <Typography
            sx={{
              fontFamily: theme.tokens.typography.display,
              fontSize: "2.5rem",
              fontWeight: 500,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            Vigilância em saúde,
            <br />
            com clareza.
          </Typography>
          <Typography
            sx={{
              mt: 2,
              fontSize: "1rem",
              color: "rgba(255,255,255,0.85)",
              maxWidth: 420,
            }}
          >
            Acompanhe atendimentos, internações, leitos e qualidade do ar em
            tempo real. Decisões baseadas em dados, não em achismos.
          </Typography>
        </Box>

        <Typography variant="caption" sx={{ opacity: 0.65 }}>
          © {new Date().getFullYear()} DataSaúde · Saúde pública orientada a
          dados
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 3, sm: 6 },
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ width: "100%", maxWidth: 400 }}
        >
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="overline"
              sx={{
                color: "primary.main",
                fontSize: "0.6875rem",
                letterSpacing: "0.14em",
                fontWeight: 600,
              }}
            >
              Entrar
            </Typography>
            <Typography
              sx={{
                fontFamily: theme.tokens.typography.display,
                fontSize: "1.875rem",
                fontWeight: 500,
                letterSpacing: "-0.02em",
                lineHeight: 1.15,
                mt: 0.5,
              }}
            >
              Bem-vindo de volta
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", mt: 1 }}>
              Acesse sua conta para visualizar os indicadores de saúde.
            </Typography>
          </Box>

          <Stack spacing={2.25}>
            <TextField
              label="E-mail"
              type="email"
              autoComplete="email"
              autoFocus
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={Boolean(errors.email)}
              helperText={errors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon
                      fontSize="small"
                      sx={{ color: "text.secondary" }}
                    />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Senha"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={Boolean(errors.password)}
              helperText={errors.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon
                      fontSize="small"
                      sx={{ color: "text.secondary" }}
                    />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((p) => !p)}
                      edge="end"
                      size="small"
                      aria-label={
                        showPassword ? "ocultar senha" : "mostrar senha"
                      }
                    >
                      {showPassword ? (
                        <VisibilityOffIcon fontSize="small" />
                      ) : (
                        <VisibilityIcon fontSize="small" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    size="small"
                  />
                }
                label={
                  <Typography variant="body2">Manter conectado</Typography>
                }
              />
              <Link
                href="#"
                underline="hover"
                sx={{
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                  color: "primary.main",
                }}
              >
                Esqueci minha senha
              </Link>
            </Stack>

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={submitting}
              sx={{ py: 1.25 }}
              startIcon={
                submitting ? (
                  <CircularProgress size={16} color="inherit" />
                ) : null
              }
            >
              {submitting ? "Entrando..." : "Entrar"}
            </Button>

            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                textAlign: "center",
                display: "block",
                mt: 1,
              }}
            >
              Acesso restrito · A plataforma registra todas as autenticações.
            </Typography>
          </Stack>
        </Box>
      </Box>

      <Snackbar
        open={Boolean(feedback)}
        autoHideDuration={5000}
        onClose={() => setFeedback(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        {feedback ? (
          <Alert
            severity={feedback.severity}
            variant="filled"
            onClose={() => setFeedback(null)}
            sx={{ width: "100%" }}
          >
            {feedback.message}
          </Alert>
        ) : null}
      </Snackbar>
    </Box>
  );
}
