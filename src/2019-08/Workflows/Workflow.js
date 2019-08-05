const workflowManager = require("./WorkflowManager");
const { ExternalZenatonError, InvalidArgumentError } = require("../../Errors");
const Builder = require("../Query/Builder");
const execute = require("../Execute");

const MAX_ID_SIZE = 256;

module.exports = function createWorkflowFunc(name, definition) {
  const reservedMethods = [
    "execute",
    "id",
    "parent",
    "history",
    "skip",
    "pause",
    "resume",
    "complete",
    "kill",
    "send",
  ];

  const allowedMethods = [
    "handle",
    "id",
    "onEvent",
    "onStart",
    "onSuccess",
    "onFailure",
    "onTimeout",
    "onFailureRetryDelay",
  ];

  // check that provided data have the right format
  if (typeof name !== "string") {
    throw new InvalidArgumentError(
      "When getting or creating a workflow, 1st parameter must be a string (workflow name)",
    );
  }

  // workflow getter
  if (undefined === definition) {
    return workflowManager.getClass(name);
  }

  // check definition
  if (typeof definition !== "function" && typeof definition !== "object") {
    throw new InvalidArgumentError(
      `When creating worflow "${name}", 2nd parameter (workflow implemention) must be a function or an object`,
    );
  }
  if (typeof definition === "object") {
    if (undefined === definition.handle) {
      throw new InvalidArgumentError(
        `When creating worflow "${name}", 2nd parameter (workflow definition) must have a "handle" method`,
      );
    }
    Object.keys(definition).forEach((method) => {
      if (allowedMethods.indexOf(method) < 0) {
        // reserved method
        throw new InvalidArgumentError(
          `When creating worflow "${name}", "${method}" is not an authorized method name ("${allowedMethods}")`,
        );
      }
      if (typeof definition[method] !== "function") {
        throw new InvalidArgumentError(
          `When creating worflow "${name}", "${method}" must be a function`,
        );
      }
    });
  }

  // WARNING "WorkflowClass" is used in Version.js, do not change it in isolation
  const WorkflowClass = class WorkflowClass {
    constructor(properties = {}) {
      // this in allowed methods = properties + reserved methods
      const obj = Object.assign(properties, { execute });

      // build a watcher to check that reserved methods are not overrided
      const watcher = {
        set(target, key, value) {
          if (reservedMethods.indexOf(key) >= 0) {
            throw new InvalidArgumentError(
              `In worflow "${name}", "this.${key}" is a reserved method and can not be overrided`,
            );
          }
          // eslint-disable-next-line no-param-reassign
          target[key] = value;
          return true;
        },
      };
      this.data = new Proxy(obj, watcher);

      // set and bind instance methods
      if (typeof definition === "function") {
        this.handle = definition.bind(this.data);
      } else {
        const that = this;

        Object.keys(definition).forEach((method) => {
          that[method] = definition[method].bind(that.data);
        });
      }
    }

    /**
     * set canonical name (used by Version)
     */
    _setCanonical(canonical) {
      this.canonical = canonical;

      return this;
    }

    /**
     * get canonical name
     */
    _getCanonical() {
      return this.canonical;
    }

    /**
     * get custom id
     */
    _getCustomId() {
      let customId = null;
      if (typeof this.id === "function") {
        // customId can be a value or a function
        customId = this.id();
        // customId should be a string or a number
        if (typeof customId !== "string" && typeof customId !== "number") {
          throw new InvalidArgumentError(
            `Provided id must be a string or a number - current type: ${typeof customId}`,
          );
        }
        // at the end, it's a string
        customId = customId.toString();
        // should be not more than 256 bytes;
        if (customId.length >= MAX_ID_SIZE) {
          throw new ExternalZenatonError(
            `Provided id must not exceed ${MAX_ID_SIZE} bytes`,
          );
        }
      }

      return customId;
    }

    /**
     * ORM begin
     */
    static whereId(id) {
      return new Builder(name).whereId(id);
    }
  };

  // define name of this class
  Object.defineProperty(WorkflowClass, "name", { value: name });

  // store this fonction in a singleton to retrieve it later
  workflowManager.setClass(name, WorkflowClass);

  return WorkflowClass;
};
