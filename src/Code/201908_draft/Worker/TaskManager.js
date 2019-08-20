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

  check(name) {
    const TaskClass = this.getClass(name);
    if (TaskClass === null) {
      throw new ExternalZenatonError(
        `Unknown task "${name}", please add it to your --boot file`,
      );
    }
    return TaskClass;
  }

  setClass(name, task) {
    if (this.getClass(name) !== null) {
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

  getClass(name) {
    let ts;
    // search by name
    ts = this.tasks.filter((t) => t.name === name);
    if (ts.length > 0) return ts[0].class;
    // search per canonical
    ts = this.tasks.filter((t) => t.canonical === name);
    if (ts.length === 0) return null;
    // return last version
    return ts.reduce((acc, current) =>
      acc.version > current.version ? acc : current,
    ).class;
  }

  getTask(name) {
    const TaskClass = this.check(name);
    return new TaskClass();
  }
};

module.exports = new TaskManager();
