const dotenv = require('dotenv');
const nextJest = require('next/jest');

dotenv.config({
  path: '.env.development',
});

const createJestConfig = nextJest();
const jestConfig = createJestConfig({
  moduleDirectories: ['node_modules', '<rootDir>'],
});

module.exports = jestConfig;
