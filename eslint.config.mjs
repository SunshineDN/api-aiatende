import globals from "globals";
import pluginJs from "@eslint/js";
import plugin from '@stylistic/eslint-plugin-js';

export default [
  {
    plugins: {
      '@stylistic/js': plugin,
    },
    rules: {
      '@stylistic/js/semi': ['error', 'always'],
      '@stylistic/js/quotes': ['error', 'single'],
      '@stylistic/js/eol-last': ['error', 'always'],
      '@stylistic/js/indent': ['error', 2],
    },
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs"
    }
  },
  {
    languageOptions: {
      globals: globals.node
    }
  },
  pluginJs.configs.recommended,
  {
    "overrides": [
      {
        "files": ["tests/**/*"],
        "env": {
          "jest": true
        }
      }
    ]
  }
];