// theme.tsx (or themeContext.tsx, whichever name you prefer)

import React, { createContext, useState, useContext } from "react";

/**
 * Define the shape of your theme. 
 * Feel free to add or remove properties based on your UI needs.
 */
export interface Theme {
  background: string;
  text: string;
  cardBackground: string;
  cardText: string;
  dateBackground: string;
  dateText: string;
  numericBackground: string;
  numericText: string;
  navigationBackgroundColor: string;
  navigationTextColor: string;
}

/**
 * Example Dark Theme
 */
const darkTheme: Theme = {
  background: "#131313",
  text: "#FFFFFF",
  cardBackground: "#1E1E1E",
  cardText: "#FFFFFF",
  dateBackground: "#333333",
  dateText: "#FFFFFF",
  numericBackground: "#FFFFFF",
  numericText: "#000000",
  // You can set your header/nav bar color here
  navigationBackgroundColor: "#4B0082", // A purple-ish dark color
  navigationTextColor: "#FFFFFF",
};

/**
 * Example Light Theme
 */
const lightTheme: Theme = {
  background: "#FAFAFA",
  text: "#000000",
  cardBackground: "#FFFFFF",
  cardText: "#000000",
  dateBackground: "#EFEFEF",
  dateText: "#333333",
  numericBackground: "#FFFFFF",
  numericText: "#000000",
  // A bright accent for the nav bar
  navigationBackgroundColor: "#7B68EE", // Light purple
  navigationTextColor: "#FFFFFF",
};

/**
 * The context will store the current theme object & a toggleTheme function.
 */
interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextProps>({
  theme: lightTheme,
  toggleTheme: () => {},
});

/**
 * ThemeProvider wraps your app with theme state and logic
 */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>(lightTheme);

  const toggleTheme = () => {
    setTheme((prev) => (prev === darkTheme ? lightTheme : darkTheme));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Hook to consume the theme context from any component.
 */
export const useTheme = () => useContext(ThemeContext);
