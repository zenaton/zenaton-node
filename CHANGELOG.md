# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)

## Unreleased

### Changed

- Change the ZENATON `LAST_CODE_PATH` to `serverless`.
- Allow the selection of workflows without a name.

### Fixed

- Fixed selector query input.

## 0.7.3 - 2020-01-13

### Added

- Return an exception when the user gives a non standard Zenaton connector ID.
- Added the ability to use `this.log(obj)`, `this.random()`, `this.date()` in a workflow.
- Introduced `getFirstFromCanonical` and `getLastFromCanonical` function in WorkflowManager

### Changed

- Require the `ZENATON_CODE_PATH` dynamically depending the `ZENATON_LAST_CODE_PATH`.
- Updated Versioner in `yield` and `serverless` code path to return also the original name
- Update behavior of `get` function in WorkflowManager
- Changed the decode method to accept `JSON` of the `yield` Serializer.

## 0.7.2 - 2019-10-23

### Added

- Added auto publish to npm when creating a GitHub release.
- Added `serverless` code_path.

### Fixed

- Fixed the `schedule` function that returned an useless Promise.

## 0.7.1 - 2019-10-02

### Added

### Changed

### Deprecated

### Removed

### Fixed

- Add customId for scheduled workflow in new syntax

### Security

## 0.7.0 - 2019-09-28

### Added

- Major overhaul of the library: use of generators and new syntax
- Added `custom_id` argument for workflow schedule.
- Tasks and workflows scheduling in new syntax.
- Added an `input` key for dispatch workflow and schedule workflow.

### Changed

- Default timezone with new syntax is now UTC.
- Time/Duration methods don't have anymore `1` as default value.
- Time/Duration methods can't be stacked, works now like mutators.
- Better uses of capitalize convention: initial caps limited to constructors
- Changed `data` value for dispatch workflow and schedule workflow to empty object.
- Replace `kill` per `terminate``

### Deprecated

### Removed

- Use of Array as parralel
- Parallel methods

### Fixed

### Security

## 0.6.4 - 2019-09-03

### Added

- Adding a prepublish hook for lint, test and build

### Changed

- Upgrade of all dependencies to major version

### Security

- Update the version of set-value package
- Update the version of mixin-deep package

## 0.6.3 - 2019-08-28

### Security

- Update the version of eslint-utils

## 0.6.0 - 2019-08-26

### Added

- Added a `intent_id` property when dispatching workflows and tasks, sending events to workflows, and
  pausing/resuming/killing workflows.
- Added `context` setter and getter in `Task` and `Workflow` abstract class that is able to retrieve the runtime context
  of the workflow or task currently being executed.

### Changed

- Changed scheduling requests that pass now through Alfred (GraphQL API).
- Changed scheduling syntax from `x.repeat("* * * * *").schedule()` to `x.shedule("* * * * *")`.
- Remove scheduling output.

## 0.5.7 - 2019-06-21

### Added

- Prepare capacity to schedule workflows and single tasks (CRON based).

### Fixed

- Update dependencies to fix security issues with package `js-yaml`.
- Fix #41 Modification of Wait's parameters during a workflow execution does not trigger a ModifiedDecisionException
- Fix #45 Wait months method issue

## 0.5.6 - 2019-06-03

### Added

- Added `event_data` property when sending event.

## 0.5.5 - 2019-05-22

### Changed

- Serializer ignores functions when serializing plain JSON object literals to align with the behavior of `JSON.stringify` and fix a bug.

### Fixed

- Fixed false positive error message related to functions serialization when adding private functions to tasks and workflows.

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
