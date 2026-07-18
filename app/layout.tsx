import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "@/lib/theme";
import BackgroundMusic from "@/components/shared/BackgroundMusic";
import "./globals.css";

const cinzel = localFont({
  src: "../public/fonts/Cinzel.ttf",
  variable: "--font-display",
  weight: "400 900",
});

const cormorant = localFont({
  src: [
    {
      path: "../public/fonts/CormorantGaramond.ttf",
      weight: "300 700",
      style: "normal",
    },
    {
      path: "../public/fonts/CormorantGaramond-Italic.ttf",
      weight: "300 700",
      style: "italic",
    },
  ],
  variable: "--font-body",
});

const caveat = localFont({
  src: "../public/fonts/Caveat.ttf",
  variable: "--font-hand",
  weight: "400 700",
});

export const metadata: Metadata = {
  title: "Twin",
  description: "A world made for one person.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${cinzel.variable} ${cormorant.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <BackgroundMusic />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
