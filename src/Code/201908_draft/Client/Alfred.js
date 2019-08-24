const http = require("../Services/Http");
const serializer = require("../Services/Serializer");
const { version } = require("../../../infos");
const { init, credentials } = require("../../../client");
const InternalZenatonError = require("../../../Errors/InvalidArgumentError");

const ZENATON_WORKER_URL = "http://localhost";
const DEFAULT_WORKER_PORT = 4001;
const WORKER_API_VERSION = "v_newton";

const APP_ENV = "app_env";
const APP_ID = "app_id";

const ATTR_INTENT_ID = "intent_id";
const ATTR_CUSTOM_ID = "custom_id";
const ATTR_NAME = "name";
const ATTR_CANONICAL = "canonical_name";
const ATTR_INPUT = "data";
const ATTR_PROG = "programming_language";
const ATTR_INITIAL_LIB_VERSION = "initial_library_version";
const ATTR_CODE_PATH_VERSION = "code_path_version";
const ATTR_MODE = "mode";
const ATTR_MAX_PROCESSING_TIME = "maxProcessingTime";
const ATTR_SCHEDULING_CRON = "scheduling_cron";

const PROG = "Javascript";
const INITIAL_LIB_VERSION = version;
const CODE_PATH_VERSION = process.env.ZENATON_LAST_CODE_PATH;

const EVENT_DATA = "event_input";
const EVENT_NAME = "event_name";
const EVENT_COMPLET = "event_data";

const WORKFLOW_KILL = "kill";
const WORKFLOW_PAUSE = "pause";
const WORKFLOW_RUN = "run";

