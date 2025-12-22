export const ADJECTIVES = [
  "Fluffy",
  "Bouncy",
  "Sparkly",
  "Cosmic",
  "Happy",
  "Sleepy",
  "Lazy",
  "Sunny",
  "Dreamy",
  "Velvet",
  "Gentle",
  "Magic",
  "Misty",
  "Frosty",
  "Golden",
  "Silver",
  "Crystal",
  "Cotton",
  "Quiet",
  "Breezy",
];

export const NOUNS = [
  "Panda",
  "Unicorn",
  "Cloud",
  "Star",
  "Bubble",
  "Marshmallow",
  "Cookie",
  "Kitten",
  "Puppy",
  "Moon",
  "Galaxy",
  "Garden",
  "Meadow",
  "Forest",
  "River",
  "Ocean",
  "Mountain",
  "Valley",
  "Sunset",
  "Sunrise",
  "Dream",
  "Wish",
  "Spark",
  "Glow",
  "Bloom",
];

export function generateCuteName(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  return `${adj} ${noun}`;
}
