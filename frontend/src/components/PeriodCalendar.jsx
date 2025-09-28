import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Box, Tooltip } from "@mui/material";

export default function PeriodCalendar({ userId }) {
  const [logs, setLogs] = useState([]);

  // Fetch daily logs for the user
  useEffect(() => {
    fetch(`http://localhost:8000/logs/daily/${userId}`)
      .then((r) => r.json())
      .then(setLogs);
  }, [userId]);

  const formatDate = (d) => new Date(d).toISOString().split("T")[0];

  const getMoodEmoji = (mood) =>
    ({
      happy: "😊",
      neutral: "😐",
      sad: "😔",
      anxious: "😟",
      excited: "🤩",
      tired: "😴",
      stressed: "😫",
      motivated: "💪",
      relaxed: "😌",
      angry: "😡",
      lonely: "😔",
      confident: "😎",
      bored: "😒",
    }[mood] || "");

  // Add background colors for period vs mood-only days
  const tileClassName = ({ date, view }) => {
    if (view !== "month") return;
    const dateStr = formatDate(date);
    const log = logs.find((l) => formatDate(l.date) === dateStr);
    if (!log) return;

    let classes = "";
    if (log.on_period) classes += " bg-pink-300 text-white rounded-full ";
    else classes += " bg-gray-200 rounded-full "; // mood-only day styling

    if (dateStr === formatDate(new Date()))
      classes += " border-2 border-blue-400 rounded-full ";
    return classes;
  };

  // Show mood emoji in tile
  const tileContent = ({ date, view }) => {
    if (view !== "month") return null;
    const dateStr = formatDate(date);
    const log = logs.find((l) => formatDate(l.date) === dateStr);
    if (!log) return null;

    const emoji = getMoodEmoji(log.mood);
    return (
      <Tooltip
        title={`On period: ${log.on_period ? "Yes" : "No"}${
          log.notes ? ` | Notes: ${log.notes}` : ""
        }`}
        arrow
      >
        <Box sx={{ fontSize: 14 }}>{emoji}</Box>
      </Tooltip>
    );
  };

  return <Calendar tileClassName={tileClassName} tileContent={tileContent} />;
}
