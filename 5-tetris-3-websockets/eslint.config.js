import globals from "globals";

import path from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import pluginJs from "@eslint/js";
import babelParser from "@babel/eslint-parser";

// mimic CommonJS variables -- not needed if using CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname, recommendedConfig: pluginJs.configs.recommended });

export default [
  { languageOptions: { globals: globals.browser } },
  ...compat.extends("airbnb-base"),

  {
    rules: {
      indent: "off",
      "max-len": "off",
      "import/extensions": "off",
      "import/prefer-default-export": "off",
      "no-trailing-spaces": "off",
      "no-plusplus": "off",
      "max-classes-per-file": "off",
    },
    files: ["**/*.js", "**/*.mjs"],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          babelrc: false,
          configFile: false
        }
      }
    }
  }
];