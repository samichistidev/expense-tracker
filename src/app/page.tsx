"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Trash2, Sun, Moon } from "lucide-react";
import { format } from "date-fns";

//
// ——— Tip of the Day Component ———
//
const TIPS = [
  "Automate small savings: round up each expense and stash the spare change.",
  "Review subscriptions monthly—cancel any you no longer use.",
  "Set a weekly spending limit and track progress mid-week.",
  "Build an emergency fund of at least one month’s expenses.",
  "Use separate accounts or “buckets” to earmark money for big goals.",
  "Pay yourself first: transfer savings as soon as you get paid.",
  "Compare prices on recurring bills (insurance, phone) every 6 months.",
  "Plan meals ahead to reduce impulse grocery or takeout spending.",
  "Track your daily expenses to identify spending patterns.",
  "Categorize transactions immediately to simplify monthly reviews.",
  "Set bill-payment reminders to avoid late fees.",
  "Review your budget at month-end and adjust allocations.",
  "Use cashback apps to get rewards on regular purchases.",
  "Negotiate lower rates on recurring bills at least once a year.",
  "Limit dining out to special occasions to cut restaurant bills.",
  "Save windfalls (bonuses, gifts) instead of spending them.",
  "Invest a small percentage of each paycheck for long-term growth.",
  "Reconcile your bank statements weekly to catch errors early.",
];

function getTipOfTheDay(): string {
  const today = new Date().toISOString().split("T")[0];
  const sum = Array.from(today).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return TIPS[sum % TIPS.length];
}

function TipOfTheDay() {
  const tip = useMemo(() => getTipOfTheDay(), []);
  return (
    <div className="py-4 px-4 mb-4 border rounded-md">
      <div className="flex justify-between">
        <div className="flex flex-col gap-2">
          <p className="font-medium">💡 Tip of the Day:</p>
          <p className="ml-2 flex-1 text-sm">{tip}</p>
        </div>
      </div>
    </div>
  );
}

//
// ——— Main Home Component ———
//
type Transaction = {
  id: number;
  description: string;
  amount: number;
  date: string;
};

type Currency = "USD" | "EUR" | "BDT" | "GBP" | "JPY" | "AUD" | "CAD" | "INR";

const currencySymbols: Record<Currency, string> = {
  USD: "$",
  EUR: "€",
  BDT: "৳",
  GBP: "£",
  JPY: "¥",
  AUD: "A$",
  CAD: "C$",
  INR: "₹",
};

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [currency, setCurrency] = useState<Currency>("USD");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState<Date>(new Date());

  useEffect(() => {
    const sd = localStorage.getItem("darkMode");
    if (sd) setDarkMode(JSON.parse(sd));
    const sc = localStorage.getItem("currency");
    if (sc && (Object.keys(currencySymbols) as string[]).includes(sc))
      setCurrency(sc as Currency);
    const st = localStorage.getItem("transactions");
    if (st) setTransactions(JSON.parse(st));
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);
  useEffect(() => void localStorage.setItem("currency", currency), [currency]);
  useEffect(
    () =>
      void localStorage.setItem("transactions", JSON.stringify(transactions)),
    [transactions]
  );

  const addTransaction = () => {
    const num = parseFloat(amount);
    if (!description || isNaN(num)) return;
    const iso = date.toISOString().split("T")[0];
    setTransactions([
      { id: Date.now(), description, amount: num, date: iso },
      ...transactions,
    ]);
    setDescription("");
    setAmount("");
    setDate(new Date());
  };

  const deleteTransaction = (id: number) =>
    setTransactions(transactions.filter((t) => t.id !== id));

  const income = transactions
    .filter((t) => t.amount > 0)
    .reduce((s, t) => s + t.amount, 0);
  const expenses = transactions
    .filter((t) => t.amount < 0)
    .reduce((s, t) => s + t.amount, 0);
  const balance = income + expenses;

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md lg:max-w-4xl mx-auto rounded-2xl shadow-xl dark:bg-gray-800">
        <CardContent className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ─── Left Column on lg+: Tip, Header, Form ─── */}
          <div className="space-y-4">
            <TipOfTheDay />

            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Expense Tracker</h1>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDarkMode(!darkMode)}
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Salary or Rent"
              />

              <Label>Amount (negative for expense)</Label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="200 or -50"
              />

              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    {format(date, "yyyy-MM-dd")}
                    <CalendarIcon className="ml-auto w-4 h-4 opacity-60" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => d && setDate(d)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Label>Currency</Label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
              >
                {Object.entries(currencySymbols).map(([code, sym]) => (
                  <option key={code} value={code}>
                    {code} ({sym})
                  </option>
                ))}
              </select>

              <Button className="w-full mt-2" onClick={addTransaction}>
                Add Transaction
              </Button>
            </div>
          </div>

          {/* ─── Right Column on lg+: Summary & List ─── */}
          <div className="space-y-4">
            <div className="border-t pt-4">
              <p className="font-semibold">
                Balance: {currencySymbols[currency]}
                {balance.toFixed(2)}
              </p>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-green-600 dark:text-green-400">
                  Income: {currencySymbols[currency]}
                  {income.toFixed(2)}
                </span>
                <span className="text-red-600 dark:text-red-400">
                  Expenses: {currencySymbols[currency]}
                  {Math.abs(expenses).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-4">
              {transactions.map((t) => (
                <div
                  key={t.id}
                  className="flex justify-between items-center p-2 border rounded-md bg-white dark:bg-gray-700"
                >
                  <div>
                    <p className="text-sm">{t.description}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {t.date}
                    </p>
                    <p
                      className={`text-xs ${
                        t.amount >= 0
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {currencySymbols[currency]}
                      {t.amount.toFixed(2)}
                    </p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => deleteTransaction(t.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
