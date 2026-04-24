import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Allow unescaped quotes/apostrophes in JSX
      "react/no-unescaped-entities": "off",
      // Allow <img> elements (project uses next/image where needed)
      "@next/next/no-img-element": "off",
      // Allow <a> tags for page navigation
      "@next/next/no-html-link-for-pages": "off",
      // Allow any type
      "@typescript-eslint/no-explicit-any": "off",
      // Downgrade unused vars to warning
      "@typescript-eslint/no-unused-vars": "warn",
      // Allow let where const could be used
      "prefer-const": "off",
      // Allow exhaustive-deps warnings without failing
      "react-hooks/exhaustive-deps": "warn",
    },
  },
];

export default eslintConfig;
