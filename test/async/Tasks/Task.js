const { expect } = require("chai");
const sinon = require("sinon");

const { Task, taskManager } = require("../../../src/Code/async/Tasks");
const { InvalidArgumentError, ZenatonError } = require("../../../src/Errors");

describe("Task builder", () => {
  beforeEach(() => {
    sinon.stub(taskManager, "setClass");
  });

  it("should throw if task name is not a string", () => {
    // Arrange
    const taskName = 42;

    // Act
    const result = () => Task(taskName);

    // Assert
    expect(result).to.throw(
      InvalidArgumentError,
      "1st parameter (task name) must be a string",
    );
  });

  it("should act as a getter if only a name is provided", () => {
    // Arrange
    const taskName = "TaskA";
    const task = {};
    sinon
      .stub(taskManager, "getClass")
      .returns(null)
      .withArgs(taskName)
      .returns(task);

    // Act
    const result = Task(taskName);

    // Assert
    expect(result).to.equal(task);
  });

  it("should throw if task details is neither a function or an object", () => {
    // Arrange
    const taskName = "TaskA";
    const task = "Oops!";

    // Act
    const result = () => Task(taskName, task);

    // Assert
    expect(result).to.throw(
      InvalidArgumentError,
      "2nd parameter (task implemention) must be a function or an object",
    );
  });

  it("should throw if task details is an object without 'handle' method", () => {
    // Arrange
    const taskName = "TaskA";
    const task = {};

    // Act
    const result = () => Task(taskName, task);

    // Assert
    expect(result).to.throw(
      InvalidArgumentError,
      'Your task MUST define a "handle" method',
    );
  });

  it("should throw if task details is an object with a '_promiseHandle' method", () => {
    // Arrange
    const taskName = "TaskA";
    const task = { handle: () => {}, _promiseHandle: () => {} };

    // Act
    const result = () => Task(taskName, task);

    // Assert
    expect(result).to.throw(
      InvalidArgumentError,
      'Your task can NOT redefine a "_promiseHandle" method',
    );
  });

  it("should throw if task details is an object with a property which is not a function", () => {
    // Arrange
    const taskName = "TaskA";
    const task = { handle: () => {}, age: 47 };

    // Act
    const result = () => Task(taskName, task);

    // Assert
    expect(result).to.throw(
      InvalidArgumentError,
      `Task's methods must be functions - check value of "age"`,
    );
  });

  it("should return a class correctly named", () => {
    // Arrange
    const taskName = "TaskA";
    const task = { handle: () => {} };

    // Act
    const result = Task(taskName, task);

    // Assert
    expect(result.constructor).to.exist();
    expect(result.name).to.equal("TaskA");
  });

  it("should record class in 'taskManager'", () => {
    // Arrange
    const taskName = "TaskA";
    const task = { handle: () => {} };

    // Act
    const result = Task(taskName, task);

    // Assert
    expect(taskManager.setClass).to.have.been.calledOnceWithExactly(
      "TaskA",
      result,
    );
  });

  it("should use only first argument to set workflow's data", () => {
    // Arrange
    const taskName = "TaskA";
    const task = { handle: () => {} };

    // Act
    const TaskClass = Task(taskName, task);
    const instance = new TaskClass(1, 2, 3);

    // Assert
    expect(instance.data).to.eql(1);
  });

  it("should use an empty object as 'data' if first argument is nil", () => {
    // Arrange
    const taskName = "TaskA";
    const task = { handle: () => {} };

    // Act
    const TaskClass = Task(taskName, task);
    const instance = new TaskClass(null);

    // Assert
    expect(instance.data)
      .to.be.an("object")
      .and.to.be.empty();
  });

  it("should throw if provided cron is not a string", () => {
    // Arrange
    const taskName = "TaskA";
    const task = { handle: () => {} };

    // Act
    const TaskClass = Task(taskName, task);
    const instance = new TaskClass();

    // Assert
    expect(instance.schedule(12)).to.be.rejectedWith(
      ZenatonError,
      "Param passed to 'schedule' function must be a non empty string",
    );
  });

  it("should correctly set the 'scheduling.cron' property", async () => {
    // Arrange
    const taskName = "TaskA";
    const task = { handle: () => {} };

    // Act
    const TaskClass = Task(taskName, task);
    const instance = new TaskClass();

    try {
      await instance.schedule("* * * * *");
    } catch (e) {
      // do nothing
    }

    // Assert
    expect(instance.scheduling.cron).to.equal("* * * * *");
  });
});
