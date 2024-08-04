// src/components/Layout/ThemeToggleButton.js
import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import {
  Brightness7,
  Brightness4,
  WbSunny,
  NightlightRound,
} from "@mui/icons-material";
import { useTheme, useThemeUpdate } from "../../context/themeContext";

const ThemeToggleButton = () => {
  const { theme } = useTheme();
  const toggleTheme = useThemeUpdate();

  const isLightMode = theme === "light";

  return (
    <Tooltip title={`Switch to ${isLightMode ? "Dark" : "Light"} Mode`}>
      <IconButton onClick={toggleTheme} color="inherit">
        {isLightMode ? (
          <>
            <Brightness7 sx={{ verticalAlign: "middle" }} />
            <WbSunny sx={{ ml: 1, verticalAlign: "middle" }} />
          </>
        ) : (
          <>
            <Brightness4 sx={{ verticalAlign: "middle" }} />
            <NightlightRound sx={{ ml: 1, verticalAlign: "middle" }} />
          </>
        )}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggleButton;
