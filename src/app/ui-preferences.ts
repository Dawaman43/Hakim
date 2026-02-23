import { cookies } from "next/headers";

export type ThemePreference = "light" | "dark";
export type LanguagePreference = "en" | "am";

export async function getUiPreferences(): { theme: ThemePreference; language: LanguagePreference } {
  const cookieStore = await cookies();
  const theme = cookieStore.get("hakim_theme")?.value;
  const language = cookieStore.get("hakim_lang")?.value;

  return {
    theme: theme === "dark" ? "dark" : "light",
    language: language === "am" ? "am" : "en",
  };
}
