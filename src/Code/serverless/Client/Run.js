const { ExternalZenatonError } = require("../../../Errors");

const MAX_ID_SIZE = 256;

const Run = class Run {
  constructor(processor) {
    this._processor = processor;
  }

  withTag(tag) {
    if (typeof tag !== "string" && !Number.isInteger(tag)) {
      throw new ExternalZenatonError(
        `Parameter of "run.withTag" must be a string or an integer - not a "${typeof tag}"`,
      );
    }
    if (tag.toString().length >= MAX_ID_SIZE) {
      throw new ExternalZenatonError(
        `Parameter of "run.withTag" must not exceed ${MAX_ID_SIZE} bytes`,
      );
    }
    this._customId = tag.toString();

    return this;
  }

  withOptions(options = {}) {
    if (typeof options !== "object") {
      throw new ExternalZenatonError(
        `Parameter of "run.withOptions" must be an object - not a "${typeof id}"`,
      );
    }
    this._options = options;

    return this;
  }

  task(...tasks) {
    if (Array.isArray(tasks[0])) {
      if (!this._processor.runTasks) {
        throw new ExternalZenatonError(
          `Sorry, you can not use "run.task" with parallel syntax from here`,
        );
      }
      // check parallel task syntax
      tasks.map((task, index) => {
        if (!Array.isArray(task)) {
          throw new ExternalZenatonError(
            `When using parallel syntax for "run.task", all element must be an array [name, ...input] (check #${1 +
              index})`,
          );
        }
        return this._checkTaskSyntax(index, ...task);
      });
    } else {
      if (!this._processor.runTask) {
        throw new ExternalZenatonError(
          `Sorry, you can not use "run.task" from here`,
        );
      }
      // check single task syntax
      this._checkTaskSyntax(null, ...tasks);
    }

    // process parallel tasks
    if (Array.isArray(tasks[0])) {
      return this._processor.runTasks(this._getJobs(...tasks));
    }
    // process single task
    return this._processor.runTask(this._getJob(...tasks));
  }

  workflow(name, ...input) {
    if (!this._processor.runWorkflow) {
      throw new ExternalZenatonError(
        `Sorry, you can not use "run.workflow" syntax from here`,
      );
    }
    if (typeof name !== "string") {
      throw new ExternalZenatonError(
        `First parameter of Parameter "run.workflow" should be a string, not a "${typeof name}"`,
      );
    }
    if (name.length === 0) {
      throw new ExternalZenatonError(
        `First parameter of Parameter "run.workflow" should be a non-empty string`,
      );
    }
    return this._processor.runWorkflow(this._getJob(name, ...input));
  }

  /*
   * Returns [ {name: string , input: array}, ...]
   */
  _getJobs(...jobs) {
    return jobs.map((job) => this._getJob(...job));
  }

  /*
   * Returns {name: string , input: array, options, customId}
   */
  _getJob(...job) {
    const [name, ...input] = job;
    return {
      name,
      input,
      options: this._options,
      customId: this._customId,
    };
  }

  _checkTaskSyntax(index, name) {
    if (typeof name !== "string") {
      if (Number.isInteger(index)) {
        throw new ExternalZenatonError(
          `For task #${index} in "run.task", first parameter must be a string (task name), not a "${typeof name}"`,
        );
      }
      throw new ExternalZenatonError(
        `First parameter of task in "run.task" must be a string (task name), not a "${typeof name}"`,
      );
    }
  }
};

module.exports = Run;
