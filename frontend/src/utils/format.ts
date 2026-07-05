import { CURRENCY } from '@/src/theme';

export function formatMoney(n: number, withSign = false): string {
  const sign = withSign && n > 0 ? '+' : n < 0 ? '-' : '';
  const abs = Math.abs(Math.round(n));
  return `${sign}${CURRENCY}${abs.toLocaleString('en-IN')}`;
}

export function formatShort(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 10000000) return `${CURRENCY}${(n / 10000000).toFixed(1)}Cr`;
  if (abs >= 100000) return `${CURRENCY}${(n / 100000).toFixed(1)}L`;
  if (abs >= 1000) return `${CURRENCY}${(n / 1000).toFixed(1)}K`;
  return `${CURRENCY}${Math.round(n)}`;
}

export function todayISO(): string {
  return new Date().toISOString();
}

export function monthKey(d: Date | string): string {
  const date = typeof d === 'string' ? new Date(d) : d;
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export function sameMonth(iso: string, ref = new Date()): boolean {
  const d = new Date(iso);
  return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth();
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatDayMonth(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export function greet(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}
