import { CategoryId, Mood } from '@/src/types';

export interface CategoryMeta {
  id: CategoryId;
  label: string;
  emoji: string;
  color: string;
  kind: 'expense' | 'income';
}

export const EXPENSE_CATEGORIES: CategoryMeta[] = [
  { id: 'food', label: 'Food', emoji: '\uD83C\uDF55', color: '#FF6B6B', kind: 'expense' },
  { id: 'shopping', label: 'Shopping', emoji: '\uD83D\uDED2', color: '#FFE66D', kind: 'expense' },
  { id: 'transport', label: 'Transport', emoji: '\uD83D\uDE97', color: '#4ECDC4', kind: 'expense' },
  { id: 'bills', label: 'Bills', emoji: '\uD83D\uDCA1', color: '#A8E6CF', kind: 'expense' },
  { id: 'entertainment', label: 'Fun', emoji: '\uD83C\uDFAC', color: '#B4A7D6', kind: 'expense' },
  { id: 'medical', label: 'Medical', emoji: '\u2764\uFE0F', color: '#FF8B94', kind: 'expense' },
  { id: 'travel', label: 'Travel', emoji: '\u2708\uFE0F', color: '#5DADE2', kind: 'expense' },
  { id: 'others', label: 'Others', emoji: '\uD83D\uDCE6', color: '#D4A5A5', kind: 'expense' },
];

export const INCOME_CATEGORIES: CategoryMeta[] = [
  { id: 'salary', label: 'Salary', emoji: '\uD83D\uDCBC', color: '#4CAF50', kind: 'income' },
  { id: 'freelance', label: 'Freelance', emoji: '\uD83D\uDCBB', color: '#00BCD4', kind: 'income' },
  { id: 'business', label: 'Business', emoji: '\uD83C\uDFEA', color: '#FFC107', kind: 'income' },
  { id: 'other_income', label: 'Other', emoji: '\u2728', color: '#9C27B0', kind: 'income' },
];

export const ALL_CATEGORIES: CategoryMeta[] = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

export function getCategory(id: CategoryId): CategoryMeta {
  return ALL_CATEGORIES.find((c) => c.id === id) ?? EXPENSE_CATEGORIES[7];
}

export const MOODS: { id: Mood; emoji: string; label: string }[] = [
  { id: 'happy', emoji: '\uD83D\uDE0A', label: 'Happy' },
  { id: 'normal', emoji: '\uD83D\uDE10', label: 'Normal' },
  { id: 'sad', emoji: '\uD83D\uDE22', label: 'Sad' },
  { id: 'excited', emoji: '\uD83D\uDE0D', label: 'Excited' },
  { id: 'confident', emoji: '\uD83D\uDE0E', label: 'Confident' },
  { id: 'angry', emoji: '\uD83D\uDE21', label: 'Angry' },
];

export const PAYMENT_METHODS: { id: 'cash' | 'upi' | 'card' | 'bank'; label: string; emoji: string }[] = [
  { id: 'cash', label: 'Cash', emoji: '\uD83D\uDCB5' },
  { id: 'upi', label: 'UPI', emoji: '\uD83D\uDCF1' },
  { id: 'card', label: 'Card', emoji: '\uD83D\uDCB3' },
  { id: 'bank', label: 'Bank', emoji: '\uD83C\uDFE6' },
];
