import React, { useState } from "react";
import { TextField, Button, MenuItem, Stack, FormControlLabel, Checkbox } from "@mui/material";

export default function DailyForm({ userId, onLogged }) {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10)); // default today
  const [onPeriod, setOnPeriod] = useState(false);
  const [mood, setMood] = useState("neutral");
  const [notes, setNotes] = useState("");

  const moods = [
    { value: "happy", label: "😊 Happy" },
    { value: "neutral", label: "😐 Neutral" },
    { value: "sad", label: "😔 Sad" },
    { value: "anxious", label: "😟 Anxious" },
    { value: "excited", label: "🤩 Excited" },
    { value: "tired", label: "😴 Tired" },
    { value: "stressed", label: "😫 Stressed" },
    { value: "motivated", label: "💪 Motivated" },
    { value: "relaxed", label: "😌 Relaxed" },
    { value: "angry", label: "😡 Angry" },
    { value: "lonely", label: "😔 Lonely" },
    { value: "confident", label: "😎 Confident" },
    { value: "bored", label: "😒 Bored" },
  ];


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8000/log/daily", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, date, on_period: onPeriod, mood, notes }),
      });
      if (res.ok) {
        onLogged();
        // reset form
        setDate(new Date().toISOString().slice(0, 10));
        setOnPeriod(false);
        setMood("neutral");
        setNotes("");
      } else {
        const err = await res.json();
        alert(err.detail || "Error logging daily entry");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <TextField
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          required
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={onPeriod}
              onChange={(e) => setOnPeriod(e.target.checked)}
            />
          }
          label="I am on my period"
        />
        <TextField
          select
          label="Mood"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
        >
          {moods.map((m) => (
            <MenuItem key={m.value} value={m.value}>
              {m.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary" sx={{ fontWeight: "bold" }}>
          Log Today
        </Button>
      </Stack>
    </form>
  );
}
