const pluginSortImports = require('@trivago/prettier-plugin-sort-imports');


module.exports = {
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 100,
  proseWrap: 'never',
  endOfLine: 'auto',
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  bracketSpacing: true,
  arrowParens: 'always',
  requirePragma: false,
  insertPragma: false,

  plugins: [pluginSortImports],
  importOrder: ['^[^\\.]', '^\\.'],

  importOrderSeparation: true,
  importOrderParserPlugins: ['typescript', 'decorators-legacy', 'jsx'],
};
