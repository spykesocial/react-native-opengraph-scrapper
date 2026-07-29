# Change Log

## 1.2.1
- Fixed Dependabot / yarn audit vulnerabilities across transitive dependencies
- Updated dependencies to latest compatible versions (mocha 11, sinon 22, c8 12, react-native 0.86, cheerio, chardet)
- Migrated to ESLint 10 flat config and typescript-eslint
- Added TypeScript 7 side-by-side with TypeScript 6 for eslint compatibility
- Upgraded chai to 6 and aligned test assertions
- Bundled CJS build to fix require() interop under `"type": "module"`
- Removed unused nyc dependency

## 1.2.0
- Migrated HTTP requests from ky-universal to native fetch for React Native compatibility
- Updated dependencies (chardet, cheerio, iconv-lite, validator)
- Added React Native 0.85 compatibility smoke tests
- Raised minimum Node.js version to 18
- Removed Snyk prepare hook that blocked installs without authentication

## 1.1.3
- Package maintenance release

## 1.1.1
- Fixing issues with ky import

## 1.1.0
- Setting up the openGraphScraperLite repo

## 1.0.0
- First version of openGraphScraperLite!