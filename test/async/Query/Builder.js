/* eslint max-classes-per-file: 0 */

const proxyquire = require("proxyquire");
const { expect } = require("chai");
const sinon = require("sinon");

const { AbstractWorkflow } = require("../../../src/async/Workflows");

proxyquire.noPreserveCache();

describe("Builder", () => {
  let findWorkflowStub;
  let sendEventFake;
  let killWorkflowFake;
  let pauseWorkflowFake;
  let resumeWorkflowFake;

  let Builder;

  beforeEach(() => {
    findWorkflowStub = sinon.stub();
    sendEventFake = sinon.fake.resolves();
    killWorkflowFake = sinon.fake.resolves();
    pauseWorkflowFake = sinon.fake.resolves();
    resumeWorkflowFake = sinon.fake.resolves();

    const clientStub = function engineStub() {
      this.findWorkflow = findWorkflowStub;
      this.sendEvent = sendEventFake;
      this.killWorkflow = killWorkflowFake;
      this.pauseWorkflow = pauseWorkflowFake;
      this.resumeWorkflow = resumeWorkflowFake;
    };

    Builder = proxyquire("../../../src/async/Query/Builder", {
      "../Client": clientStub,
    });
  });

  it("should find a workflow by its custom id", async () => {
    // Arrange
    const workflowClass = class TestWorkflow extends AbstractWorkflow {};
    const customId = "45745c60";

    const fakeWorkflow = {};
    findWorkflowStub.resolves(fakeWorkflow);

    // Act
    const builder = new Builder(workflowClass);
    const result = builder.whereId(customId).find();

    // Assert
    await expect(result)
      .to.eventually.be.fulfilled()
      .and.to.equal(fakeWorkflow);

    expect(findWorkflowStub).to.have.been.calledOnceWithExactly(
      workflowClass,
      customId,
    );
  });

  it("should send an event to a workflow", async () => {
    // Arrange
    const workflowClass = class TestWorkflow extends AbstractWorkflow {};
    const customId = "45745c60";
    const eventName = "MyEvent";
    const eventData = 123;

    // Act
    const builder = new Builder(workflowClass);
    const result = builder.whereId(customId).send(eventName, eventData);

    // Assert
    await expect(result).to.eventually.be.fulfilled();

    expect(sendEventFake).to.have.been.calledOnceWithExactly(
      workflowClass,
      customId,
      eventName,
      eventData,
    );
  });

  it("should send an empty object as 'eventData' by default", async () => {
    // Arrange
    const workflowClass = class TestWorkflow extends AbstractWorkflow {};
    const customId = "45745c60";
    const eventName = "MyEvent";

    // Act
    const builder = new Builder(workflowClass);
    const result = builder.whereId(customId).send(eventName);

    // Assert
    await expect(result).to.eventually.be.fulfilled();

    expect(sendEventFake).to.have.been.calledOnceWithExactly(
      workflowClass,
      customId,
      eventName,
      sinon.match.object,
    );
  });

  it("should kill a workflow", async () => {
    // Arrange
    const workflowClass = class TestWorkflow extends AbstractWorkflow {};
    const customId = "45745c60";

    // Act
    const builder = new Builder(workflowClass);
    const result = builder.whereId(customId).kill();

    // Assert
    await expect(result).to.eventually.be.fulfilled();

    expect(killWorkflowFake).to.have.been.calledOnceWithExactly(
      workflowClass,
      customId,
    );
  });

  it("should pause a workflow", async () => {
    // Arrange
    const workflowClass = class TestWorkflow extends AbstractWorkflow {};
    const customId = "45745c60";

    // Act
    const builder = new Builder(workflowClass);
    const result = builder.whereId(customId).pause();

    // Assert
    await expect(result).to.eventually.be.fulfilled();

    expect(pauseWorkflowFake).to.have.been.calledOnceWithExactly(
      workflowClass,
      customId,
    );
  });

  it("should resume a workflow", async () => {
    // Arrange
    const workflowClass = class TestWorkflow extends AbstractWorkflow {};
    const customId = "45745c60";

    // Act
    const builder = new Builder(workflowClass);
    const result = builder.whereId(customId).resume();

    // Assert
    await expect(result).to.eventually.be.fulfilled();

    expect(resumeWorkflowFake).to.have.been.calledOnceWithExactly(
      workflowClass,
      customId,
    );
  });
});
