"use client";

import { cn } from "@/lib/utils";
import { THEME_STORAGE_KEY, type ThemePreference } from "@/lib/theme";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

function readThemeFromDom(): ThemePreference {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function writeThemeToDom(theme: ThemePreference) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

function persistTheme(theme: ThemePreference) {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}

export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<ThemePreference>("dark");

  useEffect(() => {
    setTheme(readThemeFromDom());
  }, []);

  const nextTheme: ThemePreference = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      aria-label={`Switch to ${nextTheme} theme`}
      title={`Switch to ${nextTheme} theme`}
      onClick={() => {
        writeThemeToDom(nextTheme);
        persistTheme(nextTheme);
        setTheme(nextTheme);
      }}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-md",
        "border border-border bg-card text-foreground",
        "hover:bg-accent hover:text-accent-foreground",
        "transition-colors",
        className,
      )}
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Moon className="h-4 w-4" aria-hidden="true" />
      )}
    </button>
  );
}
