module.exports = class Instance {
  constructor(values = {}) {
    this.id = values.id || null;
    this.appId = values.appId || null;
    this.appEnv = values.appEnv || null;
  }
};
