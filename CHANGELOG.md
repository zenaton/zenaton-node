# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)

## Unreleased

### Added

### Changed

### Deprecated

### Removed

### Fixed

### Security

## 0.5.4 - 2019-05-03

### Added

- Allowed to send events to workflows by instance id.

## 0.5.3 - 2019-04-30

### Fixed

- Fixed 'maxProcessingTime' parameter for single tasks.

## 0.5.2 - 2019-04-15

### Fixed

- Fixed workflow/task init logic so a 'nil' value result in an empty object for property 'data'.

## 0.5.1 - 2019-03-04

### Changed

- Update breaking changes to precise how to migrate tasks for old synchronous workflows.
- Lower entry version of NodeJS to 8.0.0.
- Enhanced `.gitignore` with full specialized NodeJS version.
- Updated CircleCI Docker image to match development NodeJS version.

## 0.5.0 - 2019-03-01

### Added

- Added this changelog.
- Added `.tool-versions` file for `asdf` with NodeJS configuration.
- Added `lint-staged` to auto-apply linter and formatter as pre-commit hook.
- Added `prettier` for code auto formatting.
- Added CircleCI configuration.
- Allow dispatch of single tasks.
- Added clearer error message when HTTP requests have an `ECONNREFUSED` error.
- Added MIT license file.

### Changed

- Updated `eslint` configuration to use `eslint-config-airbnb-base` rules.
- Updated npm packages.
- Update Zenaton engine URL to point to the new subdomain.
- Update the serializer to encode/decode from/to Zenaton format and deal with recursion.
- Split the code base into two branches: synchronous and asynchronous, to accomodate both old and new workflows.
- Refactor to make the whole code tree asynchronous.

### Fixed

- Fixed all new errors found by new configuration of `eslint`.
- Fixed code format to comply with `prettier` rules.

### Deprecated

- Deprecated `[].dispatch()` and `[].execute()` in favor of using `new Parallel().dispatch()` and `new Parallel().execute()`.
- `Workflow.execute()` is now always asynchronous and returns a `Promise`.

### Removed

- Removed some dead code in `/src/v1/Services/Serializer.js`.
- Removed obsolete file `/src/v1/Services/Properties.js`.
