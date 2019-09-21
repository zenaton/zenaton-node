const { ExternalZenatonError } = require("../../../Errors");

const Execute = class Execute {
  constructor(processor, service, serviceId) {
    this._processor = processor;
    this._service = service;
    this._serviceId = serviceId;
  }

  async task(...tasks) {
    if (!this._processor.executeTask) {
      throw new ExternalZenatonError(
        `Sorry, you can not use "execute.task" syntax from here`,
      );
    }
    if (Array.isArray(tasks[0])) {
      // check parallel task syntax
      tasks.map((task, index) => {
        if (!Array.isArray(task)) {
          throw new ExternalZenatonError(
            `When using parallel syntax for "execute.task", all element must be an array [name, ...input] (check #${1 +
              index})`,
          );
        }
        return this._checkTaskSyntax(index, ...task);
      });
      // process parallel tasks
      return this._processor.executeTasks(this._getTasks(...tasks));
    }
    // check single task syntax
    this._checkTaskSyntax(null, ...tasks);
    // process single task
    return this._processor.executeTask(this._getTask(...tasks));
  }

  /*
   * Returns [ {name: string , input: array}, ...]
   */
  _getTasks(...tasks) {
    return tasks.map((task) => this._getTask(...task));
  }

  /*
   * Returns {name: string , input: array}
   */
  _getTask(...task) {
    const [name, ...input] = task;
    return { name, input };
  }

  // eslint-disable-next-line no-unused-vars
  _checkTaskSyntax(index, name, ...input) {
    if (typeof name !== "string") {
      if (Number.isInteger(index)) {
        throw new ExternalZenatonError(
          `For task #${index} in "execute.task", first parameter must be a string (task name), not a "${typeof name}"`,
        );
      }
      throw new ExternalZenatonError(
        `First parameter of task in "execute.task" must be a string (task name), not a "${typeof name}"`,
      );
    }
  }

  async post(url, body, header) {
    return this._http("post", url, body, header);
  }

  async get(url, body, header) {
    return this._http("get", url, body, header);
  }

  async put(url, body, header) {
    return this._http("put", url, body, header);
  }

  async patch(url, body, header) {
    return this._http("patch", url, body, header);
  }

  async delete(url, body, header) {
    return this._http("delete", url, body, header);
  }

  async _http(verb, url, body, header) {
    if (!this._processor.executeTask) {
      throw new ExternalZenatonError(
        `Sorry, you can not use "dispatch.${verb}" syntax from here`,
      );
    }
    return this._processor.executeTask(
      this._getHttpJob(verb, url, body, header),
    );
  }

  _getHttpJob(verb, url, body, header) {
    const name = this._service ? `${this._service}:${verb}` : `Http:${verb}`;
    const input = { url, body, header };
    if (this._service) {
      input.service = this._service;
      input.serviceId = this._serviceId;
    }
    return {
      name,
      input: [input],
      options: this._options,
      customId: this._customId,
    };
  }
};

module.exports = Execute;
