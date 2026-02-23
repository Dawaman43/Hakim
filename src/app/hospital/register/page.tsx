import { HakimApp } from '@/components/hakim/hakim-app';
import { getUiPreferences } from '@/app/ui-preferences';

export default async function Page() {
  const { theme, language } = await getUiPreferences();
  return <HakimApp initialView="hospital-register" initialTheme={theme} initialLanguage={language} />;
}
