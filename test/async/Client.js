const proxyquire = require("proxyquire");
const { expect } = require("chai");
const sinon = require("sinon");

const globalClient = require("../../src/client");
const { http, serializer, graphQL } = require("../../src/Code/async/Services");
const { workflowManager } = require("../../src/Code/async/Workflows");

proxyquire.noPreserveCache();

const FAKE_APP_ID = "JZMHGKYEBX";
const FAKE_API_TOKEN =
  "N1HGV83asfRuH8RXAvFXr3CrDBzljPSuqdllCTxVkOkU014g1bIH7OOCfn7O";
const FAKE_APP_ENV = "prod";

const FAKE_ENCODED_DATA = "[ENCODED DATA]";
const FAKE_APP_VERSION = "0.0.0";

describe("Client", () => {
  const initSpy = sinon.spy(globalClient, "init");

  let Client;

  beforeEach(() => {
    Client = proxyquire("../../src/async/Client", {
      "uuid/v4": () => "statically-generated-intent-id",
      "../infos": { version: FAKE_APP_VERSION },
    });

    sinon.stub(http, "post").resolves();
    sinon.stub(http, "put").resolves();
    sinon.stub(graphQL, "request").resolves({});

    sinon.stub(serializer, "encode").returns(FAKE_ENCODED_DATA);
  });

  it("should expose a static 'init' method", () => {
    // Act
    Client.init(FAKE_APP_ID, FAKE_API_TOKEN, FAKE_APP_ENV);

    // Assert
    expect(initSpy).to.have.been.calledWithExactly(
      FAKE_APP_ID,
      FAKE_API_TOKEN,
      FAKE_APP_ENV,
    );

    expect(globalClient.credentials.appId).to.equal(FAKE_APP_ID);
    expect(globalClient.credentials.apiToken).to.equal(FAKE_API_TOKEN);
    expect(globalClient.credentials.appEnv).to.equal(FAKE_APP_ENV);
  });

  it("should call the agent to start a workflow", async () => {
    // Arranges

    const workflow = {
      id: () => "FAKE CUSTOM ID",
      name: "WorkflowVersionName",
      data: "WHATEVER",
      _getCanonical: () => "CanonicalWorkflowName",
      _getCustomId: () => "FAKE CUSTOM ID",
    };

    // Act
    Client.init(FAKE_APP_ID, FAKE_API_TOKEN, FAKE_APP_ENV);
    const client = new Client();
    const result = client.startWorkflow(workflow);

    // Assert
    await expect(result).to.eventually.be.fulfilled();

    expect(serializer.encode).to.have.been.calledWithExactly("WHATEVER");

    expect(http.post).to.have.been.calledWithExactly(
      "http://localhost:4001/api/v_newton/instances",
      {
        canonical_name: "CanonicalWorkflowName",
        code_path_version: "async",
        custom_id: "FAKE CUSTOM ID",
        data: FAKE_ENCODED_DATA,
        initial_library_version: FAKE_APP_VERSION,
        name: "WorkflowVersionName",
        programming_language: "Javascript",
        intent_id: "statically-generated-intent-id",
      },
      { params: { app_env: FAKE_APP_ENV, app_id: FAKE_APP_ID } },
    );
  });

  it("should call the agent to schedule a workflow", async () => {
    // Arrange
    const workflow = {
      id: () => "FAKE CUSTOM ID",
      name: "WorkflowVersionName",
      data: "WHATEVER",
      scheduling: {
        cron: "* * * * *",
      },
      _getCanonical: () => "CanonicalWorkflowName",
      _getCustomId: () => "FAKE CUSTOM ID",
    };

    // Act
    Client.init(FAKE_APP_ID, FAKE_API_TOKEN, FAKE_APP_ENV);
    const client = new Client();
    const result = client.startWorkflow(workflow);

    // Assert
    await expect(result).to.eventually.be.fulfilled();

    expect(serializer.encode).to.have.been.calledWithExactly("WHATEVER");

    expect(graphQL.request).to.have.been.calledWithExactly(
      "https://gateway.zenaton.com/api",
      graphQL.mutations.createWorkflowSchedule,
      {
        createWorkflowScheduleInput: {
          codePathVersion: "async",
          cron: "* * * * *",
          environmentName: "prod",
          initialLibraryVersion: FAKE_APP_VERSION,
          intentId: "statically-generated-intent-id",
          programmingLanguage: "JAVASCRIPT",
          properties: FAKE_ENCODED_DATA,
          workflowName: "WorkflowVersionName",
          canonicalName: "CanonicalWorkflowName",
        },
      },
    );
  });

  it("should call the agent to start a task", async () => {
    // Arrange
    const task = {
      name: "TaskName",
      data: "WHATEVER",
      maxProcessingTime: () => 1000,
    };

    // Act
    Client.init(FAKE_APP_ID, FAKE_API_TOKEN, FAKE_APP_ENV);
    const client = new Client();
    const result = client.startTask(task);

    // Assert
    await expect(result).to.eventually.be.fulfilled();

    expect(serializer.encode).to.have.been.calledWithExactly("WHATEVER");

    expect(http.post).to.have.been.calledWithExactly(
      "http://localhost:4001/api/v_newton/tasks",
      {
        code_path_version: "async",
        data: FAKE_ENCODED_DATA,
        initial_library_version: FAKE_APP_VERSION,
        maxProcessingTime: 1000,
        name: "TaskName",
        programming_language: "Javascript",
        intent_id: "statically-generated-intent-id",
      },
      { params: { app_env: FAKE_APP_ENV, app_id: FAKE_APP_ID } },
    );
  });

  it("should call the agent to schedule a task", async () => {
    // Arrange
    const task = {
      name: "TaskName",
      data: "WHATEVER",
      scheduling: {
        cron: "* * * * *",
      },
      maxProcessingTime: () => 1000,
    };

    // Act
    Client.init(FAKE_APP_ID, FAKE_API_TOKEN, FAKE_APP_ENV);
    const client = new Client();
    const result = client.startTask(task);

    // Assert
    await expect(result).to.eventually.be.fulfilled();

    expect(serializer.encode).to.have.been.calledWithExactly("WHATEVER");

    expect(graphQL.request).to.have.been.calledWithExactly(
      "https://gateway.zenaton.com/api",
      graphQL.mutations.createTaskSchedule,
      {
        createTaskScheduleInput: {
          codePathVersion: "async",
          cron: "* * * * *",
          environmentName: "prod",
          initialLibraryVersion: FAKE_APP_VERSION,
          intentId: "statically-generated-intent-id",
          programmingLanguage: "JAVASCRIPT",
          properties: FAKE_ENCODED_DATA,
          taskName: "TaskName",
        },
      },
    );
  });

  it("should kill a workflow", async () => {
    // Arrange
    const workflowName = "CanonicalWorkflowName";
    const customId = "45745c60";

    // Act
    Client.init(FAKE_APP_ID, FAKE_API_TOKEN, FAKE_APP_ENV);
    const client = new Client();
    const result = client.killWorkflow(workflowName, customId);

    // Assert
    await expect(result).to.eventually.be.fulfilled();

    expect(http.put).to.have.been.calledWithExactly(
      "http://localhost:4001/api/v_newton/instances",
      {
        code_path_version: "async",
        initial_library_version: FAKE_APP_VERSION,
        mode: "kill",
        name: "CanonicalWorkflowName",
        programming_language: "Javascript",
        intent_id: "statically-generated-intent-id",
      },
      {
        params: {
          app_env: FAKE_APP_ENV,
          app_id: FAKE_APP_ID,
          custom_id: customId,
        },
      },
    );
  });

  it("should pause a workflow", async () => {
    // Arrange
    const workflowName = "CanonicalWorkflowName";
    const customId = "45745c60";

    // Act
    Client.init(FAKE_APP_ID, FAKE_API_TOKEN, FAKE_APP_ENV);
    const client = new Client();
    const result = client.pauseWorkflow(workflowName, customId);

    // Assert
    await expect(result).to.eventually.be.fulfilled();

    expect(http.put).to.have.been.calledWithExactly(
      "http://localhost:4001/api/v_newton/instances",
      {
        code_path_version: "async",
        initial_library_version: FAKE_APP_VERSION,
        mode: "pause",
        name: "CanonicalWorkflowName",
        programming_language: "Javascript",
        intent_id: "statically-generated-intent-id",
      },
      {
        params: {
          app_env: FAKE_APP_ENV,
          app_id: FAKE_APP_ID,
          custom_id: customId,
        },
      },
    );
  });

  it("should resume a workflow", async () => {
    // Arrange
    const workflowName = "CanonicalWorkflowName";
    const customId = "45745c60";

    // Act
    Client.init(FAKE_APP_ID, FAKE_API_TOKEN, FAKE_APP_ENV);
    const client = new Client();
    const result = client.resumeWorkflow(workflowName, customId);

    // Assert
    await expect(result).to.eventually.be.fulfilled();

    expect(http.put).to.have.been.calledWithExactly(
      "http://localhost:4001/api/v_newton/instances",
      {
        code_path_version: "async",
        initial_library_version: FAKE_APP_VERSION,
        mode: "run",
        name: "CanonicalWorkflowName",
        programming_language: "Javascript",
        intent_id: "statically-generated-intent-id",
      },
      {
        params: {
          app_env: FAKE_APP_ENV,
          app_id: FAKE_APP_ID,
          custom_id: customId,
        },
      },
    );
  });

  it("should find a workflow", async () => {
    // Arrange
    const workflowName = "CanonicalWorkflowName";
    const customId = "45745c60";

    sinon.stub(http, "get").resolves({
      data: {
        properties: "FAKE PROPERTIES",
      },
    });

    const fakeFoundWorkflow = {};
    sinon.stub(workflowManager, "getWorkflow").returns(fakeFoundWorkflow);

    // Act
    Client.init(FAKE_APP_ID, FAKE_API_TOKEN, FAKE_APP_ENV);
    const client = new Client();
    const result = client.findWorkflow(workflowName, customId);

    // Assert
    await expect(result)
      .to.eventually.be.fulfilled()
      .and.to.equal(fakeFoundWorkflow);

    expect(http.get).to.have.been.calledWithExactly(
      "https://api.zenaton.com/v1/instances",
      {
        params: {
          code_path_version: "async",
          initial_library_version: FAKE_APP_VERSION,
          name: "CanonicalWorkflowName",
          programming_language: "Javascript",
          api_token: FAKE_API_TOKEN,
          app_env: FAKE_APP_ENV,
          app_id: FAKE_APP_ID,
          custom_id: customId,
        },
      },
    );

    expect(workflowManager.getWorkflow).to.have.been.calledWithExactly(
      "CanonicalWorkflowName",
      "FAKE PROPERTIES",
    );
  });

  it("should send an event to a workflow", async () => {
    // Arrange
    const workflowName = "CanonicalWorkflowName";
    const customId = "45745c60";
    const eventName = "MyEvent";
    const eventData = "WHATEVER";

    sinon.stub(http, "get").resolves({
      data: {
        properties: "FAKE PROPERTIES",
      },
    });

    const fakeFoundWorkflow = {};
    sinon.stub(workflowManager, "getWorkflow").returns(fakeFoundWorkflow);

    // Act
    Client.init(FAKE_APP_ID, FAKE_API_TOKEN, FAKE_APP_ENV);
    const client = new Client();
    const result = client.sendEvent(
      workflowName,
      customId,
      eventName,
      eventData,
    );

    // Assert
    await expect(result).to.eventually.be.fulfilled();

    expect(serializer.encode)
      .to.have.been.calledTwice()
      .and.to.have.been.calledWithExactly({
        name: "MyEvent",
        data: "WHATEVER",
      })
      .and.to.have.been.calledWithExactly("WHATEVER");

    expect(http.post).to.have.been.calledWithExactly(
      "http://localhost:4001/api/v_newton/events",
      {
        code_path_version: "async",
        initial_library_version: FAKE_APP_VERSION,
        name: "CanonicalWorkflowName",
        programming_language: "Javascript",
        custom_id: customId,
        event_data: FAKE_ENCODED_DATA,
        event_input: FAKE_ENCODED_DATA,
        event_name: "MyEvent",
        intent_id: "statically-generated-intent-id",
      },
      {
        params: {
          app_env: FAKE_APP_ENV,
          app_id: FAKE_APP_ID,
        },
      },
    );
  });
});
