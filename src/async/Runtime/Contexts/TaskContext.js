module.exports = class TaskContext {
  constructor(values = {}) {
    this.retryIndex = values.retryIndex || null;
    this.id = values.id || null;
  }
};
