const { expect } = require("chai");

const {
  decode,
  CURRENT_VERSION,
} = require("../../../src/Code/yield/Services/Serializer");

describe("Decode Serializer for yield path", () => {
  function getDataAsString(data) {
    return JSON.stringify({
      ...data,
      v: CURRENT_VERSION,
    });
  }

  it("should decode a plain boolean", () => {
    // Arrange
    const data = { s: [], d: true };

    // Act
    const dataAsString = getDataAsString(data);
    const result = decode(dataAsString);

    // Assert
    const expected = true;
    expect(result).to.eql(expected);
  });

  it("should decode arrays from Zenaton serialization", () => {
    const data = {
      s: [
        {
          v: [null, 12, true, "foobar"],
        },
      ],
      o: "@zenaton#0",
    };

    const dataAsString = getDataAsString(data);
    const result = decode(dataAsString);

    const expected = [null, 12, true, "foobar"];

    expect(result).to.eql(expected);
  });

  it("should decode JSON", () => {
    const data = {
      user: {
        name: "Louis Cibot",
        age: 25,
        sex: "M",
      },
    };

    const dataAsString = JSON.stringify(data);
    const result = decode(dataAsString);

    const expected = data;

    expect(result).to.eql(expected);
  });
});
