export const THEME_STORAGE_KEY = "adaptiq-theme" as const;

export type ThemePreference = "dark" | "light";

// Contract: this script should only read localStorage and toggle theme classes on
// `document.documentElement`. Keep it tiny to avoid hydration surprises.
export const THEME_INIT_SCRIPT = `(() => {
  try {
    const docEl = document.documentElement;
    const saved = localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
    const theme = saved === "light" ? "light" : "dark";

    docEl.classList.remove("light", "dark");
    if (theme === "dark") {
      docEl.classList.add("dark");
    }
  } catch {
    document.documentElement.classList.add("dark");
  }
})();`;
