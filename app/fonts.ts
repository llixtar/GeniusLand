import { Montserrat, Comfortaa, Nunito, Inter } from "next/font/google";

/**
 * ============================================================================
 * GENIUS LAND FONT SYSTEM CONFIGURATION
 * ============================================================================
 * All fonts MUST support "cyrillic" subset as the website is in Ukrainian.
 * To change a font, simply replace the Google Font import and instantiate it below.
 */

// 1. Назва бренду (Brand name font)
// Default: Comfortaa (playful, rounded, friendly)
export const brandFont = Comfortaa({
  subsets: ["latin", "cyrillic"],
  weight: ["700"],
  variable: "--font-brand-name",
  display: "swap",
});

// 2. Меню навігації (Navigation menu font)
// Default: Montserrat (geometric, bold, clean)
export const navFont = Montserrat({
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700", "800", "900"],
  variable: "--font-nav-menu",
  display: "swap",
});

// 3. Заголовки в блоках (Block headings font - h1, h2, h3)
// Default: Montserrat (impactful and modern)
export const headingFont = Montserrat({
  subsets: ["latin", "cyrillic"],
  weight: ["700", "800", "900"],
  variable: "--font-block-headings",
  display: "swap",
});

// 4. Підзаголовки (Subheadings/subtitles font)
// Default: Montserrat
export const subheadingFont = Montserrat({
  subsets: ["latin", "cyrillic"],
  weight: ["600", "700", "800"],
  variable: "--font-subheadings",
  display: "swap",
});

// 5. Тексти (Body texts font)
// Default: Nunito (highly readable, soft rounded corners)
export const bodyFont = Nunito({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body-texts",
  display: "swap",
});

// 6. Тексти на кнопках (Button texts font)
// Default: Montserrat
export const buttonFont = Montserrat({
  subsets: ["latin", "cyrillic"],
  weight: ["700", "800", "900"],
  variable: "--font-button-texts",
  display: "swap",
});
