import { Theme } from "../types";

interface FlattenedTheme {
  fontFamily: string;
  headingFont: string;
  monoFont: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  codeBackground: string;
  borderColor: string;
}

export function getThemeStyles(theme: Theme): FlattenedTheme {
  const t = theme.tokens;
  return {
    fontFamily: t.fontFamily.body,
    headingFont: t.fontFamily.heading,
    monoFont: t.fontFamily.mono,
    backgroundColor: t.background,
    textColor: t.foreground,
    accentColor: t.accent,
    codeBackground: t.components.code.background,
    borderColor: t.border,
  };
}
