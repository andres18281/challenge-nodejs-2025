import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },

  // ⬇️ Coverage
  collectCoverage: true,
  coverageDirectory: '../coverage',
  
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/config/',
    '/common/filters/',
    '\\.module\\.ts$',
    '\\.entity\\.ts$',
    'main\\.ts$',
    'app\\.controller\\.ts$',
    'app\\.module\\.ts$',
    '\\.dto\\.ts$',
    '\\.repository\\.ts$',
  ],

  collectCoverageFrom: [
    '**/*.(t|j)s',
    '!**/*.module.ts',
    '!**/*.entity.ts',
    '!main.ts',
    '!**/config/**',
    '!**/common/filters/**',
  ],
};

export default config;