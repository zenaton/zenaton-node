const { GraphQLClient } = require("graphql-request");
const { serializer, versioner } = require("../Services");
const Job = require("./Job");
const {
  ExternalZenatonError,
  InternalZenatonError,
  ZenatonError,
} = require("../../../Errors");

const ZENATON_GATEWAY_BASE_URL = "https://gateway.zenaton.com";

const APP_ENV = "app_env";
const APP_ID = "app_id";

const ATTR_TAG = "tag";
const ATTR_NAME = "name";
const ATTR_VERSION = "version";
const ATTR_INPUT = "input";

const Alfred = class Alfred {
  constructor(client) {
    this.client = client;
  }

  /**
   * Dispatch Task
   */
  runTask(task) {
    const endpoint = this._getGatewayUrl();
    const body = this._getBodyForTask(task);
    const mutation = mutations.dispatchTask;

    const variables = {
      input: {
        appId: this.client.appId,
        environment: this.client.appEnv,
        name: body[ATTR_NAME],
        input: body[ATTR_INPUT],
      },
    };
    const job = new Job();
    const promise = this._request(endpoint, mutation, variables).then(
      (res) => res.dispatchTask,
    );
    job.promise = promise;

    return job;
  }

  /**
   * Schedule Task
   */
  scheduleTask(task) {
    const endpoint = this._getGatewayUrl();
    const body = this._getBodyForTask(task);
    const mutation = mutations.scheduleTask;
    const variables = {
      scheduleTaskInput: {
        appId: this.client.appId,
        environment: this.client.appEnv,
        cron: task.scheduling.cron,
        name: body[ATTR_NAME],
        input: body[ATTR_INPUT],
      },
    };
    const job = new Job();
    const promise = this._request(endpoint, mutation, variables).then(
      (res) => res.createTaskSchedule,
    );
    job.promise = promise;

    return job;
  }

  /**
   * Dispatch a workflow
   */
  runWorkflow(w) {
    const endpoint = this._getGatewayUrl();
    const body = this._getBodyForWorkflow(w);
    const mutation = mutations.dispatchWorkflow;
    const variables = {
      dispatchWorkflowInput: {
        appId: this.client.appId,
        environment: this.client.appEnv,
        name: body[ATTR_NAME],
        input: body[ATTR_INPUT],
        tag: body[ATTR_TAG],
        version: body[ATTR_VERSION],
      },
    };
    const job = new Job();
    const promise = this._request(endpoint, mutation, variables).then(
      (res) => res.dispatchWorkflow,
    );
    job.promise = promise;

    return job;
  }

  /**
   * Schedule a workflow
   */
  scheduleWorkflow(w) {
    const endpoint = this._getGatewayUrl();
    const body = this._getBodyForWorkflow(w);
    const mutation = mutations.scheduleWorkflow;
    const variables = {
      scheduleWorkflow: {
        appId: this.client.appId,
        environment: this.client.appEnv,
        cron: w.scheduling.cron,
        name: body[ATTR_NAME],
        tag: body[ATTR_TAG],
        input: body[ATTR_INPUT],
        version: body[ATTR_VERSION],
      },
    };
    const job = new Job();
    const promise = this._request(endpoint, mutation, variables).then(
      (res) => res.scheduleWorkflow,
    );
    job.promise = promise;

    return job;
  }

  /**
   * Terminate a workflow instance
   */
  terminateWorkflow(query) {
    const endpoint = this._getGatewayUrl();
    const mutation = mutations.terminateWorkflows;

    const variables = {
      terminateWorkflowsInput: {
        appId: this.client.appId,
        environment: this.client.appEnv,
        selector: query,
      },
    };

    const job = new Job();
    const promise = this._request(endpoint, mutation, variables).then(
      (res) => res.killWorkflows,
    );
    job.promise = promise;

    return job;
  }

  /**
   * Pause a workflow instance
   */
  pauseWorkflow(query) {
    const endpoint = this._getGatewayUrl();
    const mutation = mutations.pauseWorkflows;
    const variables = {
      pauseWorkflowsInput: {
        appId: this.client.appId,
        environment: this.client.appEnv,
        selector: query,
      },
    };
    const job = new Job();
    const promise = this._request(endpoint, mutation, variables).then(
      (res) => res.pauseWorkflows,
    );
    job.promise = promise;

    return job;
  }

  /**
   * Resume a workflow instance
   */
  resumeWorkflow(query) {
    const endpoint = this._getGatewayUrl();
    const mutation = mutations.resumeWorkflows;
    const variables = {
      resumeWorkflowsInput: {
        appId: this.client.appId,
        environment: this.client.appEnv,
        selector: query,
      },
    };
    const job = new Job();
    const promise = this._request(endpoint, mutation, variables).then(
      (res) => res.resumeWorkflows,
    );
    job.promise = promise;

    return job;
  }

  /**
   * Send an event to a workflow instance
   */
  sendEvent(query, eventName, eventData) {
    const endpoint = this._getGatewayUrl();
    const mutation = mutations.sendEventToWorkflows;

    const variables = {
      sendEventToWorkflowsInput: {
        appId: this.client.appId,
        environment: this.client.appEnv,
        name: eventName,
        data: serializer.encode(eventData),
        selector: query,
      },
    };
    const job = new Job();
    const promise = this._request(endpoint, mutation, variables).then(
      (res) => res.sendEventToWorkflows,
    );
    job.promise = promise;

    return job;
  }

  /**
   * Send an event to a workflow by instance_id
   */
  sendEventByInstanceId(id, eventName, eventData) {
    const endpoint = this._getGatewayUrl();

    const mutation = mutations.sendEventToWorkflows;
    const variables = {
      sendEventToWorkflowsInput: {
        appId: this.client.appId,
        environment: this.client.appEnv,
        name: eventName,
        data: serializer.encode(eventData),
        selector: { id },
      },
    };
    const job = new Job();
    const promise = this._request(endpoint, mutation, variables).then(
      (res) => res.sendEventToWorkflows,
    );
    job.promise = promise;

    return job;
  }

  _getGatewayUrl() {
    const host = process.env.ZENATON_GATEWAY_URL
      ? process.env.ZENATON_GATEWAY_URL
      : ZENATON_GATEWAY_BASE_URL;

    return `${host}/graphql`;
  }

  async _request(endpoint, query, variables) {
    try {
      const graphQLClient = new GraphQLClient(endpoint, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.client.apiToken}`,
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
      [ATTR_NAME]: canonical,
      [ATTR_VERSION]: version,
      [ATTR_INPUT]: serializer.encode(job.input),
    };
  }

  _getBodyForWorkflow(job) {
    const { canonical, version } = versioner(job.name);

    return {
      [ATTR_NAME]: canonical,
      [ATTR_VERSION]: version,
      [ATTR_INPUT]: serializer.encode(job.input),
      [ATTR_TAG]: job.customId ? job.customId : null,
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
    mutation($input: DispatchTaskInput!) {
      dispatchTask(input: $input) {
        id
      }
  }`,
  dispatchWorkflow: `
    mutation($input: DispatchWorkflowInput!) {
      dispatchWorkflow(input: $input) {
        id
      }
  }`,
  terminateWorkflows: `
    mutation($input: TerminateWorkflowsInput!) {
      terminateWorkflows(input: $input) {
        status
      }
  }`,
  pauseWorkflows: `
    mutation($input: ResumeWorkflowsInput!) {
      resumeWorkflows(input: $input) {
        status
      }
  }`,
  resumeWorkflows: `
    mutation($input: ResumeWorkflowsInput!) {
      resumeWorkflows(input: $input) {
        status
      }
  }`,
  sendEventToWorkflows: `
    mutation($input: SendEventToWorkflowsInput!) {
      sendEventToWorkflows(input: $input) {
        status
      }
  }`,
  scheduleWorkflow: `
    mutation($input: ScheduleWorkflowInput!) {
      scheduleWorkflow(input: $input) {
        id
      }
  }`,
  scheduleTask: `
    mutation($input: ScheduleTaskInput!) {
      scheduleTask(input: $input) {
        id
      }
  }`,
};

module.exports = Alfred;
