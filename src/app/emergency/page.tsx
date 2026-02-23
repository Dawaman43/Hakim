import { HakimApp } from '@/components/hakim/hakim-app';
import { getUiPreferences } from '@/app/ui-preferences';

export default async function Page() {
  const { theme, language } = await getUiPreferences();
  return <HakimApp initialView="emergency" initialTheme={theme} initialLanguage={language} />;
}
