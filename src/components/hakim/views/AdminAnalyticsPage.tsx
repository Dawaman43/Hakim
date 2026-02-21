"use client";

interface AdminAnalyticsPageProps {
  darkMode: boolean;
}

export function AdminAnalyticsPage({ darkMode }: AdminAnalyticsPageProps) {
  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${darkMode ? "bg-gray-950" : "bg-background"}`}>
      <p>Admin Analytics Page</p>
    </div>
  );
}
