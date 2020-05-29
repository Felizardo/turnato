module.exports = {
  rootDir: 'src/',
  roots: ['<rootDir>/../tests', '<rootDir>/components', '<rootDir>/games', '<rootDir>/misc'],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  setupFilesAfterEnv: ['../jest.setup.ts'],
  transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(sass|scss|png|jpg|mp3|md).*$': '<rootDir>/../tests/__mocks__/emptyModule.js',
    '\\.(css|less)$': 'identity-obj-proxy',
  },
  coverageReporters: ['json', 'lcov', 'text', 'text-summary'],
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
  collectCoverageFrom: ['**', '!games/chess/stockfish8.worker.js', '!ui/**', '!.storybook/**', '!**/*.stories.tsx'],
  coverageReporters: ['json', 'lcov'],
  coverageDirectory: '../coverage-unit',
  modulePaths: ['<rootDir>'],
};
