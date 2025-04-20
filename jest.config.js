module.exports = {
  testMatch: [
    "**/__tests__/*.integration.test.js", // Matches your integration test files
    "**/?(*.)+(spec|test).js?(x)"            // Retains default patterns for other test files
  ],
  testPathIgnorePatterns: ["/node_modules/"], // Ignores node_modules directory
};
