module.exports = {
  extends: ['react-app', 'react-app/jest'],
  parserOptions: {
    sourceType: 'module',
    babelOptions: {
      presets: [
        ['babel-preset-react-app', false],
        'babel-preset-react-app/prod',
      ],
    },
  },
  rules: {
    'no-unused-vars': 'off',
    'import/no-anonymous-default-export': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    'no-loop-func': 'off',
  },
};
