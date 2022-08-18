module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['build', 'chore', 'ci', 'docs', 'feat', 'fix', 'perf', 'refactor', 'revert', 'style', 'test', 'record'],
    ],
    'type-empty': [0],
    'type-case': [0],
    'scope-empty': [0],
    'header-max-length': [0, 'always', 72],
  },
}
