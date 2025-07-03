"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon, Trash2, Sun, Moon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

/**
 * Transaction record
 */
type Transaction = {
  id: number;
  description: string;
  amount: number;
  date: string; // ISO date string yyyy-MM-dd
};

/**
 * Supported currencies
 */
type Currency = "USD" | "EUR" | "BDT" | "GBP" | "JPY" | "AUD" | "CAD" | "INR";

/**
 * Symbol map
 */
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
  // UI states
  const [darkMode, setDarkMode] = useState(false);
  const [currency, setCurrency] = useState<Currency>("USD");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Load persisted settings & data
  useEffect(() => {
    const storedDark = localStorage.getItem("darkMode");
    if (storedDark) setDarkMode(JSON.parse(storedDark));

    const storedCurrency = localStorage.getItem("currency");
    if (
      storedCurrency &&
      ["USD", "EUR", "BDT", "GBP", "JPY", "AUD", "CAD", "INR"].includes(
        storedCurrency
      )
    ) {
      setCurrency(storedCurrency as Currency);
    }

    const storedTrans = localStorage.getItem("transactions");
    if (storedTrans) setTransactions(JSON.parse(storedTrans));
  }, []);

  // Persist dark mode
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  // Persist currency
  useEffect(() => {
    localStorage.setItem("currency", currency);
  }, [currency]);

  // Persist transactions
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  // Add new transaction
  const addTransaction = () => {
    const numAmount = parseFloat(amount);
    if (!description || isNaN(numAmount) || !selectedDate) return;

    const newTransaction: Transaction = {
      id: Date.now(),
      description,
      amount: numAmount,
      date: selectedDate.toISOString().split("T")[0],
    };

    setTransactions([newTransaction, ...transactions]);
    setDescription("");
    setAmount("");
    setSelectedDate(new Date());
  };

  // Delete transaction
  const deleteTransaction = (id: number) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  // Computed totals
  const income = transactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = income + expenses;

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md rounded-2xl shadow-xl dark:bg-gray-800">
        <CardContent className="p-6 space-y-4">
          {/* Header with toggler */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Expense Tracker</h1>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle dark mode"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>
          </div>

          {/* Form inputs */}
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
                <Button variant="outline" className="w-full justify-between">
                  {format(selectedDate, "yyyy-MM-dd")}
                  <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
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
              <option value="USD">USD ({currencySymbols.USD})</option>
              <option value="EUR">EUR ({currencySymbols.EUR})</option>
              <option value="BDT">BDT ({currencySymbols.BDT})</option>
              <option value="GBP">GBP ({currencySymbols.GBP})</option>
              <option value="JPY">JPY ({currencySymbols.JPY})</option>
              <option value="AUD">AUD ({currencySymbols.AUD})</option>
              <option value="CAD">CAD ({currencySymbols.CAD})</option>
              <option value="INR">INR ({currencySymbols.INR})</option>
            </select>

            <Button className="w-full mt-2" onClick={addTransaction}>
              Add Transaction
            </Button>
          </div>

          {/* Summary */}
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

          {/* Transaction list */}
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
        </CardContent>
      </Card>
    </main>
  );
}
