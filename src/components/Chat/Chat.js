import React, { useState } from "react";
import MensagemAssistant from "./Assistant";
import Message from "./Message";

import { Button } from "@mui/material";
import LoadingModal from "components/Progress/LoadingModal";
import { TextareaAutosize } from "@material-ui/core";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, isUser: true };
    setMessages([...messages, userMessage]);

    try {
      setModalIsOpen(true);
      const messageResponse = await MensagemAssistant(userMessage.text);
      console.log("Resposta do ChatGPT API", messageResponse);
      const botMessage = {
        text: messageResponse,
        isUser: false,
      };
      setMessages([...messages, userMessage, botMessage]);
      setModalIsOpen(false);
    } catch (error) {
      setModalIsOpen(false);
      alert(`Erro ao enviar mensagem: ${error.message}`);
    }

    setInput("");
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "400px",
          overflowY: "scroll",
          border: "1px solid #FFF",
          borderRadius: "10px",
          padding: "10px",
          marginBottom: "10px",
        }}
      >
        {messages.map((msg, index) => (
          <Message key={index} text={msg.text} isUser={msg.isUser} />
        ))}
      </div>
      <div style={{ display: "flex" }}>
        <TextareaAutosize
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "10px 0 0 10px",
            border: "1px solid #CCC",
          }}
        />
        <Button
          color="primary"
          onClick={sendMessage}
          variant="contained"
          size="large"
          disableElevation
        >
          Enviar
        </Button>
      </div>
      <LoadingModal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
      />
    </div>
  );
};

export default Chat;
