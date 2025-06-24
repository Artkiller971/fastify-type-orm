import { createJsWithTsEsmPreset, type JestConfigWithTsJest } from 'ts-jest'

const presetConfig = createJsWithTsEsmPreset({
  tsconfig: 'tsconfig.json'
})

const jestConfig: JestConfigWithTsJest = {
  ...presetConfig,
  modulePathIgnorePatterns: [
      "<rootDir>/__tests__/helpers/"
    ],
}

export default jestConfig