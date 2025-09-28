import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import Confetti from "react-confetti";

export default function Pet() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [isWiggling, setIsWiggling] = useState(false);
  const [message, setMessage] = useState("");

  const messages = [
    "Thanks for logging your mood today! 💖",
    "Keep it up! 🌟",
    "You're doing great! 😊",
    "Nice work logging your day! 📝",
    "Every little log counts! 📝",
    "Smile! 😄 You deserve it!",
    "Take a deep breath and relax 😌",
    "Remember to drink water! 💧",
    "Stay positive! 🌈",
  ];

  const handlePetClick = () => {
    // Pick a random message
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    setMessage(randomMessage);

    // Trigger wiggle animation
    setIsWiggling(true);
    setTimeout(() => setIsWiggling(false), 600);

    // Show confetti
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 4000);

    // Hide message after a short while
    setTimeout(() => setMessage(""), 2500);
  };

  return (
    <Box
      sx={{
        width: 220,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 2,
        borderRadius: 3,
        backgroundColor: "#fef6f9ff",
        boxShadow: 3,
        position: "relative",
        cursor: "pointer",
      }}
      onClick={handlePetClick}
    >
      {showConfetti && <Confetti width={220} height={220} recycle={false} />}

      {/* Message bubble */}
      {message && (
        <Box
          sx={{
            position: "absolute",
            top: -50,
            backgroundColor: "#fff",
            color: "#000",
            px: 2,
            py: 1,
            borderRadius: 3,
            boxShadow: 3,
            maxWidth: 180,
            textAlign: "center",
            fontSize: 14,
            animation: "fadeIn 0.3s ease",
            zIndex: 10,
          }}
        >
          {message}
        </Box>
      )}

      {/* Pet SVG */}
      <Box
        sx={{
          width: 120,
          height: 140,
          position: "relative",
          animation: isWiggling ? "wiggle 0.6s ease" : "bounce 1.5s infinite",
        }}
      >
        <svg viewBox="0 0 120 140" width="100%" height="100%">
          {/* Body */}
          <ellipse cx="60" cy="90" rx="30" ry="35" fill="#FFB6C1" />
          {/* Head */}
          <circle cx="60" cy="45" r="25" fill="#FFC0CB" />
          {/* Ears */}
          <ellipse cx="40" cy="25" rx="8" ry="12" fill="#FFC0CB" />
          <ellipse cx="80" cy="25" rx="8" ry="12" fill="#FFC0CB" />
          {/* Eyes smaller and further apart */}
          <circle cx="45" cy="42" r="2.5" fill="#000" />
          <circle cx="75" cy="42" r="2.5" fill="#000" />

          {/* Legs */}
          <ellipse cx="45" cy="125" rx="7" ry="10" fill="#FFB6C1" />
          <ellipse cx="75" cy="125" rx="7" ry="10" fill="#FFB6C1" />
          {/* Arms */}
          <ellipse
            cx="35"
            cy="70"
            rx="6"
            ry="12"
            fill="#FFB6C1"
            transform="rotate(-20 28 90)"
          />
          <ellipse
            cx="85"
            cy="70"
            rx="6"
            ry="12"
            fill="#FFB6C1"
            transform="rotate(20 92 90)"
          />
          {/* Mouth */}
          <path
            d="M54,50 Q57,53 60,50 Q63,53 66,50"
            stroke="#000"
            strokeWidth="2"
            fill="transparent"
          />
        </svg>
      </Box>

      <style>
        {`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
          @keyframes wiggle {
            0% { transform: rotate(0deg); }
            25% { transform: rotate(10deg); }
            50% { transform: rotate(-10deg); }
            75% { transform: rotate(10deg); }
            100% { transform: rotate(0deg); }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-5px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
      <Typography variant="h5">Moodstrual</Typography>
    </Box>
  );
}
