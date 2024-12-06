module.exports = {
  bracketSpacing: true,
  jsxBracketSameLine: false,
  printWidth: 120,
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
  useTabs: false,
  overrides: [
    {
      files: '*.babelrc',
      options: {
        parser: 'json',
      },
    },
  ],
};
