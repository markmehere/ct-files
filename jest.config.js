/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  roots: ["<rootDir>/src"],
  testEnvironment: "node",
  modulePathIgnorePatterns: ["/dist/"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  transform: {
    "^.+\.tsx?$": ["ts-jest",{}],
  },
};
