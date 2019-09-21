const uuidv4 = require("uuid/v4");
const { GraphQLClient } = require("graphql-request");
const { version: libVersion } = require("../../../infos");
const { serializer, versioner } = require("../Services");
const {
  ExternalZenatonError,
  InternalZenatonError,
  ZenatonError,
} = require("../../../Errors");

const ZENATON_GATEWAY_URL = "https://gateway.zenaton.com/api";

const APP_ENV = "app_env";
const APP_ID = "app_id";

const ATTR_INTENT_ID = "intent_id";
const ATTR_CUSTOM_ID = "custom_id";
const ATTR_NAME = "name";
const ATTR_CANONICAL = "canonical_name";
const ATTR_VERSION = "version";
const ATTR_INPUT = "data";
const ATTR_PROG = "programming_language";
const ATTR_INITIAL_LIB_VERSION = "initial_library_version";
const ATTR_CODE_PATH_VERSION = "code_path_version";
const ATTR_MAX_PROCESSING_TIME = "maxProcessingTime";

const PROG = "Javascript";
const INITIAL_LIB_VERSION = libVersion;
const CODE_PATH_VERSION = process.env.ZENATON_LAST_CODE_PATH;

const Alfred = class Alfred {
  constructor(client) {
    this.client = client;
  }

  /**
   * Dispatch Task
   */
  async runTask(job) {
    const endpoint = this._getGatewayUrl();
    const body = this._getBodyForTask(job);
    const mutation = mutations.dispatchTask;

    const variables = {
      dispatchTaskInput: {
        intentId: body[ATTR_INTENT_ID],
        environmentName: this.client.appEnv,
        name: body[ATTR_NAME],
        programmingLanguage: body[ATTR_PROG].toUpperCase(),
        maxProcessingTime: body[ATTR_MAX_PROCESSING_TIME],
        data: body[ATTR_INPUT],
        codePathVersion: body[ATTR_CODE_PATH_VERSION],
        initialLibraryVersion: body[ATTR_INITIAL_LIB_VERSION],
      },
    };
    const res = await this._request(endpoint, mutation, variables);

    return res.dispatchTask;
  }

  /**
   * Schedule Task
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
  async runWorkflow(job) {
    const endpoint = this._getGatewayUrl();
    const body = this._getBodyForWorkflow(job);
    const mutation = mutations.dispatchWorkflow;
    const variables = {
      dispatchWorkflowInput: {
        intentId: body[ATTR_INTENT_ID],
        environmentName: this.client.appEnv,
        name: body[ATTR_NAME],
        customId: body[ATTR_CUSTOM_ID],
        canonicalName: body[ATTR_CANONICAL],
        programmingLanguage: body[ATTR_PROG].toUpperCase(),
        data: body[ATTR_INPUT],
        codePathVersion: body[ATTR_CODE_PATH_VERSION],
        initialLibraryVersion: body[ATTR_INITIAL_LIB_VERSION],
      },
    };
    const res = await this._request(endpoint, mutation, variables);

    return res.dispatchWorkflow;
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
    const endpoint = this._getGatewayUrl();
    const body = this._getBodyForUpdateWorkflow(query);
    const mutation = mutations.killWorkflow;
    const variables = {
      killWorkflowInput: {
        customId: query.customId,
        environmentName: this.client.appEnv,
        intentId: body[ATTR_INTENT_ID],
        name: body[ATTR_NAME],
        programmingLanguage: body[ATTR_PROG].toUpperCase(),
      },
    };
    const res = await this._request(endpoint, mutation, variables);

    return res.killWorkflow;
  }

  /**
   * Pause a workflow instance
   */
  async pauseWorkflow(query) {
    const endpoint = this._getGatewayUrl();
    const body = this._getBodyForUpdateWorkflow(query);
    const mutation = mutations.pauseWorkflow;
    const variables = {
      pauseWorkflowInput: {
        customId: query.customId,
        environmentName: this.client.appEnv,
        intentId: body[ATTR_INTENT_ID],
        name: body[ATTR_NAME],
        programmingLanguage: body[ATTR_PROG].toUpperCase(),
      },
    };
    const res = await this._request(endpoint, mutation, variables);

    return res.pauseWorkflow;
  }

  /**
   * Resume a workflow instance
   */
  async resumeWorkflow(query) {
    const endpoint = this._getGatewayUrl();
    const body = this._getBodyForUpdateWorkflow(query);
    const mutation = mutations.resumeWorkflow;
    const variables = {
      resumeWorkflowInput: {
        customId: query.customId,
        environmentName: this.client.appEnv,
        intentId: body[ATTR_INTENT_ID],
        name: body[ATTR_NAME],
        programmingLanguage: body[ATTR_PROG].toUpperCase(),
      },
    };
    const res = await this._request(endpoint, mutation, variables);

    return res.resumeWorkflow;
  }

  /**
   * Send an event to a workflow instance
   */
  async sendEvent(query, eventName, eventData) {
    const endpoint = this._getGatewayUrl();

    const mutation = mutations.sendEventToWorkflowByNameAndCustomId;
    const variables = {
      sendEventToWorkflowByNameAndCustomIdInput: {
        codePathVersion: CODE_PATH_VERSION,
        customId: query.customId,
        data: serializer.encode({
          name: eventName,
          data: eventData,
        }),
        environmentName: this.client.appEnv,
        initialLibraryVersion: INITIAL_LIB_VERSION,
        input: serializer.encode(eventData),
        intentId: query.intentId,
        name: eventName,
        programmingLanguage: PROG.toUpperCase(),
        workflowName: query.name,
      },
    };
    const res = await this._request(endpoint, mutation, variables);

    return res.sendEventToWorkflowByNameAndCustomId;
  }

  /**
   * Send an event to a workflow by instance_id
   */
  async sendEventByInstanceId(id, eventName, eventData) {
    const endpoint = this._getGatewayUrl();

    const mutation = mutations.sendEventToWorkflowById;
    const variables = {
      sendEventToWorkflowByIdInput: {
        id,
        eventName,
        eventInput: serializer.encode(eventData),
        eventData: serializer.encode({
          name: eventName,
          data: eventData,
        }),
      },
    };
    const res = await this._request(endpoint, mutation, variables);

    return res.sendEventToWorkflowById;
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

      const res = await graphQLClient.request(query, variables);
      return res;
    } catch (err) {
      const [error, message] = this._getError(err);

      switch (error) {
        case "NOT_FOUND":
          return message;
        case "ExternalZenatonError":
          throw new ExternalZenatonError(message);
        case "InternalZenatonError":
          throw new InternalZenatonError(message);
        default:
          throw new ZenatonError(message);
      }
    }
  }

  _getBodyForTask(job) {
    const { canonical, version } = versioner(job.name);

    return {
      [ATTR_INTENT_ID]: uuidv4(),
      [ATTR_PROG]: PROG,
      [ATTR_INITIAL_LIB_VERSION]: INITIAL_LIB_VERSION,
      [ATTR_CODE_PATH_VERSION]: CODE_PATH_VERSION,
      [ATTR_NAME]: job.name,
      [ATTR_CANONICAL]: canonical,
      [ATTR_VERSION]: version,
      [ATTR_INPUT]: serializer.encode(job.input),
    };
  }

  _getBodyForWorkflow(job) {
    const { canonical, version } = versioner(job.name);

    return {
      [ATTR_INTENT_ID]: uuidv4(),
      [ATTR_PROG]: PROG,
      [ATTR_INITIAL_LIB_VERSION]: INITIAL_LIB_VERSION,
      [ATTR_CODE_PATH_VERSION]: CODE_PATH_VERSION,
      [ATTR_NAME]: job.name,
      [ATTR_CANONICAL]: canonical,
      [ATTR_VERSION]: version,
      [ATTR_INPUT]: serializer.encode(job.input),
      [ATTR_CUSTOM_ID]: job.customId ? job.customId : null,
    };
  }

  _getBodyForUpdateWorkflow(query) {
    return {
      [ATTR_INTENT_ID]: query.intentId,
      [ATTR_PROG]: PROG,
      [ATTR_INITIAL_LIB_VERSION]: INITIAL_LIB_VERSION,
      [ATTR_CODE_PATH_VERSION]: CODE_PATH_VERSION,
      [ATTR_NAME]: query.name,
    };
  }

  _getAppEnv() {
    // when called from Agent, APP_ENV and APP_ID is not defined
    const params = {};

    if (this.client && this.client.appEnv) {
      params[APP_ENV] = this.client.appEnv;
    }

    if (this.client && this.client.appId) {
      params[APP_ID] = this.client.appId;
    }

    return params;
  }

  _getError(err) {
    // Validation errors
    if (err.response && err.response.errors && err.response.errors.length > 0) {
      // eslint-disable-next-line no-restricted-syntax
      for (const el of err.response.errors) {
        if (el.type === "NOT_FOUND") return ["NOT_FOUND", err.response.data];
      }

      const message = err.response.errors
        .map((graphqlError) => {
          const path = graphqlError.path ? `(${graphqlError.path}) ` : "";
          const errorMessage = graphqlError.message || "Unknown error";
          return `${path}${errorMessage}`;
        })
        .join("\n");

      return ["ExternalZenatonError", message];
    }

    // Internal Server Error
    if (err.response && err.response.status >= 500) {
      return [
        "InternalZenatonError",
        `Please contact Zenaton support - ${err.message}`,
      ];
    }

    return ["ZenatonError", err.message];
  }
};

