const { GraphQLClient } = require("graphql-request");
const { version } = require("../../../infos");
const {
  ExternalZenatonError,
  InternalZenatonError,
  ZenatonError,
} = require("../../../Errors");
const { http, serializer } = require("../Services");

const ZENATON_WORKER_URL = "http://localhost";
const DEFAULT_WORKER_PORT = 4001;
const WORKER_API_VERSION = "v_newton";

const ZENATON_GATEWAY_URL = "https://gateway.zenaton.com/api";

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
  constructor(client) {
    this.client = client;
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

  _getGatewayUrl() {
    const host = process.env.ZENATON_GATEWAY_URL
      ? process.env.ZENATON_GATEWAY_URL
      : ZENATON_GATEWAY_URL;

    return host;
  }

  async _request(endpoint, query, variables) {
    try {
      const graphQLClient = new GraphQLClient(endpoint, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "app-id": this.client.appId,
          "api-token": this.client.apiToken,
        },
      });

      return graphQLClient.request(query, variables);
    } catch (err) {
      throw getError(err);
    }
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
    const endpoint = this._getGatewayUrl();
    const body = this._getBodyForTask(job);
    const mutation = mutations.createTaskSchedule;
    const variables = {
      createTaskScheduleInput: {
        intentId: body[ATTR_INTENT_ID],
        environmentName: this.client.appEnv,
        cron: job.scheduling.cron,
        taskName: body[ATTR_NAME],
        programmingLanguage: body[ATTR_PROG].toUpperCase(),
        properties: body[ATTR_INPUT],
        codePathVersion: body[ATTR_CODE_PATH_VERSION],
        initialLibraryVersion: body[ATTR_INITIAL_LIB_VERSION],
      },
    };

    const res = await this._request(endpoint, mutation, variables);
    return res.createTaskSchedule;
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
    const endpoint = this._getGatewayUrl();
    const body = this._getBodyForWorkflow(job);
    const mutation = mutations.createWorkflowSchedule;
    const variables = {
      createWorkflowScheduleInput: {
        intentId: body[ATTR_INTENT_ID],
        environmentName: this.client.appEnv,
        cron: job.scheduling.cron,
        workflowName: body[ATTR_NAME],
        canonicalName: body[ATTR_CANONICAL],
        programmingLanguage: body[ATTR_PROG].toUpperCase(),
        properties: body[ATTR_INPUT],
        codePathVersion: body[ATTR_CODE_PATH_VERSION],
        initialLibraryVersion: body[ATTR_INITIAL_LIB_VERSION],
      },
    };

    const res = await this._request(endpoint, mutation, variables);
    return res.createWorkflowSchedule;
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

    if (this.client && this.client.appEnv) {
      params[APP_ENV] = this.client.appEnv;
    }

    if (this.client && this.client.appId) {
      params[APP_ID] = this.client.appId;
    }

    return params;
  }
};

function getError(err) {
  // Validation errors
  if (err.response && err.response.errors && err.response.errors.length > 0) {
    const message = err.response.errors
      .map((graphqlError) => {
        const path = graphqlError.path ? `(${graphqlError.path}) ` : "";
        const errorMessage = graphqlError.message || "Unknown error";
        return `${path}${errorMessage}`;
      })
      .join("\n");
    return new ExternalZenatonError(message);
  }

  // Internal Server Error
  if (err.response && err.response.status >= 500) {
    return new InternalZenatonError(
      `Please contact Zenaton support - ${err.message}`,
    );
  }

  return new ZenatonError(err.message);
}

const mutations = {
  createWorkflowSchedule: `
    mutation ($createWorkflowScheduleInput: CreateWorkflowScheduleInput!) {
      createWorkflowSchedule(input: $createWorkflowScheduleInput) {
        schedule {
          id
          name
          cron
          insertedAt
          updatedAt
          target {
            ... on WorkflowTarget {
              name
              type
              canonicalName
              programmingLanguage
              properties
              codePathVersion
              initialLibraryVersion
            }
          }
        }
      }
    }`,
  createTaskSchedule: `
    mutation ($createTaskScheduleInput: CreateTaskScheduleInput!) {
      createTaskSchedule(input: $createTaskScheduleInput) {
        schedule {
          id
          name
          cron
          insertedAt
          updatedAt
          target {
            ... on TaskTarget {
              name
              type
              programmingLanguage
              properties
              codePathVersion
              initialLibraryVersion
            }
          }
        }
      }
    }`,
};

module.exports = Alfred;
