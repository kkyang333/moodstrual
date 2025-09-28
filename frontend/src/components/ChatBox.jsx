import React, { useState, useRef, useEffect } from "react";
import { Box, TextField, Button, Stack, Paper, Typography } from "@mui/material";

export default function ChatBox({ userId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    let botMessage = { sender: "bot", text: "" };
    setMessages([...newMessages, botMessage]);

    try {
      const res = await fetch("http://localhost:8000/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, message: input }),
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunk = decoder.decode(value);
          botMessage.text += chunk;
          setMessages([...newMessages, { ...botMessage }]);
        }
      }
    } catch (err) {
      console.error(err);
      setMessages([...newMessages, { sender: "bot", text: "⚠️ Error talking to server" }]);
    }

    setInput("");
  };

  return (
    <Paper
      sx={{
        display: "flex",
        flexDirection: "column",
        height: 500,
        borderRadius: 3,
        boxShadow: 3,
        overflow: "hidden",
      }}
    >
      {/* Messages area */}
      <Box sx={{ flex: 1, p: 2, overflowY: "auto", backgroundColor: "#f9f9f9" }}>
        {messages.map((msg, i) => (
          <Box
            key={i}
            sx={{
              display: "flex",
              justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
              mb: 1,
            }}
          >
            <Typography
              sx={{
                display: "inline-block",
                p: 1.5,
                borderRadius: 2,
                backgroundColor: msg.sender === "user" ? "#3b82f6" : "#e5e7eb",
                color: msg.sender === "user" ? "white" : "black",
                maxWidth: "70%",
                wordWrap: "break-word",
              }}
            >
              {msg.text}
            </Typography>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input area */}
      <Stack direction="row" spacing={1} sx={{ p: 1, borderTop: "1px solid #ddd" }}>
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          placeholder="Type a message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
        />
        <Button variant="contained" color="primary" onClick={sendMessage}>
          Send
        </Button>
      </Stack>
    </Paper>
  );
}
