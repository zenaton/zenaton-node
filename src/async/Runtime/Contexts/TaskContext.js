module.exports = class TaskContext {
  constructor(values = {}) {
    this.attemptIndex = values.attemptIndex || null;
    this.id = values.id || null;
  }
};
