import type { Config } from "jest";

const config: Config = {
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  transformIgnorePatterns: ["/node_modules/"],
  clearMocks: true,
  coverageProvider: "v8",
  collectCoverageFrom: [
    "<rootDir>/src/lib/**/*.ts",
    "<rootDir>/src/server/**/*.ts",
  ],
  coveragePathIgnorePatterns: ["/node_modules/", "/src/lib/blockinfo.ts"],
  setupFiles: ["dotenv/config"],
};

export default config;
