import React, { useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
import Pet from "./components/Pet";
import DailyForm from "./components/DailyForm";
import PeriodCalendar from "./components/PeriodCalendar";
import ChatBox from "./components/ChatBox";

export default function App() {
  const userId = "user1";
  const [refresh, setRefresh] = useState(0);
  const [petStatus, setPetStatus] = useState({ happiness: 5, mood: "happy" });
  const [lastAction, setLastAction] = useState(null);

  const handleLog = () => {
    setRefresh((r) => r + 1);
    setPetStatus((prev) => ({
      ...prev,
      happiness: Math.min(prev.happiness + 1, 10),
    }));
    setLastAction(Date.now());
  };

  return (
    <Box
      sx={{
        display: "flex",
        backgroundColor: "#FFF1F8",
        minHeight: "100vh",
      }}
    >
      {/* Fixed Pet */}
      <Box
        sx={{
          position: "fixed",
          top: "50%",
          left: 0,
          transform: "translateY(-50%)",
          width: "200px",
          display: "flex",
          justifyContent: "center",
          zIndex: 1000,
        }}
      >
        <Pet petStatus={petStatus} lastAction={lastAction} />
      </Box>

      {/* Main content shifted right */}
      <Box
        sx={{
          flex: 1,
          ml: "220px",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          p: 4,
        }}
      >
        {/* Daily Log Form + Calendar side by side */}
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Paper sx={{ flex: 1, minWidth: 300, p: 3, borderRadius: 3, boxShadow: 3 }}>
            <Typography variant="h6" gutterBottom>
              📝 Log Your Day
            </Typography>
            <DailyForm userId={userId} onLogged={handleLog} />
          </Paper>

          <Paper sx={{ flex: 1, minWidth: 300, p: 3, borderRadius: 3, boxShadow: 3 }}>
            <Typography variant="h6" gutterBottom>
              📅 Cycle & Mood Calendar
            </Typography>
            <PeriodCalendar userId={userId} key={refresh} />
          </Paper>
        </Box>

        {/* ChatBox */}
        <Paper
          sx={{
            p: 2,
            borderRadius: 3,
            boxShadow: 3,
            display: "flex",
            flexDirection: "column",
            height: 600,
          }}
        >
          <Typography variant="h6" gutterBottom>
            💬 Chatbot
          </Typography>
          <Box sx={{ flex: 1 }}>
            <ChatBox userId={userId} />
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
