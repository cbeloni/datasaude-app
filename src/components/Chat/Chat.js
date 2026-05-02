import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Box,
  Card,
  IconButton,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useTheme, keyframes } from "@mui/material/styles";
import SendIcon from "@mui/icons-material/SendRounded";
import SparkleIcon from "@mui/icons-material/AutoAwesomeOutlined";

import MensagemAssistant from "./Assistant";
import Message from "./Message";
import PageHeader from "components/Card/PageHeader";

const blink = keyframes`
  0%, 80%, 100% { opacity: 0.2; transform: scale(0.85); }
  40% { opacity: 1; transform: scale(1); }
`;

const TypingDots = () => {
  const theme = useTheme();
  return (
    <Stack direction="row" spacing={1.25} alignItems="flex-end">
      <Box
        sx={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          bgcolor: "grey.200",
          color: "text.secondary",
          display: "grid",
          placeItems: "center",
          "& svg": { fontSize: 16 },
        }}
      >
        <SparkleIcon />
      </Box>
      <Box
        sx={{
          px: 2,
          py: 1.25,
          borderRadius: 2,
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          borderTopLeftRadius: 4,
          display: "inline-flex",
          gap: 0.5,
          alignItems: "center",
        }}
      >
        {[0, 1, 2].map((i) => (
          <Box
            key={i}
            sx={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              backgroundColor: "text.secondary",
              animation: `${blink} 1.2s infinite ease-in-out`,
              animationDelay: `${i * 0.18}s`,
            }}
          />
        ))}
      </Box>
    </Stack>
  );
};

const SUGGESTIONS = [
  "Qual o nível de qualidade do ar nas estações hoje?",
  "Resuma os atendimentos por CID no último mês",
  "Quais municípios tiveram mais internações?",
];

const Chat = () => {
  const theme = useTheme();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, sending]);

  const sendMessage = async (textOverride) => {
    const text = (textOverride ?? input).trim();
    if (!text || sending) return;

    const userMessage = { text, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setSending(true);

    try {
      const response = await MensagemAssistant(text);
      setMessages((prev) => [...prev, { text: response, isUser: false }]);
    } catch (err) {
      setError(err?.message || "Não foi possível enviar a mensagem.");
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Box>
      <PageHeader
        eyebrow="Assistente"
        title="Pergunte aos dados"
        description="Faça perguntas em linguagem natural sobre atendimentos, internações, qualidade do ar e tendências."
      />

      <Card
        variant="outlined"
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "calc(100vh - 280px)",
          minHeight: 480,
          overflow: "hidden",
        }}
      >
        <Box
          ref={scrollRef}
          sx={{
            flex: 1,
            overflowY: "auto",
            p: { xs: 2, md: 3 },
            backgroundColor: theme.palette.background.default,
          }}
        >
          {messages.length === 0 ? (
            <Stack
              spacing={3}
              alignItems="center"
              justifyContent="center"
              sx={{ height: "100%", textAlign: "center", px: 2 }}
            >
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  display: "grid",
                  placeItems: "center",
                  color: "#fff",
                  "& svg": { fontSize: 28 },
                  boxShadow: "0 12px 28px -10px rgba(15, 118, 110, 0.45)",
                }}
              >
                <SparkleIcon />
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontFamily: theme.tokens.typography.display,
                    fontSize: "1.5rem",
                    fontWeight: 500,
                    letterSpacing: "-0.02em",
                  }}
                >
                  Como posso ajudar?
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", mt: 0.5, maxWidth: 420 }}
                >
                  Comece com uma das sugestões abaixo ou digite sua própria
                  pergunta.
                </Typography>
              </Box>
              <Stack
                spacing={1}
                sx={{ width: "100%", maxWidth: 480, alignItems: "stretch" }}
              >
                {SUGGESTIONS.map((s) => (
                  <Card
                    key={s}
                    variant="outlined"
                    onClick={() => sendMessage(s)}
                    sx={{
                      px: 2,
                      py: 1.25,
                      cursor: "pointer",
                      transition: "all 200ms",
                      textAlign: "left",
                      "&:hover": {
                        borderColor: "primary.main",
                        backgroundColor: "primary.50",
                      },
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {s}
                    </Typography>
                  </Card>
                ))}
              </Stack>
            </Stack>
          ) : (
            <Stack spacing={2}>
              {messages.map((msg, i) => (
                <Message key={i} text={msg.text} isUser={msg.isUser} />
              ))}
              {sending && <TypingDots />}
            </Stack>
          )}
        </Box>

        <Box
          sx={{
            p: { xs: 1.5, md: 2 },
            borderTop: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Stack direction="row" spacing={1} alignItems="flex-end">
            <TextField
              fullWidth
              multiline
              maxRows={5}
              placeholder="Digite sua pergunta…  (Enter para enviar, Shift+Enter para nova linha)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={sending}
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  py: 1,
                },
              }}
            />
            <IconButton
              onClick={() => sendMessage()}
              disabled={!input.trim() || sending}
              sx={{
                bgcolor: "primary.main",
                color: "#fff",
                width: 40,
                height: 40,
                "&:hover": { bgcolor: "primary.dark" },
                "&.Mui-disabled": {
                  bgcolor: "grey.200",
                  color: "grey.400",
                },
              }}
              aria-label="Enviar mensagem"
            >
              <SendIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Box>
      </Card>

      <Snackbar
        open={Boolean(error)}
        autoHideDuration={5000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        {error ? (
          <Alert
            severity="error"
            variant="filled"
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        ) : null}
      </Snackbar>
    </Box>
  );
};

export default Chat;
