
/**
 * TypeScript type definitions for the church theme
 * Generated from Figma theme.css
 */

export interface ChurchColors {
  blue: {
    DEFAULT: string;
    dark: string;
    mid: string;
    light: string;
  };
  gold: {
    DEFAULT: string;
    light: string;
    pale: string;
  };
}

export interface ThemeColors {
  background: string;
  foreground: string;
  card: {
    DEFAULT: string;
    foreground: string;
  };
  popover: {
    DEFAULT: string;
    foreground: string;
  };
  primary: {
    DEFAULT: string;
    foreground: string;
  };
  secondary: {
    DEFAULT: string;
    foreground: string;
  };
  muted: {
    DEFAULT: string;
    foreground: string;
  };
  accent: {
    DEFAULT: string;
    foreground: string;
  };
  destructive: {
    DEFAULT: string;
    foreground: string;
  };
  border: string;
  input: string;
  inputBackground: string;
  switchBackground: string;
  ring: string;
  chart: {
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
  };
  sidebar: {
    DEFAULT: string;
    foreground: string;
    primary: string;
    primaryForeground: string;
    accent: string;
    accentForeground: string;
    border: string;
    ring: string;
  };
}

export interface ThemeTypography {
  fontDisplay: string;
  fontBody: string;
  fontSize: string;
  fontWeightMedium: string;
  fontWeightNormal: string;
  headingStyles: {
    h1: TypographyStyle;
    h2: TypographyStyle;
    h3: TypographyStyle;
    h4: TypographyStyle;
  };
}

export interface TypographyStyle {
  fontSize: string;
  fontWeight: string;
  lineHeight: number;
}

export interface ThemeRadius {
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

export interface ThemeConfig {
  colors: ThemeColors;
  churchColors: ChurchColors;
  typography: ThemeTypography;
  radius: ThemeRadius;
  isDark: boolean;
}

// Helper function to get CSS variable value
export const getCSSVariable = (variable: string): string => {
  if (typeof window === 'undefined') return '';
  return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
};

// Church color constants for use in TypeScript/JavaScript
export const CHURCH_COLORS: ChurchColors = {
  blue: {
    DEFAULT: '#1B3A7A',
    dark: '#0F2455',
    mid: '#2A4F9E',
    light: '#3D6BC4',
  },
  gold: {
    DEFAULT: '#C8962C',
    light: '#E8B84B',
    pale: '#FDF3DC',
  },
} as const;

// Typography constants
export const TYPOGRAPHY: ThemeTypography = {
  fontDisplay: "'Playfair Display', Georgia, serif",
  fontBody: "'Inter', system-ui, sans-serif",
  fontSize: '16px',
  fontWeightMedium: '500',
  fontWeightNormal: '400',
  headingStyles: {
    h1: {
      fontSize: 'var(--text-2xl)',
      fontWeight: 'var(--font-weight-medium)',
      lineHeight: 1.5,
    },
    h2: {
      fontSize: 'var(--text-xl)',
      fontWeight: 'var(--font-weight-medium)',
      lineHeight: 1.5,
    },
    h3: {
      fontSize: 'var(--text-lg)',
      fontWeight: 'var(--font-weight-medium)',
      lineHeight: 1.5,
    },
    h4: {
      fontSize: 'var(--text-base)',
      fontWeight: 'var(--font-weight-medium)',
      lineHeight: 1.5,
    },
  },
} as const;

// Animation variants
export type AnimationVariant = 
  | 'fade-in'
  | 'fade-in-up'
  | 'fade-in-down'
  | 'slide-in-left'
  | 'slide-in-right'
  | 'pulse-gold'
  | 'scale-in'
  | 'shimmer'
  | 'float';

// Style helper functions
export const createChurchGradient = (direction: 'dark' | 'light'): string => {
  if (direction === 'dark') {
    return 'linear-gradient(135deg, #0B1A40 0%, #1B3A7A 60%, #0F2455 100%)';
  }
  return 'linear-gradient(180deg, #EEF2FB 0%, #F8F9FC 100%)';
};

export const createGoldGlow = (): string => {
  return 'radial-gradient(ellipse 60% 70% at 50% 100%, rgba(200,150,44,0.1) 0%, transparent 70%)';
};