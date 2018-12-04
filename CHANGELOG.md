# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)

## Unreleased

### Added

- Added this changelog.
- Added `.tool-versions` file for `asdf` with NodeJS configuration.
- Added `lint-staged` to auto-apply linter and formatter as pre-commit hook.
- Added `prettier` for code auto formatting.
- Added CircleCI configuration.
- Allow dispatch of single tasks.

### Changed

- Updated `eslint` configuration to use `eslint-config-airbnb-base` rules.
- Updated npm packages.

### Fixed

- Fixed all new errors found by new configuration of `eslint`.
- Fixed code format to comply with `prettier` rules.

### Deprecated

### Removed

- Removed some dead code in `/src/v1/Services/Serializer.js`.
- Removed obsolete file `/src/v1/Services/Properties.js`.

### Security
