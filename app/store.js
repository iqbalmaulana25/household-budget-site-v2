// store.js — the family's ledger: state, persistence and arithmetic.
// One job: own the data after seeding. Pages read through here and write
// through here, so every page always agrees with every other page.

import { CATEGORIES, TRANSACTIONS, BILLS, GOALS } from './data.js';

const STORAGE_KEY = 'tatakas-ledger-v1';

function seedState() {
  return {
    categories: structuredClone(CATEGORIES),
    transactions: structuredClone(TRANSACTIONS),
    bills: structuredClone(BILLS),
    goals: structuredClone(GOALS),
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedState();
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.transactions)) return seedState();
    return parsed;
  } catch {
    return seedState();
  }
}

let state = loadState();

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full or blocked: the site still works for this visit.
  }
}

export function resetToSeed() {
  state = seedState();
  persist();
}

export function getCategories() {
  return state.categories;
}

export function categoryById(id) {
  return state.categories.find((c) => c.id === id) ?? { id, name: id, kind: 'needs', budget: 0 };
}

export function getTransactions() {
  return [...state.transactions].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getBills() {
  return [...state.bills].sort((a, b) => a.dueDay - b.dueDay);
}

export function getGoals() {
  return state.goals;
}

// --- arithmetic -----------------------------------------------------------

export function sumWhere(list, predicate) {
  return list.reduce((total, item) => (predicate(item) ? total + item.amount : total), 0);
}

export function monthIncome() {
  return sumWhere(state.transactions, (t) => t.type === 'in');
}

export function monthSpent() {
  return sumWhere(state.transactions, (t) => t.type === 'out');
}

export function monthSaved() {
  return sumWhere(state.transactions, (t) => t.type === 'save');
}

// What is left of November's pay after spending and goal transfers.
export function monthRemaining() {
  return monthIncome() - monthSpent() - monthSaved();
}

export function spentByCategory(categoryId) {
  return sumWhere(state.transactions, (t) => t.type === 'out' && t.category === categoryId);
}

export function spentByKind(kind) {
  const ids = new Set(state.categories.filter((c) => c.kind === kind).map((c) => c.id));
  return sumWhere(state.transactions, (t) => t.type === 'out' && ids.has(t.category));
}

export function budgetByKind(kind) {
  return state.categories
    .filter((c) => c.kind === kind)
    .reduce((total, c) => total + c.budget, 0);
}

export function billsTotal() {
  return state.bills.reduce((total, b) => total + b.amount, 0);
}

export function billsUnpaid() {
  return state.bills.filter((b) => !b.paid);
}

// Months until a goal is full at its planned monthly set-aside.
export function goalMonthsLeft(goal) {
  const remaining = goal.target - goal.saved;
  if (remaining <= 0) return 0;
  if (goal.monthly <= 0) return Infinity;
  return Math.ceil(remaining / goal.monthly);
}

// The calendar month a goal completes, counting from December 2026.
export function goalEtaLabel(goal) {
  const left = goalMonthsLeft(goal);
  if (left === 0) return 'Tercapai';
  if (!Number.isFinite(left)) return 'Belum terjadwal';
  const eta = new Date(2026, 11 + left, 1); // December 2026 + months left
  const names = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  return `${names[eta.getMonth()]} ${eta.getFullYear()}`;
}

// --- writes ---------------------------------------------------------------

let idCounter = 1000;

export function addTransaction({ date, text, category, type, amount }) {
  const entry = { id: `u${Date.now()}-${idCounter++}`, date, text, category, type, amount };
  state.transactions.push(entry);
  persist();
  return entry;
}

export function deleteTransaction(id) {
  state.transactions = state.transactions.filter((t) => t.id !== id);
  persist();
}

export function setBillPaid(id, paid) {
  const bill = state.bills.find((b) => b.id === id);
  if (bill) {
    bill.paid = paid;
    persist();
  }
}

export function addToGoal(id, amount) {
  const goal = state.goals.find((g) => g.id === id);
  if (goal) {
    goal.saved = Math.min(goal.target, goal.saved + amount);
    persist();
  }
}

export function setCategoryBudget(id, budget) {
  const category = state.categories.find((c) => c.id === id);
  if (category) {
    category.budget = budget;
    persist();
  }
}
