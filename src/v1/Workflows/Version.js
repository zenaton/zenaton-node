const InvalidArgumentError = require("../../Errors/InvalidArgumentError");
const workflowManager = require("./WorkflowManager");
const AbstractWorkflow = require("./AbstractWorkflow");
const Builder = require("../Query/Builder");

module.exports = function(name, implementation) {
  // check that provided data have the right format
  if (typeof name !== "string") {
    throw new InvalidArgumentError(
      "1st parameter must be a string (workflow name)",
    );
  }
  // get versions
  let versions;
  if (Array.isArray(implementation)) {
    versions = implementation;
  } else if (typeof implementation === "object") {
    if (typeof implementation.versions === "function") {
      versions = versions.versions();
      if (!Array.isArray(versions)) {
        throw new InvalidArgumentError(
          '"versions" method should return an array',
        );
      }
    } else {
      throw new InvalidArgumentError('You must have a "versions" method');
    }
  } else {
    throw new InvalidArgumentError(
      "2nd parameter must be an array or an object",
    );
  }

  // should be at least 1
  if (versions.length === 0) {
    throw new InvalidArgumentError(
      "versions array must have at least one element",
    );
  }

  // check type
  versions.forEach((flow) => {
    if (
      typeof flow !== "function" ||
      !(flow.prototype instanceof AbstractWorkflow)
    ) {
      throw new InvalidArgumentError(
        "element of versions array should be workflow class",
      );
    }
  });

  // WARNING "VersionClass" is used in WorkflowManager.js, do not update it in isolation
  const VersionClass = class {
    constructor(...data) {
      // return instance of current class
      return new versions[versions.length - 1](...data)._setCanonical(name);
    }

    static getCurrentClass() {
      return versions[versions.length - 1];
    }

    static getInitialClass() {
      return versions[0];
    }

    static whereId(id) {
      return new Builder(name).whereId(id);
    }
  };

  // store this fonction in a singleton to be able to retrieve it later
  workflowManager.setClass(name, VersionClass);

  return VersionClass;
};
