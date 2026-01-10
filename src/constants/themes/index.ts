import { Theme } from "../../types";

// Editorial
import { monochrome } from "./editorial/monochrome";
import { newsprint } from "./editorial/newsprint";
import { boldTypography } from "./editorial/boldTypography";
import { academia } from "./editorial/academia";
import { luxury } from "./editorial/luxury";
import { classicSerif } from "./editorial/classicSerif";
import { botanical } from "./editorial/botanical";

// Technical
import { terminal } from "./technical/terminal";
import { cyberpunk } from "./technical/cyberpunk";
import { web3 } from "./technical/web3";
import { industrial } from "./technical/industrial";

// Modern
import { modernDark } from "./modern/modernDark";
import { saas } from "./modern/saas";
import { corporate } from "./modern/corporate";
import { neumorphism } from "./modern/neumorphism";

// Artistic
import { bauhaus } from "./artistic/bauhaus";
import { playfulGeometric } from "./artistic/playfulGeometric";
import { claymorphism } from "./artistic/claymorphism";
import { sketch } from "./artistic/sketch";
import { natural } from "./artistic/natural";
import { vaporwave } from "./artistic/vaporwave";
import { maximalist } from "./artistic/maximalist";
import { retro } from "./artistic/retro";

// Minimalist
import { swiss } from "./minimalist/swiss";
import { minimalDark } from "./minimalist/minimalDark";

export const THEMES: Theme[] = [
  // Editorial
  monochrome,
  newsprint,
  boldTypography,
  academia,
  luxury,
  classicSerif,
  botanical,

  // Technical
  terminal,
  cyberpunk,
  web3,
  industrial,

  // Modern
  modernDark,
  saas,
  corporate,
  neumorphism,

  // Artistic
  bauhaus,
  playfulGeometric,
  claymorphism,
  sketch,
  natural,
  vaporwave,
  maximalist,
  retro,

  // Minimalist
  swiss,
  minimalDark,
];

export const INITIAL_MARKDOWN = `# Welcome to Markie

Markie is a **beautiful** markdown editor that lets you create stunning documents with easing.

## Features

- **Themable**: Choose from a wide variety of professionally designed themes.
- **Exportable**: Export your documents to PNG, PDF, or copy as HTML.
- **Fast**: Built with modern web technologies for a smooth experience.

> "Design is not just what it looks like and feels like. Design is how it works."
> — Steve Jobs

### Code Example

\`\`\`javascript
const greet = (name) => {
  console.log(\`Hello, \${name}!\`);
};

greet("World");
\`\`\`

### Typography Showcase

Here is a list of items to demonstrate typography:

1. First item with some **bold text**.
2. Second item with *italic text*.
3. Third item with specific \`code snippets\`.

Enjoy writing with Markie!
`;
