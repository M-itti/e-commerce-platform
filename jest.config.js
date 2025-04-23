module.exports = {
  testMatch: [
    "**/__tests__/*.integration.test.js", 
    "**/?(*.)+(spec|test).js?(x)"            
  ],
  testPathIgnorePatterns: ["/node_modules/"], 
  testTimeout: 10001, 
};
