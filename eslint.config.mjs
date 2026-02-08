import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  
  // --- ADD THIS OBJECT ---
  {
    rules: {
      // Allows using 'any' without errors (common cause of build failures)
      "@typescript-eslint/no-explicit-any": "off",
      
      // Changes unused variables from Error -> Warning (won't break build)
      "@typescript-eslint/no-unused-vars": "warn",
      
      // Allows unescaped characters like ' in JSX
      "react/no-unescaped-entities": "off", 
    },
  },
]);

export default eslintConfig;