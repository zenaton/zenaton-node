const proxyquire = require("proxyquire");
const { expect } = require("chai");
const sinon = require("sinon");

const { workflowManager } = require("../../../src/async/Workflows");
const { taskManager } = require("../../../src/async/Tasks");
const { InvalidArgumentError } = require("../../../src/Errors");

proxyquire.noPreserveCache();

const FAKE_WORKFLOW_JOB_NAME = "FAKE_WORKFLOW_JOB_NAME";
const FAKE_TASK_JOB_NAME = "FAKE_TASK_JOB_NAME";

describe("Engine", () => {
  let startTaskFake;
  let startWorkflowFake;

  let Engine;

  beforeEach(() => {
    startTaskFake = sinon.fake.resolves("Result Task");
    startWorkflowFake = sinon.fake.resolves("Result Workflow");

    const clientStub = function clientStub() {
      this.startTask = startTaskFake;
      this.startWorkflow = startWorkflowFake;
    };

    Engine = proxyquire("../../../src/async/Engine/Engine", {
      "../Client": clientStub,
    });

    sinon
      .stub(workflowManager, "getClass")
      .returns(null)
      .withArgs(FAKE_WORKFLOW_JOB_NAME)
      .returns(true);

    sinon
      .stub(taskManager, "getClass")
      .returns(null)
      .withArgs(FAKE_TASK_JOB_NAME)
      .returns(true);
  });

  it("should allow to set processor", () => {
    // Arrange
    const processor = {};

    // Act
    const engine = new Engine();
    engine.setProcessor(processor);

    // Assert
    expect(engine.processor).to.equal(processor);
  });

  describe("with no jobs", () => {
    it("should return an empty array for 'execute'", async () => {
      // Arrange
      const jobs = [];

      // Act
      const engine = new Engine();
      const result = engine.execute(jobs);

      // Assert
      await expect(result)
        .to.eventually.be.fulfilled()
        .and.eql([]);
    });

    it("should return an empty array for 'dispatch'", async () => {
      // Arrange
      const jobs = [];

      // Act
      const engine = new Engine();
      const result = engine.dispatch(jobs);

      // Assert
      await expect(result)
        .to.eventually.be.fulfilled()
        .and.eql([]);
    });
  });

  describe("with unknown jobs", () => {
    it("should throw when executing a job that cannot be identified", async () => {
      // Arrange
      const unknownJob = {
        name: "FOOBAR",
      };
      const jobs = [unknownJob];

      // Act
      const engine = new Engine();
      const result = engine.execute(jobs);

      // Assert
      await expect(result).to.eventually.be.rejectedWith(
        InvalidArgumentError,
        "You can only execute or dispatch Zenaton Task or Workflow",
      );
    });

    it("should throw when dispatching a job that cannot be identified", async () => {
      // Arrange
      const unknownJob = {
        name: "FOOBAR",
      };
      const jobs = [unknownJob];

      // Act
      const engine = new Engine();
      const result = engine.dispatch(jobs);

      // Assert
      await expect(result).to.eventually.be.rejectedWith(
        InvalidArgumentError,
        "You can only execute or dispatch Zenaton Task or Workflow",
      );
    });
  });

  describe("with no processor", () => {
    it("should execute jobs locally", async () => {
      // Arrange
      const jobWorkflow = {
        name: FAKE_WORKFLOW_JOB_NAME,
        handle: sinon.fake.resolves("Result Workflow"),
      };
      const jobTask = {
        name: FAKE_TASK_JOB_NAME,
        _promiseHandle: sinon.fake.resolves("Result Task"),
      };
      const jobs = [jobWorkflow, jobTask];

      // Act
      const engine = new Engine();
      const result = engine.execute(jobs);

      // Assert
      const content = await expect(result)
        .to.eventually.be.fulfilled()
        .and.to.be.an("array");
      await expect(Promise.all(content))
        .to.eventually.be.fulfilled()
        .and.to.eql(["Result Workflow", "Result Task"]);

      expect(jobWorkflow.handle).to.have.been.calledOnceWithExactly();
      expect(jobTask._promiseHandle).to.have.been.calledOnceWithExactly();
    });

    it("should dispatch jobs", async () => {
      // Arrange
      const jobWorkflow = {
        name: FAKE_WORKFLOW_JOB_NAME,
      };
      const jobTask = {
        name: FAKE_TASK_JOB_NAME,
      };
      const jobs = [jobWorkflow, jobTask];

      // Act
      const engine = new Engine();
      const result = engine.dispatch(jobs);

      // Assert
      const content = await expect(result)
        .to.eventually.be.fulfilled()
        .and.to.be.an("array");
      await expect(Promise.all(content))
        .to.eventually.be.fulfilled()
        .and.to.eql([undefined, undefined]);

      expect(startTaskFake).to.have.been.calledOnceWithExactly(jobTask);
      expect(startWorkflowFake).to.have.been.calledOnceWithExactly(jobWorkflow);
    });
  });

  describe("with a processor set", () => {
    it("should forward executed jobs to processor", async () => {
      // Arrange
      const processor = {
        process: sinon.fake.resolves(["Result Workflow", "Result Task"]),
      };

      const jobWorkflow = {
        name: FAKE_WORKFLOW_JOB_NAME,
      };
      const jobTask = {
        name: FAKE_TASK_JOB_NAME,
      };
      const jobs = [jobWorkflow, jobTask];

      // Act
      const engine = new Engine();
      engine.setProcessor(processor);
      const result = engine.execute(jobs);

      // Assert
      const content = await expect(result)
        .to.eventually.be.fulfilled()
        .and.to.be.an("array");
      await expect(Promise.all(content))
        .to.eventually.be.fulfilled()
        .and.to.eql(["Result Workflow", "Result Task"]);

      expect(processor.process).to.have.been.calledOnceWithExactly(jobs, true);
    });

    it("should forward dispatched jobs to processor", async () => {
      // Arrange
      const processor = {
        process: sinon.fake.resolves(["Result Workflow", "Result Task"]),
      };

      const jobWorkflow = {
        name: FAKE_WORKFLOW_JOB_NAME,
      };
      const jobTask = {
        name: FAKE_TASK_JOB_NAME,
      };
      const jobs = [jobWorkflow, jobTask];

      // Act
      const engine = new Engine();
      engine.setProcessor(processor);
      const result = engine.dispatch(jobs);

      // Assert
      const content = await expect(result)
        .to.eventually.be.fulfilled()
        .and.to.be.an("array");
      await expect(Promise.all(content))
        .to.eventually.be.fulfilled()
        .and.to.eql(["Result Workflow", "Result Task"]);

      expect(processor.process).to.have.been.calledOnceWithExactly(jobs, false);
    });
  });
});
