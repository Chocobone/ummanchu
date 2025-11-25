import { useEffect, useState } from "react";

export const useTheme = () => {
  const [theme, setThemeState] = useState(
    localStorage.getItem("theme") || "light"
  );

  const setTheme = (value: string) => {
    setThemeState(value);
    localStorage.setItem("theme", value);
  };

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

  return { theme, setTheme };
};
