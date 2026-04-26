import type { Metadata, Viewport } from "next";
import localFont from 'next/font/local';
import CursorGlow from "./components/common/CursorGlow";
import "./globals.css";

const soriaFont = localFont({
  src: "../public/soria-font.ttf",
  variable: "--font-soria",
});

const vercettiFont = localFont({
  src: "../public/Vercetti-Regular.woff",
  variable: "--font-vercetti",
});

export const metadata: Metadata = {
  title: "Manikant Hosur",
  description: "BBA student, Vibe Coder, Python Developer, AI Automation Engineer & Affiliate Marketing Strategist. Engineering Intelligence. Automating the Future.",
  keywords: "Manikant Hosur, Python Developer, AI Automation, Jarvis AI, Affiliate Marketing, Fiverr Freelancer, Vibe Coder, BBA, KLE CBA Hubli",
  authors: [{ name: "Manikant Hosur" }],
  creator: "Manikant Hosur",
  publisher: "Manikant Hosur",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "Manikant Hosur — AI Engineer from the Future",
    description: "Engineering Intelligence. Automating the Future. Vibe Coder · Python · AI Automation · Affiliate Marketing.",
    url: "https://github.com/manikant12-hub/Manikant-portfolio",
    siteName: "Manikant Hosur's Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Manikant Hosur — AI Engineer from the Future",
    description: "Engineering Intelligence. Automating the Future.",
  },
  verification: {
    google: "",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overscroll-y-none">
      <body
        className={`${soriaFont.variable} ${vercettiFont.variable} font-sans antialiased`}
      >
        {children}
        <CursorGlow />
      </body>
    </html>
  );
}
