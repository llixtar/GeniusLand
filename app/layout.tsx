import type { Metadata } from "next";
import "./globals.css";
import AdminShortcutListener from "@/components/AdminShortcutListener";
import { brandFont, navFont, headingFont, subheadingFont, bodyFont, buttonFont } from "./fonts";

export const metadata: Metadata = {
  metadataBase: new URL("https://genius-land.com.ua"),
  title: "GeniusLand | Сучасна онлайн-школа розвитку для дітей та офлайн-заняття у м. Хотин",
  description: "Сучасна онлайн-школа розвитку для дітей GeniusLand. Англійська мова, ментальна арифметика, підготовка до школи, швидкочитання та логопед. Навчайтеся онлайн з будь-якої точки світу або відвідуйте офлайн-заняття у м. Хотин.",
  keywords: [
    "онлайн-школа для дітей",
    "англійська онлайн для дітей",
    "ментальна арифметика онлайн",
    "підготовка до школи онлайн",
    "швидкочитання онлайн",
    "логопед онлайн",
    "школа розвитку Хотин",
    "англійська для дітей Хотин",
    "підготовка до школи Хотин",
    "логопед Хотин",
    "GeniusLand"
  ],
  authors: [{ name: "GeniusLand" }],
  creator: "GeniusLand",
  openGraph: {
    title: "GeniusLand | Сучасна онлайн-школа розвитку для дітей (та офлайн у м. Хотин)",
    description: "Сучасна онлайн-школа розвитку для дітей GeniusLand. Англійська мова, ментальна арифметика, підготовка до школи, швидкочитання та логопед. Навчайтеся онлайн з будь-якої точки світу або відвідуйте офлайн-заняття у м. Хотин.",
    url: "https://genius-land.com.ua",
    siteName: "GeniusLand",
    locale: "uk_UA",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="uk"
      className={`${brandFont.variable} ${navFont.variable} ${headingFont.variable} ${subheadingFont.variable} ${bodyFont.variable} ${buttonFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AdminShortcutListener />
        {children}
      </body>
    </html>
  );
}
