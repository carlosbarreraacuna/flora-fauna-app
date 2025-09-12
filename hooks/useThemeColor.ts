/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '../constants/Colors';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName?: string
) {
  const theme = 'light'; // Default to light theme
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    // Return a default color from our color system
    return Colors.text.primary;
  }
}