const Alfred = class Alfred {
  constructor(appId, apiToken, appEnv) {
    /* This was moved in a singleton module because whatever client is used to
     * init the credentials, they need to be shared between all code paths
     * clients */
    init(appId, apiToken, appEnv);
  }

  _getWorkerUrl(ressources = "") {
    const host = process.env.ZENATON_WORKER_URL
      ? process.env.ZENATON_WORKER_URL
      : ZENATON_WORKER_URL;
    const port = process.env.ZENATON_WORKER_PORT
      ? process.env.ZENATON_WORKER_PORT
      : DEFAULT_WORKER_PORT;

    return `${host}:${port}/api/${WORKER_API_VERSION}/${ressources}`;
  }

  /**
   * Execute a task
   */
  async executeTask(job) {
    console.error(
      `Warning: local workflow processing of "${
        job.name
      }" - for development purpose only`,
    );
    switch (job.type) {
      case "task":
        // eslint-disable-next-line global-require
        return require("../Worker/TaskManager")
          .getTask(job.name)
          .handle(job.input);
      case "wait":
        return new Promise((resolve) => {
          setTimeout(resolve, job.input.duration * 1000);
        });
      default:
        break;
    }
    throw new InternalZenatonError(
      `Unexpected Job Type "${job.type}" for "${job.name}"`,
    );
  }

  /**
   * Dispatch a task
   */
  async dispatchTask(job) {
    const url = this._getWorkerUrl("tasks");
    const body = this._getBodyForTask(job);
    const params = this._getAppEnv();
    return http.post(url, body, { params });
  }

  /**
   * Schedule a task
   */
  async scheduleTask(job) {
    const url = this._getWorkerUrl("scheduling/tasks");
    const body = this._getBodyForTask(job);
    const params = Object.assign(
      {
        [ATTR_SCHEDULING_CRON]: job.scheduling.cron,
      },
      this._getAppEnv(),
    );
    return http.post(url, body, { params });
  }

  /**
   * Dispatch a workflow
   */
  async dispatchWorkflow(job) {
    const url = this._getWorkerUrl("instances");
    const body = this._getBodyForWorkflow(job);
    const params = this._getAppEnv();
    return http.post(url, body, { params });
  }

  /**
   * Schedule a workflow
   */
  async scheduleWorkflow(job) {
    const url = this._getWorkerUrl("scheduling/instances");
    const body = this._getBodyForWorkflow(job);
    const params = Object.assign(
      {
        [ATTR_SCHEDULING_CRON]: job.scheduling.cron,
      },
      this._getAppEnv(),
    );
    return http.post(url, body, { params });
  }

  /**
   * Kill a workflow instance
   */
  async killWorkflow(query) {
    return this._updateInstance(query, WORKFLOW_KILL);
  }

  /**
   * Pause a workflow instance
   */
  async pauseWorkflow(query) {
    return this._updateInstance(query, WORKFLOW_PAUSE);
  }

  /**
   * Resume a workflow instance
   */
  async resumeWorkflow(query) {
    return this._updateInstance(query, WORKFLOW_RUN);
  }

  /**
   * Send an event to a workflow instance
   */
  async sendEvent(query, eventName, eventData) {
    const url = this._getWorkerUrl("events");
    const body = {
      [ATTR_INTENT_ID]: query.intentId,
      [ATTR_PROG]: PROG,
      [ATTR_INITIAL_LIB_VERSION]: INITIAL_LIB_VERSION,
      [ATTR_CODE_PATH_VERSION]: CODE_PATH_VERSION,
      [ATTR_NAME]: query.name,
      [ATTR_CUSTOM_ID]: query.customId,
      [EVENT_NAME]: eventName,
      [EVENT_DATA]: serializer.encode(eventData),
      [EVENT_COMPLET]: serializer.encode({
        name: eventName,
        data: eventData,
      }),
    };
    const params = this._getAppEnv();
    return http.post(url, body, { params });
  }

  async _updateInstance(query, mode) {
    const url = this._getWorkerUrl("instances");
    const body = {
      [ATTR_INTENT_ID]: query.intentId,
      [ATTR_PROG]: PROG,
      [ATTR_INITIAL_LIB_VERSION]: INITIAL_LIB_VERSION,
      [ATTR_CODE_PATH_VERSION]: CODE_PATH_VERSION,
      [ATTR_NAME]: query.name,
      [ATTR_MODE]: mode,
    };
    const params = Object.assign(
      {
        [ATTR_CUSTOM_ID]: query.customId,
      },
      this._getAppEnv(),
    );
    return http.put(url, body, { params });
  }

  _getBodyForTask(job) {
    return {
      [ATTR_INTENT_ID]: job.intentId,
      [ATTR_PROG]: PROG,
      [ATTR_INITIAL_LIB_VERSION]: INITIAL_LIB_VERSION,
      [ATTR_CODE_PATH_VERSION]: CODE_PATH_VERSION,
      [ATTR_NAME]: job.name,
      [ATTR_INPUT]: serializer.encode(job.input),
      // TODO : maxProcessingTime should be managed from Agent
      [ATTR_MAX_PROCESSING_TIME]: null,
      // typeof options.maxProcessingTime === "function"
      //   ? options.maxProcessingTime()
      //   : null,
    };
  }

  _getBodyForWorkflow(job) {
    return {
      [ATTR_INTENT_ID]: job.intentId,
      [ATTR_PROG]: PROG,
      [ATTR_INITIAL_LIB_VERSION]: INITIAL_LIB_VERSION,
      [ATTR_CODE_PATH_VERSION]: CODE_PATH_VERSION,
      [ATTR_CANONICAL]: job.canonical,
      [ATTR_NAME]: job.name,
      [ATTR_INPUT]: serializer.encode(job.input),
      [ATTR_CUSTOM_ID]: job.customId,
    };
  }

  _getAppEnv() {
    // when called from worker, APP_ENV and APP_ID is not defined
    const params = {};

    if (credentials.appEnv) {
      params[APP_ENV] = credentials.appEnv;
    }

    if (credentials.appId) {
      params[APP_ID] = credentials.appId;
    }

    return params;
  }
};

module.exports = Alfred;
