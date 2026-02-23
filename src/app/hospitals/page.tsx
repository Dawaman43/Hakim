import { HakimApp } from '@/components/hakim/hakim-app';
import { getUiPreferences } from '@/app/ui-preferences';

export default async function Page() {
  const { theme, language } = await getUiPreferences();
  return <HakimApp initialView="hospitals" initialTheme={theme} initialLanguage={language} />;
}
