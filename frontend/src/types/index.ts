export type TxnType = 'expense' | 'income';

export type CategoryId =
  | 'food'
  | 'shopping'
  | 'transport'
  | 'bills'
  | 'entertainment'
  | 'medical'
  | 'travel'
  | 'others'
  | 'salary'
  | 'freelance'
  | 'business'
  | 'other_income';

export type PaymentMethod = 'cash' | 'upi' | 'card' | 'bank';

export type Mood = 'happy' | 'normal' | 'sad' | 'excited' | 'confident' | 'angry';

export interface Transaction {
  id: string;
  type: TxnType;
  amount: number;
  category: CategoryId;
  title: string;
  notes?: string;
  date: string; // ISO
  mood: Mood;
  paymentMethod: PaymentMethod;
}

export interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  saved: number;
  deadline: string; // ISO
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

export interface UserProfile {
  name: string;
  email: string;
  monthlyBudget: number;
  isGuest: boolean;
  onboarded: boolean;
}
