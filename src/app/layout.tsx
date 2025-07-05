import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Expense Tracker by Sami Chisti • Front End Developer",
  description:
    "An Expense Tracker featuring dark/light mode toggle, multi-currency selection, date-stamped transactions, and localStorage persistence. Easily monitor and manage your income, expenses, and budgets.",
  keywords: [
    "expense tracker",
    "personal finance app",
    "React",
    "Tailwind CSS",
    "dark mode toggle",
    "multi-currency support",
    "date picker",
    "tip of the day",
    "localStorage persistence",
    "calendar popover",
    "budgeting",
    "financial dashboard",
  ],
  authors: [
    { name: "Sami Chisti", url: "https://smexpensetracker.netlify.app" },
  ],
  creator: "Sami Chisti",
  publisher: "Sami Chisti",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],

  openGraph: {
    title: "Expense Tracker by Sami Chisti",
    description:
      "Track your expenses in style: dark/light mode, multi-currency, date stamps, tips, and more.",
    url: "/",
    siteName: "Expense Tracker",
    images: [
      {
        url: "/og image.png",
        width: 1200,
        height: 630,
        alt: "Screenshot of Expense Tracker UI",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Expense Tracker by Sami Chisti",
    description:
      "Track your expenses in style: dark/light mode, multi-currency, date stamps, tips, and more.",
    creator: "@samichisti",
    images: ["/og image.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
