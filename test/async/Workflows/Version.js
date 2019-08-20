const { expect } = require("chai");
const sinon = require("sinon");

const {
  Version,
  workflowManager,
  AbstractWorkflow,
} = require("../../../src/Code/async/Workflows");
const { InvalidArgumentError } = require("../../../src/Errors");

describe("Version builder", () => {
  beforeEach(() => {
    sinon.stub(workflowManager, "setClass");
  });

  it("should throw if workflow name is not a string", () => {
    // Arrange
    const workflowName = 42;

    // Act
    const result = () => Version(workflowName);

    // Assert
    expect(result).to.throw(
      InvalidArgumentError,
      "1st parameter must be a string (workflow name)",
    );
  });

  it("should throw if versions is neither an array nor an object", () => {
    // Arrange
    const workflowName = "TestWorkflow";
    const versions = 42;

    // Act
    const result = () => Version(workflowName, versions);

    // Assert
    expect(result).to.throw(
      InvalidArgumentError,
      "2nd parameter must be an array or an object",
    );
  });

  it("should throw if versions is an object without 'versions' method", () => {
    // Arrange
    const workflowName = "TestWorkflow";
    const versions = {};

    // Act
    const result = () => Version(workflowName, versions);

    // Assert
    expect(result).to.throw(
      InvalidArgumentError,
      'You must have a "versions" method',
    );
  });

  it("should throw if 'versions' method does not return an array", () => {
    // Arrange
    const workflowName = "TestWorkflow";
    const versions = { versions: () => 42 };

    // Act
    const result = () => Version(workflowName, versions);

    // Assert
    expect(result).to.throw(
      InvalidArgumentError,
      '"versions" method should return an array',
    );
  });

  it("should throw if versions is empty array", () => {
    // Arrange
    const workflowName = "TestWorkflow";
    const versions = [];

    // Act
    const result = () => Version(workflowName, versions);

    // Assert
    expect(result).to.throw(
      InvalidArgumentError,
      "versions array must have at least one element",
    );
  });

  it("should throw if versions are not workflow classes", () => {
    // Arrange
    const workflowName = "TestWorkflow";
    const versions = { versions: () => [42] };

    // Act
    const result = () => Version(workflowName, versions);

    // Assert
    expect(result).to.throw(
      InvalidArgumentError,
      "element of versions array should be workflow class",
    );
  });

  it("should record class in 'workflowManager'", () => {
    // Arrange
    const workflowName = "TestWorkflow";
    const versions = [class extends AbstractWorkflow {}];

    // Act
    const result = Version(workflowName, versions);

    // Assert
    expect(workflowManager.setClass).to.have.been.calledOnceWithExactly(
      "TestWorkflow",
      result,
    );
  });
});
