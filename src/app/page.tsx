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
import {
  Calendar as CalendarIcon,
  Trash2,
  ChevronUp,
  ChevronDown,
  Settings as SettingsIcon,
  Sun,
  Moon,
  Repeat,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { format } from "date-fns";

//
// ——— Tip of the Day ———
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
function getTipOfTheDay() {
  const today = new Date().toISOString().split("T")[0];
  const sum = Array.from(today).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return TIPS[sum % TIPS.length];
}
function TipOfTheDay() {
  const tip = useMemo(() => getTipOfTheDay(), []);
  return (
    <Card className="mb-4 border-blue-400 dark:border-blue-600">
      <CardContent className="flex items-center justify-between">
        <p className="font-medium">💡 Tip of the Day:</p>
        <p className="ml-2 flex-1 text-sm">{tip}</p>
        <Button variant="ghost" size="icon" onClick={() => window.alert(tip)}>
          <Repeat className="w-5 h-5" />
        </Button>
      </CardContent>
    </Card>
  );
}

//
// ——— Main Component ———
//
type Transaction = {
  id: number;
  description: string;
  amount: number;
  date: string;
  category: string;
};
const DEFAULT_CATEGORIES = [
  "Salary",
  "Rent",
  "Groceries",
  "Utilities",
  "Entertainment",
  "Other",
];
const currencySymbols: Record<string, string> = {
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
  // — Settings state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const sd = localStorage.getItem("darkMode");
    return sd ? JSON.parse(sd) : false;
  });
  const [showCategories, setShowCategories] = useState<boolean>(() => {
    const sc = localStorage.getItem("showCategories");
    return sc ? JSON.parse(sc) : false; // default off
  });
  const [currency, setCurrency] = useState<string>(() => {
    const sc = localStorage.getItem("currency");
    return sc && currencySymbols[sc] ? sc : "USD";
  });

  // — Data state
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const st = localStorage.getItem("transactions");
    return st ? JSON.parse(st) : [];
  });
  const [categories, setCategories] = useState<string[]>(() => {
    const sc = localStorage.getItem("categories");
    return sc ? JSON.parse(sc) : DEFAULT_CATEGORIES;
  });

  // — Form state
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [newCategory, setNewCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categories[0] || ""
  );

  // — Delete dialog state
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // — Persist & apply settings/data
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("showCategories", JSON.stringify(showCategories));
  }, [showCategories]);

  useEffect(() => {
    localStorage.setItem("currency", currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("categories", JSON.stringify(categories));
    // if the selectedCategory was removed, reset to first
    if (!categories.includes(selectedCategory) && categories.length > 0) {
      setSelectedCategory(categories[0]);
    }
  }, [categories, selectedCategory]); // <-- added selectedCategory

  // — Handlers
  const promptDelete = (id: number) => {
    setPendingDeleteId(id);
    setDialogOpen(true);
  };
  const confirmDelete = () => {
    if (pendingDeleteId !== null) {
      // -1 means “clear all”
      if (pendingDeleteId === -1) {
        setTransactions([]);
      } else {
        setTransactions((ts) => ts.filter((t) => t.id !== pendingDeleteId));
      }
    }
    setPendingDeleteId(null);
    setDialogOpen(false);
  };
  const addTransaction = () => {
    const num = parseFloat(amount);
    if (!description || isNaN(num)) return;
    const iso = date.toISOString().split("T")[0];
    setTransactions((ts) => [
      {
        id: Date.now(),
        description,
        amount: num,
        date: iso,
        category: selectedCategory,
      },
      ...ts,
    ]);
    setDescription("");
    setAmount("");
    setDate(new Date());
  };
  const addCategory = () => {
    const name = newCategory.trim();
    if (name && !categories.includes(name)) {
      setCategories((cs) => [...cs, name]);
      setNewCategory("");
    }
  };
  const removeCategory = (i: number) =>
    setCategories((cs) => cs.filter((_, idx) => idx !== i));
  const moveCategory = (from: number, to: number) => {
    if (to < 0 || to >= categories.length) return;
    const arr = [...categories];
    const [moved] = arr.splice(from, 1);
    arr.splice(to, 0, moved);
    setCategories(arr);
  };

  // — Summaries
  const income = transactions
    .filter((t) => t.amount > 0)
    .reduce((s, t) => s + t.amount, 0);
  const expenses = transactions
    .filter((t) => t.amount < 0)
    .reduce((s, t) => s + t.amount, 0);
  const balance = income + expenses;
  const byCategory = categories.map((cat) => ({
    cat,
    total: transactions
      .filter((t) => t.category === cat)
      .reduce((s, t) => s + t.amount, 0),
  }));

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-4xl mx-auto rounded-2xl shadow-xl dark:bg-gray-800">
        <CardContent className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ─── Left: Tip, Header, Category Manager & Form ─── */}
          <div className="space-y-4">
            <TipOfTheDay />

            {/* Header with Settings & Dark-Mode */}
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Expense Tracker</h1>
              <div className="flex items-center space-x-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <SettingsIcon className="w-5 h-5" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Enable Categories</span>
                      <Switch
                        checked={showCategories}
                        onCheckedChange={setShowCategories}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Dark Mode</span>
                      <Switch
                        checked={darkMode}
                        onCheckedChange={setDarkMode}
                      />
                    </div>
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={() => promptDelete(-1)}
                    >
                      Clear All Data
                    </Button>
                  </PopoverContent>
                </Popover>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDarkMode(!darkMode)}
                >
                  {darkMode ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </div>

            {/* Category Manager */}
            {showCategories && (
              <Card className="border-gray-300 dark:border-gray-600">
                <CardContent className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="New category"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                    />
                    <Button onClick={addCategory}>Add</Button>
                  </div>
                  <div className="space-y-1 max-h-32 overflow-auto">
                    {categories.map((cat, i) => (
                      <div
                        key={cat}
                        className="flex justify-between items-center text-sm"
                      >
                        <span>{cat}</span>
                        <div className="flex gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => moveCategory(i, i - 1)}
                          >
                            <ChevronUp className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => moveCategory(i, i + 1)}
                          >
                            <ChevronDown className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => removeCategory(i)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Form */}
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <Label>Amount (negative for expense)</Label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />

              {showCategories && (
                <>
                  <Label>Category</Label>
                  <Select
                    value={selectedCategory}
                    onValueChange={(v) => setSelectedCategory(v)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </>
              )}

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
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
              >
                {Object.entries(currencySymbols).map(([c, s]) => (
                  <option key={c} value={c}>
                    {c} ({s})
                  </option>
                ))}
              </select>

              <Button className="w-full mt-2" onClick={addTransaction}>
                Add Transaction
              </Button>
            </div>
          </div>

          {/* ─── Right: Summary & Transactions ─── */}
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

            {showCategories && (
              <div>
                <h3 className="font-semibold mb-2">By Category</h3>
                <div className="space-y-1">
                  {byCategory.map(({ cat, total }) => (
                    <div key={cat} className="flex justify-between text-sm">
                      <span>{cat}</span>
                      <span
                        className={
                          total >= 0 ? "text-green-600" : "text-red-600"
                        }
                      >
                        {currencySymbols[currency]}
                        {Math.abs(total).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2 pt-4">
              {transactions.map((t) => (
                <div
                  key={t.id}
                  className="flex justify-between items-center p-2 border rounded-md bg-white dark:bg-gray-700"
                >
                  <div>
                    <p className="text-sm">{t.description}</p>
                    <p className="text-xs text-gray-500">{t.date}</p>
                    {showCategories && (
                      <p className="text-xs uppercase text-gray-600">
                        {t.category}
                      </p>
                    )}
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
                    onClick={() => promptDelete(t.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ─── Delete / Clear Confirmation Dialog ─── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              {pendingDeleteId === -1
                ? "This will clear all your data. Continue?"
                : "Are you sure you want to delete this transaction? This action cannot be undone."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              {pendingDeleteId === -1 ? "Clear All" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
