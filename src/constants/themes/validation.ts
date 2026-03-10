import { Theme, ThemeTokens } from "./schema";
import { DEFAULT_TOKENS } from "./defaults";

export function validateTheme(theme: any): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!theme.id) errors.push("Missing id");
  if (!theme.name) errors.push("Missing name");
  if (!theme.description) errors.push("Missing description");
  if (!theme.category) errors.push("Missing category");
  if (typeof theme.isDark !== "boolean")
    errors.push("Missing or invalid isDark flag");
  if (!theme.tokens) {
    errors.push("Missing tokens object");
    return { valid: false, errors };
  }

  // Recursive token validation could go here, but for now we'll check top-level token categories
  const tokenCategories: (keyof ThemeTokens)[] = [
    "background",
    "foreground",
    "primary",
    "secondary",
    "accent",
    "muted",
    "border",
    "fontFamily",
    "fontSize",
    "fontWeight",
    "lineHeight",
    "letterSpacing",
    "spacing",
    "borderRadius",
    "borderWidth",
    "shadow",
    "motion",
    "components",
  ];

  tokenCategories.forEach((category) => {
    if (theme.tokens[category] === undefined) {
      errors.push(`Missing token category: ${category}`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function createTheme(params: {
  id: string;
  name: string;
  description: string;
  category: Theme["category"];
  isDark: boolean;
  tokens: Partial<ThemeTokens>;
}): Theme {
  const { id, name, description, category, isDark, tokens } = params;

  // Merge provided tokens with defaults
  return {
    id,
    name,
    description,
    category,
    isDark,
    tokens: deepMerge(DEFAULT_TOKENS, tokens),
  };
}

function deepMerge(target: any, source: any): any {
  if (typeof target !== "object" || target === null) return source;
  if (typeof source !== "object" || source === null) return source;

  const output: Record<string, any> = Array.isArray(target) ? [] : {};

  // Keys from both
  const keys = new Set([...Object.keys(target), ...Object.keys(source)]);

  for (const key of keys) {
    if (key in source && key in target) {
      // Both have it, recurse or overwrite
      if (
        typeof source[key] === "object" &&
        source[key] !== null &&
        typeof target[key] === "object" &&
        target[key] !== null
      ) {
        output[key] = deepMerge(target[key], source[key]);
      } else {
        output[key] = source[key];
      }
    } else if (key in source) {
      output[key] = source[key];
    } else {
      output[key] = target[key];
    }
  }

  return output;
}
