import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Expense Tracker by Sami Chisti • Front End Developer",
  description:
    "A Expense Tracker featuring dark/light mode toggle, multi-currency selection, date-stamped transactions, and localStorage persistence. Easily monitor and manage your income and expenses.",
  keywords:
    "expense tracker, personal finance app, React, Tailwind CSS, dark mode toggle, multi-currency support, date picker, tip of the day, localStorage persistence, calendar popover, budgeting, financial dashboard",
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
