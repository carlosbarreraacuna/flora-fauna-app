// Typography constants based on the design references
// Aplicando tipografía consistente según las imágenes de referencia

export const Typography = {
  // Font Families
  fontFamily: {
    regular: 'System', // Using system font for better compatibility
    medium: 'System',
    semiBold: 'System',
    bold: 'System',
  },

  // Font Sizes - Based on design hierarchy
  fontSize: {
    // Headers
    h1: 28,
    h2: 24,
    h3: 20,
    h4: 18,
    h5: 16,
    h6: 14,

    // Body text
    bodyLarge: 16,
    bodyMedium: 14,
    bodySmall: 12,
    bodyXSmall: 10,

    // UI Elements
    button: 16,
    buttonSmall: 14,
    caption: 12,
    overline: 10,
    label: 14,
  },

  // Font Weights
  fontWeight: {
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
    extraBold: '800' as const,
  },

  // Line Heights
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8,
  },

  // Letter Spacing
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
  },
};

// Text Styles - Pre-defined combinations
export const TextStyles = {
  // Headers
  h1: {
    fontSize: Typography.fontSize.h1,
    fontWeight: Typography.fontWeight.bold,
    lineHeight: Typography.fontSize.h1 * Typography.lineHeight.tight,
    letterSpacing: Typography.letterSpacing.tight,
  },
  h2: {
    fontSize: Typography.fontSize.h2,
    fontWeight: Typography.fontWeight.bold,
    lineHeight: Typography.fontSize.h2 * Typography.lineHeight.tight,
    letterSpacing: Typography.letterSpacing.tight,
  },
  h3: {
    fontSize: Typography.fontSize.h3,
    fontWeight: Typography.fontWeight.semiBold,
    lineHeight: Typography.fontSize.h3 * Typography.lineHeight.normal,
    letterSpacing: Typography.letterSpacing.normal,
  },
  h4: {
    fontSize: Typography.fontSize.h4,
    fontWeight: Typography.fontWeight.semiBold,
    lineHeight: Typography.fontSize.h4 * Typography.lineHeight.normal,
    letterSpacing: Typography.letterSpacing.normal,
  },
  h5: {
    fontSize: Typography.fontSize.h5,
    fontWeight: Typography.fontWeight.medium,
    lineHeight: Typography.fontSize.h5 * Typography.lineHeight.normal,
    letterSpacing: Typography.letterSpacing.normal,
  },
  h6: {
    fontSize: Typography.fontSize.h6,
    fontWeight: Typography.fontWeight.medium,
    lineHeight: Typography.fontSize.h6 * Typography.lineHeight.normal,
    letterSpacing: Typography.letterSpacing.normal,
  },

  // Body Text
  bodyLarge: {
    fontSize: Typography.fontSize.bodyLarge,
    fontWeight: Typography.fontWeight.regular,
    lineHeight: Typography.fontSize.bodyLarge * Typography.lineHeight.relaxed,
    letterSpacing: Typography.letterSpacing.normal,
  },
  bodyMedium: {
    fontSize: Typography.fontSize.bodyMedium,
    fontWeight: Typography.fontWeight.regular,
    lineHeight: Typography.fontSize.bodyMedium * Typography.lineHeight.relaxed,
    letterSpacing: Typography.letterSpacing.normal,
  },
  bodySmall: {
    fontSize: Typography.fontSize.bodySmall,
    fontWeight: Typography.fontWeight.regular,
    lineHeight: Typography.fontSize.bodySmall * Typography.lineHeight.normal,
    letterSpacing: Typography.letterSpacing.normal,
  },
  bodyXSmall: {
    fontSize: Typography.fontSize.bodyXSmall,
    fontWeight: Typography.fontWeight.regular,
    lineHeight: Typography.fontSize.bodyXSmall * Typography.lineHeight.normal,
    letterSpacing: Typography.letterSpacing.normal,
  },

  // UI Elements
  button: {
    fontSize: Typography.fontSize.button,
    fontWeight: Typography.fontWeight.semiBold,
    lineHeight: Typography.fontSize.button * Typography.lineHeight.tight,
    letterSpacing: Typography.letterSpacing.wide,
  },
  buttonSmall: {
    fontSize: Typography.fontSize.buttonSmall,
    fontWeight: Typography.fontWeight.medium,
    lineHeight: Typography.fontSize.buttonSmall * Typography.lineHeight.tight,
    letterSpacing: Typography.letterSpacing.normal,
  },
  caption: {
    fontSize: Typography.fontSize.caption,
    fontWeight: Typography.fontWeight.regular,
    lineHeight: Typography.fontSize.caption * Typography.lineHeight.normal,
    letterSpacing: Typography.letterSpacing.normal,
  },
  overline: {
    fontSize: Typography.fontSize.overline,
    fontWeight: Typography.fontWeight.medium,
    lineHeight: Typography.fontSize.overline * Typography.lineHeight.normal,
    letterSpacing: Typography.letterSpacing.wider,
    textTransform: 'uppercase' as const,
  },
  label: {
    fontSize: Typography.fontSize.label,
    fontWeight: Typography.fontWeight.medium,
    lineHeight: Typography.fontSize.label * Typography.lineHeight.normal,
    letterSpacing: Typography.letterSpacing.normal,
  },

  // Scientific Names (Italic)
  scientific: {
    fontSize: Typography.fontSize.bodySmall,
    fontWeight: Typography.fontWeight.regular,
    lineHeight: Typography.fontSize.bodySmall * Typography.lineHeight.normal,
    letterSpacing: Typography.letterSpacing.normal,
    fontStyle: 'italic' as const,
  },

  // Card Titles
  cardTitle: {
    fontSize: Typography.fontSize.h5,
    fontWeight: Typography.fontWeight.semiBold,
    lineHeight: Typography.fontSize.h5 * Typography.lineHeight.tight,
    letterSpacing: Typography.letterSpacing.normal,
  },

  // Card Subtitle
  cardSubtitle: {
    fontSize: Typography.fontSize.bodySmall,
    fontWeight: Typography.fontWeight.regular,
    lineHeight: Typography.fontSize.bodySmall * Typography.lineHeight.normal,
    letterSpacing: Typography.letterSpacing.normal,
  },

  // Navigation
  navTitle: {
    fontSize: Typography.fontSize.h3,
    fontWeight: Typography.fontWeight.bold,
    lineHeight: Typography.fontSize.h3 * Typography.lineHeight.tight,
    letterSpacing: Typography.letterSpacing.normal,
  },
  navSubtitle: {
    fontSize: Typography.fontSize.bodyMedium,
    fontWeight: Typography.fontWeight.regular,
    lineHeight: Typography.fontSize.bodyMedium * Typography.lineHeight.normal,
    letterSpacing: Typography.letterSpacing.normal,
  },

  // Form Elements
  inputLabel: {
    fontSize: Typography.fontSize.label,
    fontWeight: Typography.fontWeight.medium,
    lineHeight: Typography.fontSize.label * Typography.lineHeight.normal,
    letterSpacing: Typography.letterSpacing.normal,
  },
  inputText: {
    fontSize: Typography.fontSize.bodyMedium,
    fontWeight: Typography.fontWeight.regular,
    lineHeight: Typography.fontSize.bodyMedium * Typography.lineHeight.normal,
    letterSpacing: Typography.letterSpacing.normal,
  },
  inputPlaceholder: {
    fontSize: Typography.fontSize.bodyMedium,
    fontWeight: Typography.fontWeight.regular,
    lineHeight: Typography.fontSize.bodyMedium * Typography.lineHeight.normal,
    letterSpacing: Typography.letterSpacing.normal,
  },

  // Status and Tags
  tag: {
    fontSize: Typography.fontSize.bodyXSmall,
    fontWeight: Typography.fontWeight.medium,
    lineHeight: Typography.fontSize.bodyXSmall * Typography.lineHeight.tight,
    letterSpacing: Typography.letterSpacing.normal,
  },
  badge: {
    fontSize: Typography.fontSize.bodyXSmall,
    fontWeight: Typography.fontWeight.semiBold,
    lineHeight: Typography.fontSize.bodyXSmall * Typography.lineHeight.tight,
    letterSpacing: Typography.letterSpacing.normal,
  },
};

// Color-aware text styles
export const createTextStyle = (baseStyle: any, color: string) => ({
  ...baseStyle,
  color,
});

// Responsive text scaling (for different screen sizes)
export const getResponsiveFontSize = (baseSize: number, scale: number = 1) => {
  return Math.round(baseSize * scale);
};

// Text truncation utilities
export const TextTruncation = {
  singleLine: {
    numberOfLines: 1,
    ellipsizeMode: 'tail' as const,
  },
  twoLines: {
    numberOfLines: 2,
    ellipsizeMode: 'tail' as const,
  },
  threeLines: {
    numberOfLines: 3,
    ellipsizeMode: 'tail' as const,
  },
};