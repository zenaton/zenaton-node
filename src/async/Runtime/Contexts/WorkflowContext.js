module.exports = class WorkflowContext {
  constructor(values = {}) {
    this.id = values.id || null;
  }
};
