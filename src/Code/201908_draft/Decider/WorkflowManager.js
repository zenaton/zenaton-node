const serializer = require("../Services/Serializer");
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

  set processor(processor) {
    this.workflows.forEach((workflow) => {
      // eslint-disable-next-line no-param-reassign
      workflow.class.processor = processor;
    });
  }

  check(name) {
    const WorkflowClass = this.getClass(name);
    if (WorkflowClass === null) {
      throw new ExternalZenatonError(
        `Unknown workflow "${name}", please add it to your --boot file`,
      );
    }
    return WorkflowClass;
  }

  setClass(name, workflow) {
    if (this.getClass(name) !== null) {
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

  getClass(name) {
    let ws;
    // search by name
    ws = this.workflows.filter((w) => w.name === name);
    if (ws.length > 0) return ws[0].class;
    // search per canonical
    ws = this.workflows.filter((w) => w.canonical === name);
    if (ws.length === 0) return null;
    // return last version
    return ws.reduce((acc, current) =>
      acc.version > current.version ? acc : current,
    ).class;
  }

  getWorkflow(name, encodedProperties = null) {
    // unserialize properties
    const properties =
      encodedProperties === null ? {} : serializer.decode(encodedProperties);
    // get workflow class
    const WorkflowClass = this.check(name);
    // return instance with properties
    const w = new WorkflowClass();
    w._properties = properties;
    return w;
  }
};

module.exports = new WorkflowManager();
