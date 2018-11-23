const { expect } = require("chai");
const sinon = require("sinon");

const {
  Workflow,
  AbstractWorkflow,
  workflowManager,
} = require("../../../src/async/Workflows");
const { InvalidArgumentError } = require("../../../src/Errors");

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
});
