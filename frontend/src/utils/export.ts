/**
 * Export utilities — generate CSV / PDF files for transactions and share them.
 * Uses expo-file-system (legacy API) + expo-print + expo-sharing.
 */
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import { Transaction } from '@/src/types';
import { getCategory } from '@/src/constants/categories';

function csvEscape(v: string): string {
  if (v == null) return '';
  const needsQuote = /[",\n]/.test(v);
  const safe = v.replace(/"/g, '""');
  return needsQuote ? `"${safe}"` : safe;
}

export function buildCsv(transactions: Transaction[]): string {
  const header = ['Date', 'Type', 'Category', 'Title', 'Amount', 'Mood', 'Payment', 'Notes'];
  const rows = transactions.map((t) => [
    new Date(t.date).toISOString().slice(0, 10),
    t.type,
    getCategory(t.category).label,
    t.title,
    String(t.amount),
    t.mood,
    t.paymentMethod,
    t.notes ?? '',
  ]);
  return [header, ...rows].map((r) => r.map((c) => csvEscape(String(c))).join(',')).join('\n');
}

export async function exportCsv(transactions: Transaction[]): Promise<{ ok: boolean; path?: string; message: string }> {
  const csv = buildCsv(transactions);
  if (Platform.OS === 'web') {
    try {
      // @ts-ignore — web only
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      // @ts-ignore
      const url = URL.createObjectURL(blob);
      // @ts-ignore
      const a = document.createElement('a');
      a.href = url;
      a.download = `budget-buddy-${Date.now()}.csv`;
      a.click();
      // @ts-ignore
      URL.revokeObjectURL(url);
      return { ok: true, message: 'CSV downloaded' };
    } catch (e: any) {
      return { ok: false, message: e?.message || 'Web download failed' };
    }
  }
  const file = `${FileSystem.documentDirectory}budget-buddy-${Date.now()}.csv`;
  await FileSystem.writeAsStringAsync(file, csv, { encoding: FileSystem.EncodingType.UTF8 });
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(file, { mimeType: 'text/csv', dialogTitle: 'Export Transactions (CSV)' });
    return { ok: true, path: file, message: 'CSV ready to share' };
  }
  return { ok: true, path: file, message: `CSV saved at ${file}` };
}

function buildPdfHtml(transactions: Transaction[], totals: { income: number; expense: number; balance: number }): string {
  const rows = transactions
    .map((t) => {
      const c = getCategory(t.category);
      const colour = t.type === 'income' ? '#4CAF50' : '#EF4444';
      const sign = t.type === 'income' ? '+' : '-';
      return `<tr>
        <td>${new Date(t.date).toLocaleDateString('en-IN')}</td>
        <td>${c.emoji} ${c.label}</td>
        <td>${escapeHtml(t.title)}</td>
        <td>${t.paymentMethod.toUpperCase()}</td>
        <td style="color:${colour}; text-align:right; font-weight:700;">${sign} ₹${t.amount.toLocaleString('en-IN')}</td>
      </tr>`;
    })
    .join('');
  return `<!doctype html><html><head><meta charset="utf-8"/>
  <style>
    body { font-family: -apple-system, Helvetica, Arial, sans-serif; padding: 32px; color: #111827; }
    h1 { color: #4CAF50; font-size: 28px; margin: 0; }
    .sub { color: #6B7280; margin-bottom: 24px; }
    .stat-row { display: flex; gap: 16px; margin: 24px 0; }
    .stat { flex: 1; padding: 16px; border-radius: 16px; border: 1px solid #E5E7EB; }
    .stat-label { font-size: 11px; color: #9CA3AF; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px; }
    .stat-value { font-size: 22px; font-weight: 800; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    th { text-align: left; font-size: 11px; color: #6B7280; text-transform: uppercase; letter-spacing: 0.6px; border-bottom: 1px solid #E5E7EB; padding: 8px 6px; }
    td { padding: 8px 6px; border-bottom: 1px solid #F3F4F6; font-size: 13px; }
    .foot { margin-top: 32px; color: #9CA3AF; font-size: 11px; text-align: center; }
  </style></head><body>
  <h1>Budget Buddy — Statement</h1>
  <div class="sub">Generated ${new Date().toLocaleString('en-IN')} • ${transactions.length} transactions</div>
  <div class="stat-row">
    <div class="stat"><div class="stat-label">Income</div><div class="stat-value" style="color:#4CAF50">₹${totals.income.toLocaleString('en-IN')}</div></div>
    <div class="stat"><div class="stat-label">Expense</div><div class="stat-value" style="color:#EF4444">₹${totals.expense.toLocaleString('en-IN')}</div></div>
    <div class="stat"><div class="stat-label">Balance</div><div class="stat-value">₹${totals.balance.toLocaleString('en-IN')}</div></div>
  </div>
  <table>
    <thead><tr><th>Date</th><th>Category</th><th>Title</th><th>Method</th><th style="text-align:right;">Amount</th></tr></thead>
    <tbody>${rows || '<tr><td colspan="5" style="text-align:center; color:#9CA3AF; padding: 24px;">No transactions</td></tr>'}</tbody>
  </table>
  <div class="foot">Budget Buddy • Track Smart. Save Better.</div>
  </body></html>`;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
}

export async function exportPdf(
  transactions: Transaction[],
  totals: { income: number; expense: number; balance: number }
): Promise<{ ok: boolean; path?: string; message: string }> {
  const html = buildPdfHtml(transactions, totals);
  if (Platform.OS === 'web') {
    try {
      // @ts-ignore web only
      const win = window.open('', '_blank');
      if (!win) return { ok: false, message: 'Pop-up blocked' };
      win.document.write(html);
      win.document.close();
      setTimeout(() => win.print(), 600);
      return { ok: true, message: 'PDF print dialog opened' };
    } catch (e: any) {
      return { ok: false, message: e?.message || 'Web PDF failed' };
    }
  }
  try {
    const { uri } = await Print.printToFileAsync({ html });
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: 'Export Statement (PDF)' });
    }
    return { ok: true, path: uri, message: 'PDF ready' };
  } catch (e: any) {
    return { ok: false, message: e?.message || 'PDF generation failed' };
  }
}