const mutations = {
  dispatchTask: `
    mutation ($dispatchTaskInput: DispatchTaskInput!) {
      dispatchTask(input: $dispatchTaskInput) {
        task {
          intentId
        }
      }
  }`,
  dispatchWorkflow: `
    mutation ($dispatchWorkflowInput: DispatchWorkflowInput!) {
      dispatchWorkflow(input: $dispatchWorkflowInput) {
        workflow {
          id
          canonicalName
          name
          programmingLanguage
          properties
        }
      }
  }`,
  killWorkflow: `
    mutation ($killWorkflowInput: KillWorkflowInput!) {
      killWorkflow(input: $killWorkflowInput) {
        id
      }
  }`,
  pauseWorkflow: `
    mutation ($pauseWorkflowInput: PauseWorkflowInput!) {
      pauseWorkflow(input: $pauseWorkflowInput) {
        id
      }
  }`,
  resumeWorkflow: `
    mutation ($resumeWorkflowInput: ResumeWorkflowInput!) {
      resumeWorkflow(input: $resumeWorkflowInput) {
        id
      }
  }`,
  sendEventToWorkflowByNameAndCustomId: `
    mutation ($sendEventToWorkflowByNameAndCustomIdInput: SendEventToWorkflowByNameAndCustomIdInput!) {
      sendEventToWorkflowByNameAndCustomId(input: $sendEventToWorkflowByNameAndCustomIdInput) {
        event {
          intentId
        }
      }
  }`,
  sendEventToWorkflowById: `
    mutation ($sendEventToWorkflowByIdInput: SendEventToWorkflowByIdInput!) {
      sendEventToWorkflowById(input: $sendEventToWorkflowByIdInput) {
        event {
          intentId
        }
      }
  }`,
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
