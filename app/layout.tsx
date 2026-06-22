import type { Metadata } from "next";
import "./globals.css";
import AdminShortcutListener from "@/components/AdminShortcutListener";
import { brandFont, navFont, headingFont, subheadingFont, bodyFont, buttonFont } from "./fonts";

export const metadata: Metadata = {
  title: "GeniusLand | Сучасна школа розвитку для дітей у м. Хотин",
  description: "Англійська мова, ментальна арифметика, підготовка до школи, швидкочитання та заняття з логопедом у Хотині. Індивідуальний підхід до кожної дитини.",
  keywords: ["школа розвитку Хотин", "англійська для дітей Хотин", "ментальна арифметика Хотин", "підготовка до школи", "логопед Хотин", "репетитор Хотин", "швидкочитання", "розвиток дитини", "GeniusLand"],
  authors: [{ name: "GeniusLand" }],
  creator: "GeniusLand",
  openGraph: {
    title: "GeniusLand | Сучасна школа розвитку для дітей",
    description: "Англійська мова, ментальна арифметика, підготовка до школи, швидкочитання та заняття з логопедом у Хотині. Індивідуальний підхід до кожної дитини.",
    url: "https://geniusland.com.ua",
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
