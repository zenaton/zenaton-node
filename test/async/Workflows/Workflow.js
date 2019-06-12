const { expect } = require("chai");
const sinon = require("sinon");

const {
  Workflow,
  AbstractWorkflow,
  workflowManager,
} = require("../../../src/async/Workflows");
const {
  InvalidArgumentError,
  ExternalZenatonError,
  ZenatonError,
} = require("../../../src/Errors");

describe("Workflow builder", () => {
  beforeEach(() => {
    sinon.stub(workflowManager, "setClass");
  });

  it("should throw if workflow name is not a string", () => {
    // Arrange
    const workflowName = 42;

    // Act
    const result = () => Workflow(workflowName);

    // Assert
    expect(result).to.throw(
      InvalidArgumentError,
      "1st parameter must be a string (workflow name)",
    );
  });

  it("should act as a getter if only a name is provided", () => {
    // Arrange
    const workflowName = "TestWorkflow";
    const workflow = {};
    sinon
      .stub(workflowManager, "getClass")
      .returns(null)
      .withArgs(workflowName)
      .returns(workflow);

    // Act
    const result = Workflow(workflowName);

    // Assert
    expect(result).to.equal(workflow);
  });

  it("should throw if workflow details is neither a function or an object", () => {
    // Arrange
    const workflowName = "TestWorkflow";
    const workflow = "Oops!";

    // Act
    const result = () => Workflow(workflowName, workflow);

    // Assert
    expect(result).to.throw(
      InvalidArgumentError,
      "2nd parameter (workflow implemention) must be a function or an object",
    );
  });

  it("should throw if workflow details is an object without 'handle' method", () => {
    // Arrange
    const workflowName = "TestWorkflow";
    const workflow = {};

    // Act
    const result = () => Workflow(workflowName, workflow);

    // Assert
    expect(result).to.throw(
      InvalidArgumentError,
      'Your workflow MUST define a "handle" method',
    );
  });

  AbstractWorkflow.methods().forEach((method) => {
    it(`should throw if workflow details has a property '${method}' which is not a function`, () => {
      // Arrange
      const workflowName = "TestWorkflow";
      const workflow = { handle: () => {}, [method]: 42 };

      // Act
      const result = () => Workflow(workflowName, workflow);

      // Assert
      expect(result).to.throw(
        InvalidArgumentError,
        `"${method}" method must be a function`,
      );
    });
  });

  it("should return a class correctly named", () => {
    // Arrange
    const workflowName = "TestWorkflow";
    const workflow = { handle: () => {} };

    // Act
    const result = Workflow(workflowName, workflow);

    // Assert
    expect(result.constructor).to.exist();
    expect(result.name).to.equal("TestWorkflow");
  });

  it("should record class in 'workflowManager'", () => {
    // Arrange
    const workflowName = "TestWorkflow";
    const workflow = { handle: () => {} };

    // Act
    const result = Workflow(workflowName, workflow);

    // Assert
    expect(workflowManager.setClass).to.have.been.calledOnceWithExactly(
      "TestWorkflow",
      result,
    );
  });

  it("should use only first argument to set workflow's data", () => {
    // Arrange
    const workflowName = "TestWorkflow";
    const workflow = { handle: () => {} };

    // Act
    const WorkflowClass = Workflow(workflowName, workflow);
    const instance = new WorkflowClass(1, 2, 3);

    // Assert
    expect(instance.data).to.eql(1);
  });

  it("should use an empty object as 'data' if first argument is nil", () => {
    // Arrange
    const workflowName = "TestWorkflow";
    const workflow = { handle: () => {} };

    // Act
    const WorkflowClass = Workflow(workflowName, workflow);
    const instance = new WorkflowClass(null);

    // Assert
    expect(instance.data)
      .to.be.an("object")
      .and.to.be.empty();
  });

  it("should throw if custom id is not string compatible", () => {
    // Arrange
    const workflowName = "TestWorkflow";
    const workflow = { handle: () => {}, id: () => Symbol.iterator };

    // Act
    const WorkflowClass = Workflow(workflowName, workflow);
    const instance = new WorkflowClass();

    // Assert
    expect(() => instance._getCustomId()).to.throw(
      InvalidArgumentError,
      "Provided id must be a string or a number - current type: symbol",
    );
  });

  it("should throw if custom id exceed max size", () => {
    // Arrange
    const workflowName = "TestWorkflow";
    const workflow = { handle: () => {}, id: () => "A".repeat(257) };

    // Act
    const WorkflowClass = Workflow(workflowName, workflow);
    const instance = new WorkflowClass();

    // Assert
    expect(() => instance._getCustomId()).to.throw(
      ExternalZenatonError,
      "Provided id must not exceed 256 bytes",
    );
  });

  it("should throw if provided cron is not a string", () => {
    // Arrange
    const workflowName = "TestWorkflow";
    const workflow = { handle: () => {} };

    // Act
    const WorkflowClass = Workflow(workflowName, workflow);
    const instance = new WorkflowClass();

    // Assert
    expect(() => instance.repeat(12)).to.throw(
      ZenatonError,
      "Param passed to 'repeat' function must be a string",
    );
  });

  it("should throw if provided cron is not a CRON expression", () => {
    // Arrange
    const workflowName = "TestWorkflow";
    const workflow = { handle: () => {} };

    // Act
    const WorkflowClass = Workflow(workflowName, workflow);
    const instance = new WorkflowClass();

    // Assert
    expect(() => instance.repeat("BOOM BOOM")).to.throw(
      ZenatonError,
      "Param passed to 'repeat' function is not a proper CRON expression",
    );
  });

  it("should correctly set the 'scheduling.cron' property", () => {
    // Arrange
    const workflowName = "TestWorkflow";
    const workflow = { handle: () => {} };

    // Act
    const WorkflowClass = Workflow(workflowName, workflow);
    const instance = new WorkflowClass();
    instance.repeat("* * * * *");

    // Assert
    expect(instance.scheduling.cron).to.equal("* * * * *");
  });
});
