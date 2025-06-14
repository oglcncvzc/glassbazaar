import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const eslintConfig = [
  {
    ignores: ["node_modules/**", ".next/**"],
    rules: {
      // Tüm kuralları kapat
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@next/next/no-img-element": "off",
      "react/jsx-key": "off",
      "prefer-const": "off",
      "react-hooks/rules-of-hooks": "off",
    },
  },
];

export default eslintConfig;
