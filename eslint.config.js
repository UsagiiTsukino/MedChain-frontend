// import js from '@eslint/js'
// import globals from 'globals'
// import react from 'eslint-plugin-react'
// import reactHooks from 'eslint-plugin-react-hooks'
// import reactRefresh from 'eslint-plugin-react-refresh'

// export default [
//   { ignores: ['dist'] },
//   {
//     files: ['**/*.{js,jsx}'],
//     languageOptions: {
//       ecmaVersion: 2020,
//       globals: globals.browser,
//       parserOptions: {
//         ecmaVersion: 'latest',
//         ecmaFeatures: { jsx: true },
//         sourceType: 'module',
//       },
//     },
//     settings: { react: { version: '18.3' } },
//     plugins: {
//       react,
//       'react-hooks': reactHooks,
//       'react-refresh': reactRefresh,
//     },
//     rules: {
//       ...js.configs.recommended.rules,
//       ...react.configs.recommended.rules,
//       ...react.configs['jsx-runtime'].rules,
//       ...reactHooks.configs.recommended.rules,
//       'react/jsx-no-target-blank': 'off',
//       'react-refresh/only-export-components': [
//         'warn',
//         { allowConstantExport: true },
//       ],
//     },
//   },
// ]


import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import importPlugin from 'eslint-plugin-import';
import jsdoc from 'eslint-plugin-jsdoc';
import prettier from 'eslint-config-prettier';

export default [
  { ignores: ['dist', 'node_modules'] }, // Bỏ qua các thư mục không cần lint
  {
    files: ['**/*.{js,jsx}'], // Áp dụng cho tất cả file .js và .jsx
    languageOptions: {
      ecmaVersion: 2022, // Sử dụng ECMAScript 2022
      globals: {
        ...globals.browser, // Sử dụng các biến global của browser
        ...globals.node, // Sử dụng các biến global của Node.js (nếu cần)
      },
      parserOptions: {
        ecmaVersion: 'latest', // Sử dụng phiên bản ECMAScript mới nhất
        ecmaFeatures: { jsx: true }, // Hỗ trợ JSX
        sourceType: 'module', // Sử dụng module ES
      },
    },
    settings: {
      react: { version: 'detect' }, // Tự động phát hiện phiên bản React
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx'], // Hỗ trợ resolve import cho .js và .jsx
        },
      },
    },
    plugins: {
      react, // Plugin React
      'react-hooks': reactHooks, // Plugin React Hooks
      'react-refresh': reactRefresh, // Plugin React Refresh
      import: importPlugin, // Plugin Import (quản lý import/export)
      jsdoc, // Plugin JSDoc (kiểm tra comment JSDoc)
    },
    rules: {
      // Các rules từ các config mặc định
      ...js.configs.recommended.rules, // ESLint recommended rules
      ...react.configs.recommended.rules, // React recommended rules
      ...react.configs['jsx-runtime'].rules, // React JSX Runtime rules
      ...reactHooks.configs.recommended.rules, // React Hooks recommended rules
      ...importPlugin.configs.recommended.rules, // Import recommended rules
      ...jsdoc.configs.recommended.rules, // JSDoc recommended rules
      ...prettier.rules, // Prettier rules (để tránh xung đột với Prettier)
      'quotes': ['error', 'single'],
      // Custom rules
      'react/jsx-no-target-blank': 'warn', // Cảnh báo khi sử dụng target="_blank" không an toàn
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ], // Cảnh báo khi export không phải là component
      'import/no-unresolved': 'error', // Báo lỗi khi import không thể resolve
      'import/no-extraneous-dependencies': 'error', // Báo lỗi khi import dependencies không cần thiết
      // 'import/order': [
      //   'error',
      //   {
      //     groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
      //     'newlines-between': 'always', // Thêm dòng trống giữa các nhóm import
      //   },
      // ], // Quy tắc sắp xếp thứ tự import
      'jsdoc/require-jsdoc': [
        'warn',
        {
          require: {
            FunctionDeclaration: true,
            MethodDefinition: true,
            ClassDeclaration: true,
          },
        },
      ], // Yêu cầu JSDoc cho các hàm, phương thức và class
      'react/prop-types': 'off', // Tắt kiểm tra prop-types (nếu sử dụng TypeScript)
      'react/self-closing-comp': 'error', // Bắt buộc sử dụng self-closing tag khi có thể
      'react/jsx-curly-brace-presence': [
        'error',
        { props: 'never', children: 'never' },
      ], // Không sử dụng dấu ngoặc nhọn không cần thiết
      'no-console': 'warn', // Cảnh báo khi sử dụng console.log
      'no-unused-vars': 'warn', // Cảnh báo khi có biến không sử dụng
      'no-undef': 'error', // Báo lỗi khi sử dụng biến chưa được định nghĩa
      'no-duplicate-imports': 'error', // Báo lỗi khi import trùng lặp
      'prefer-const': 'error', // Ưu tiên sử dụng const thay vì let
    },
  },
];
