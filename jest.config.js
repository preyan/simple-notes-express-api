export default {
  testEnvironment: 'node',
  testMatch: ['**/src/**/*.spec.js'],
  transform: {},
  collectCoverage: true,
  collectCoverageFrom: ['**/src/**/*.js'],
  coverageReporters: ['text', 'lcov'],
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
  verbose: true,
  testTimeout: 30000,
};
