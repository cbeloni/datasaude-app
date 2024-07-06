import React, { useState } from "react";
import { Button, TextField, Container, Typography, Box } from "@mui/material";
import { login } from "auth";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { isAuthenticated } from "auth";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Aqui você faria a lógica de autenticação real
    if (await login(email, password)) {
      console.log("Autenticado: ", isAuthenticated());
      history.push("/admin/dashboard");
    } else {
      alert("Credenciais inválidas!");
    }
  };

  return (
    <Container maxWidth="xs">
      <Box display="flex" flexDirection="column" alignItems="center" mt={8}>
        <Typography variant="h5">Login</Typography>
        <form
          onSubmit={handleSubmit}
          style={{ width: "100%", marginTop: "16px" }}
        >
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Senha"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            style={{ marginTop: "24px" }}
          >
            Login
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default LoginForm;
