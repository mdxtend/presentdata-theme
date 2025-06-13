// pages/theme.tsx

import { useEffect, useState } from "react"

type Theme = "neon-green" | "neon-purple" | "neon-blue"
type ThemeMode = "light" | "dark" | "system"

const THEME_KEY = "theme"
const MODE_KEY = "mode"
const themes: Theme[] = ["neon-green", "neon-purple", "neon-blue"]
const modes: ThemeMode[] = ["light", "dark", "system"]

const getStored = <T,>(key: string, fallback: T, valid: T[]): T => {
  if (typeof window === "undefined") return fallback
  const value = localStorage.getItem(key)
  return value && valid.includes(value as T) ? (value as T) : fallback
}

export default function ThemePage() {
  const [theme, setTheme] = useState<Theme>("neon-green")
  const [mode, setMode] = useState<ThemeMode>("dark")

  useEffect(() => {
    setTheme(getStored("theme", "neon-green", themes))
    setMode(getStored("mode", "dark", modes))
  }, [])

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove(...themes, ...modes)
    root.classList.add(theme, mode)

    const appliedMode =
      mode === "system"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : mode

    root.setAttribute("theme", appliedMode)
    localStorage.setItem(THEME_KEY, theme)
    localStorage.setItem(MODE_KEY, mode)
  }, [theme, mode])

  return (
    <main className="min-h-screen px-6 py-10 space-y-6 bg-background text-foreground">
      <h1 className="text-2xl font-semibold">Theme Toggle</h1>

      <div className="space-y-4">
        <div>
          <label className="font-medium">Select Accent Theme</label>
          <div className="flex gap-3 mt-2">
            {themes.map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`px-4 py-2 rounded border ${
                  theme === t ? "bg-foreground text-background" : "border-border"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="font-medium">Select Mode</label>
          <div className="flex gap-3 mt-2">
            {modes.map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-4 py-2 rounded border ${
                  mode === m ? "bg-foreground text-background" : "border-border"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
