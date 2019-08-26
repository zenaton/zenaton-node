const versioner = require("../Services/Versioner");
const { ExternalZenatonError } = require("../../../Errors");

let instance;

const TaskManager = class {
  constructor() {
    if (instance) {
      return instance;
    }
    instance = this;

    this.tasks = [];
  }

  add(name, task) {
    if (this.get(name) !== undefined) {
      throw new ExternalZenatonError(`"Task ${name}" can not be defined twice`);
    }

    const { canonical, version } = versioner(name);
    if (
      this.tasks.filter((t) => t.canonical === name && t.version === version)
        .length > 0
    ) {
      throw new ExternalZenatonError(
        `Task "${canonical}" can not be defined twice with same version "${version}"`,
      );
    }

    this.tasks.push({
      name,
      canonical,
      version,
      class: task,
    });
  }

  get(name) {
    // search by name
    const task = this.tasks.find((t) => t.name === name);
    if (task) return task.class;
    // search per canonical
    const ts = this.tasks.filter((t) => t.canonical === name);
    if (ts.length === 0) return undefined;
    // return last version
    return ts.reduce((acc, current) =>
      acc.version > current.version ? acc : current,
    ).class;
  }
};

module.exports = new TaskManager();
