import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { globalIgnores } from 'eslint/config'

export default [
  // Ignore build output
  globalIgnores(['dist']),

  // Base JS rules
  js.configs.recommended,

  // React Hooks (native flat config – safe)
  reactHooks.configs.flat.recommended,

  // Project rules
  {
    files: ['**/*.{js,jsx}'],
    plugins: {
      'react-refresh': reactRefresh,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
    },
    rules: {
      // React Refresh rule (what vite config actually enables)
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // Your existing rule
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
]
