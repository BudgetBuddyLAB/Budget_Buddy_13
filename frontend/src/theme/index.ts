/**
 * Budget Buddy — Design Tokens
 * Two palettes (light + dark) consumed via ThemeProvider.
 * Spacing/radius/shadow/font are theme-independent.
 */

export interface Palette {
  surface: string;
  onSurface: string;
  surfaceSecondary: string;
  onSurfaceSecondary: string;
  surfaceTertiary: string;
  onSurfaceTertiary: string;
  surfaceInverse: string;
  onSurfaceInverse: string;
  brand: string;
  brandPrimary: string;
  onBrandPrimary: string;
  brandSecondary: string;
  onBrandSecondary: string;
  brandTertiary: string;
  onBrandTertiary: string;
  success: string;
  warning: string;
  error: string;
  income: string;
  expense: string;
  savings: string;
  border: string;
  borderStrong: string;
  divider: string;
  muted: string;
  shadow: string;
  scrim: string;
}

export const lightColors: Palette = {
  surface: '#F7F9FC',
  onSurface: '#111827',
  surfaceSecondary: '#FFFFFF',
  onSurfaceSecondary: '#374151',
  surfaceTertiary: '#F3F4F6',
  onSurfaceTertiary: '#4B5563',
  surfaceInverse: '#111827',
  onSurfaceInverse: '#F9FAFB',
  brand: '#4CAF50',
  brandPrimary: '#4CAF50',
  onBrandPrimary: '#FFFFFF',
  brandSecondary: '#00BCD4',
  onBrandSecondary: '#FFFFFF',
  brandTertiary: '#E8F5E9',
  onBrandTertiary: '#1B5E20',
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#EF4444',
  income: '#4CAF50',
  expense: '#EF4444',
  savings: '#00BCD4',
  border: '#E5E7EB',
  borderStrong: '#D1D5DB',
  divider: '#E5E7EB',
  muted: '#9CA3AF',
  shadow: 'rgba(17, 24, 39, 0.08)',
  scrim: 'rgba(17,24,39,0.45)',
};

export const darkColors: Palette = {
  surface: '#0B1220',
  onSurface: '#F9FAFB',
  surfaceSecondary: '#111827',
  onSurfaceSecondary: '#D1D5DB',
  surfaceTertiary: '#1F2937',
  onSurfaceTertiary: '#9CA3AF',
  surfaceInverse: '#F9FAFB',
  onSurfaceInverse: '#111827',
  brand: '#66BB6A',
  brandPrimary: '#66BB6A',
  onBrandPrimary: '#062b0d',
  brandSecondary: '#26C6DA',
  onBrandSecondary: '#062023',
  brandTertiary: '#0E2F1B',
  onBrandTertiary: '#A8E6CF',
  success: '#66BB6A',
  warning: '#FFD54F',
  error: '#F87171',
  income: '#66BB6A',
  expense: '#F87171',
  savings: '#26C6DA',
  border: '#1F2937',
  borderStrong: '#374151',
  divider: '#1F2937',
  muted: '#6B7280',
  shadow: 'rgba(0, 0, 0, 0.35)',
  scrim: 'rgba(0,0,0,0.65)',
};

// Default export retained for backwards-compat; defaults to light palette.
// Prefer using `useColors()` from ThemeProvider in components.
export const colors: Palette = lightColors;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 20,
  pill: 999,
};

export const font = {
  family: undefined as unknown as string,
  size: { sm: 12, base: 14, lg: 16, xl: 20, xxl: 24, hero: 34 },
};

export const shadow = {
  card: {
    shadowColor: '#0B1220',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  soft: {
    shadowColor: '#0B1220',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
};

export const CURRENCY = '\u20B9'; // INR symbol
