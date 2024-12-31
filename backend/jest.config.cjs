module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  testMatch: [
    '**/__tests__/**/*.?(m)js',
    '**/?(*.)+(spec|test).?(m)js'
  ],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/index.js',
    '!src/config/*.js'
  ],
  coverageDirectory: 'coverage',
  verbose: true,
  testTimeout: 10000,
  moduleFileExtensions: ['js', 'mjs', 'cjs', 'jsx', 'json'],
  setupFilesAfterEnv: ['./tests/setup.js']
};
