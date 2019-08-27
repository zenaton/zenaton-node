const proxyquire = require("proxyquire");
const { expect } = require("chai");
const sinon = require("sinon");

proxyquire.noPreserveCache();

describe("Parallel", () => {
  let dispatchFake;
  let executeFake;

  let Parallel;

  beforeEach(() => {
    dispatchFake = sinon.fake.resolves([
      Promise.resolve(1),
      Promise.resolve(2),
      Promise.resolve(3),
    ]);
    executeFake = sinon.fake.resolves([
      Promise.resolve(1),
      Promise.resolve(2),
      Promise.resolve(3),
    ]);

    const engineStub = function engineStub() {
      this.dispatch = dispatchFake;
      this.execute = executeFake;
    };

    Parallel = proxyquire("../../../src/Code/async/Parallel/Parallel", {
      "../Engine/Engine": engineStub,
    });
  });

  it("should forward items to engine for dispatching", async () => {
    // Act
    const parallel = new Parallel(1, 2, 3);
    const result = parallel.dispatch();

    // Assert
    await expect(result)
      .to.eventually.be.fulfilled()
      .and.to.eql([undefined, undefined, undefined]);

    expect(dispatchFake).to.have.been.calledOnceWithExactly([1, 2, 3]);
  });

  it("should forward items to engine for execution", async () => {
    // Act
    const parallel = new Parallel(1, 2, 3);
    const result = parallel.execute();

    // Assert
    await expect(result)
      .to.eventually.be.fulfilled()
      .and.to.eql([1, 2, 3]);

    expect(executeFake).to.have.been.calledOnceWithExactly([1, 2, 3]);
  });
});
