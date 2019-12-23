module.exports = {
  "transform": {
    "^.+\\.[t|j]sx?$": "babel-jest"
  },
  globals: {
    "ts-jest": {
      useBabelrc: true,
    }
  },
  testURL: 'http://localhost/',
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  setupFilesAfterEnv: ["<rootDir>/setupTests.js"],
  "moduleFileExtensions": ["js", "jsx"],
  "moduleNameMapper": {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.js",
    "\\.(css|less)$": "<rootDir>/__mocks__/styleMock.js"
  }
}
