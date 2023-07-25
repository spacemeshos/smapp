/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  runner: '@jest-runner/electron/main',
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(spec|test).ts'],
  verbose: true,
};
