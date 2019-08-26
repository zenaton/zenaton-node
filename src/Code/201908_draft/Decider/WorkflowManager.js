const versioner = require("../Services/Versioner");
const { ExternalZenatonError } = require("../../../Errors");

let instance;

const WorkflowManager = class WorkflowManager {
  constructor() {
    if (instance) {
      return instance;
    }
    instance = this;

    this.workflows = [];
  }

  add(name, workflow) {
    if (this.get(name) !== undefined) {
      throw new ExternalZenatonError(
        `Workflow "${name}" can not be defined twice`,
      );
    }

    const { canonical, version } = versioner(name);
    if (
      this.workflows.filter(
        (w) => w.canonical === name && w.version === version,
      ).length > 0
    ) {
      throw new ExternalZenatonError(
        `Workflow "${canonical}" can not be defined twice with same version "${version}"`,
      );
    }

    this.workflows.push({
      name,
      canonical,
      version,
      class: workflow,
    });
  }

  get(name) {
    // search by name
    const workflow = this.workflows.find((w) => w.name === name);
    if (workflow) return workflow.class;
    // search per canonical
    const ws = this.workflows.filter((w) => w.canonical === name);
    if (ws.length === 0) return undefined;
    // return last version
    return ws.reduce((acc, current) =>
      acc.version > current.version ? acc : current,
    ).class;
  }
};

module.exports = new WorkflowManager();
