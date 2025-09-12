// Color palette based on Flora & Fauna design references
// Paleta de colores consistente para toda la aplicación

const tintColorLight = '#2E7D32';
const tintColorDark = '#4CAF50';

export const Colors = {
  // Primary Colors - Nature Theme
  primary: {
    50: '#E8F5E8',
    100: '#C8E6C9',
    200: '#A5D6A7',
    300: '#81C784',
    400: '#66BB6A',
    500: '#4CAF50', // Main green
    600: '#43A047',
    700: '#388E3C',
    800: '#2E7D32',
    900: '#1B5E20',
  },

  // Secondary Colors - Earth Tones
  secondary: {
    50: '#FFF3E0',
    100: '#FFE0B2',
    200: '#FFCC80',
    300: '#FFB74D',
    400: '#FFA726',
    500: '#FF9800', // Main orange
    600: '#FB8C00',
    700: '#F57C00',
    800: '#EF6C00',
    900: '#E65100',
  },

  // Status Colors
  status: {
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',
  },

  // Conservation Status Colors
  conservation: {
    common: '#4CAF50',      // Verde - Común
    vulnerable: '#FF9800',   // Naranja - Vulnerable
    endangered: '#FF5722',   // Rojo naranja - En Peligro
    critical: '#F44336',     // Rojo - Crítico
    extinct: '#424242',      // Gris - Extinto
  },

  // Neutral Colors
  neutral: {
    0: '#FFFFFF',
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
    1000: '#000000',
  },

  // Text Colors
  text: {
    primary: '#212121',
    secondary: '#757575',
    disabled: '#BDBDBD',
    hint: '#9E9E9E',
    inverse: '#FFFFFF',
  },

  // Background Colors
  background: {
    primary: '#FFFFFF',
    secondary: '#F5F7FA',
    tertiary: '#FAFAFA',
  },

  // Gradient Colors
  gradients: {
    primary: ['#1B5E20', '#2E7D32'],
    secondary: ['#E65100', '#FF9800'],
    blue: ['#1565C0', '#1976D2'],
    fauna: ['#BF360C', '#FF5722'],
  },

  // Original theme colors for compatibility
  light: {
    text: '#212121',
    background: '#fff',
    tint: tintColorLight,
    icon: '#757575',
    tabIconDefault: '#9E9E9E',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

// Utility functions for color manipulation
export const ColorUtils = {
  // Get conservation status color
  getConservationColor: (status: string): string => {
    switch (status.toLowerCase()) {
      case 'común':
      case 'common':
        return Colors.conservation.common;
      case 'vulnerable':
        return Colors.conservation.vulnerable;
      case 'en peligro':
      case 'endangered':
        return Colors.conservation.endangered;
      case 'crítico':
      case 'critical':
        return Colors.conservation.critical;
      case 'extinto':
      case 'extinct':
        return Colors.conservation.extinct;
      default:
        return Colors.neutral[500];
    }
  },
};
