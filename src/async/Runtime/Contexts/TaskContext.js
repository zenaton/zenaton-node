module.exports = class TaskContext {
  constructor(values = {}) {
    this.attemptIndex = values.attempt_index || null;
    this.id = values.id || null;
  }
};
