import type { Config } from "@jest/types";
// Sync object
const config: Config.InitialOptions = {
  verbose: true,
  transform: {
    "^.+\\.ts?$": "ts-jest"
  },
  roots: ["./src/__tests__"],
  testPathIgnorePatterns: ["./src/__tests__/tests_setup.ts"],
  coveragePathIgnorePatterns: ["./src/__tests__/tests_setup.ts"]
};
export default config;
