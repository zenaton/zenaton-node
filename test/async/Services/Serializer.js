const EventEmitter = require("events");
const { expect } = require("chai");

const {
  encode,
  decode,
  CURRENT_VERSION,
} = require("../../../src/async/Services/Serializer");

const TYPED_ARRAYS_CLASS_NAMES = [
  "Int8Array",
  "Int16Array",
  "Int32Array",
  "Float32Array",
  "Float64Array",
  "Uint8Array",
  "Uint8ClampedArray",
  "Uint16Array",
  "Uint32Array",
];

class PrototypalObject {
  constructor() {
    this.a = undefined;
    this.b = null;
    this.c = 1;
    this.d = "foobar";
    this.e = true;
    this.f = new Date(Date.UTC(2019, 0, 14, 0, 0, 0));
    this.g = new Date("Invalid Date");
  }

  dummyMethod() {}
}

describe("Serializer", () => {
  describe("encode", () => {
    function getExpectedAsString(expected) {
      return JSON.stringify({
        v: CURRENT_VERSION,
        ...expected,
      });
    }

    describe("primitives", () => {
      describe("nils", () => {
        it("should encode 'undefined' as 'null'", () => {
          // Act
          const data = undefined;

          // Arrange
          const result = encode(data);

          // Assert
          const expected = { s: [], d: null };
          const expectedAsString = getExpectedAsString(expected);
          expect(result).to.eql(expectedAsString);
        });

        it("should encode 'null' as 'null'", () => {
          // Act
          const data = null;

          // Arrange
          const result = encode(data);

          // Assert
          const expected = { s: [], d: null };
          const expectedAsString = getExpectedAsString(expected);
          expect(result).to.eql(expectedAsString);
        });
      });

      describe("numbers", () => {
        it("should encode a plain number", () => {
          // Act
          const data = 42.25;

          // Arrange
          const result = encode(data);

          // Assert
          const expected = { s: [], d: 42.25 };
          const expectedAsString = getExpectedAsString(expected);
          expect(result).to.eql(expectedAsString);
        });

        it("should encode an object number", () => {
          // Act
          // eslint-disable-next-line no-new-wrappers
          const data = new Number(42);

          // Arrange
          const result = encode(data);

          // Assert
          const expected = { s: [], d: 42 };
          const expectedAsString = getExpectedAsString(expected);
          expect(result).to.eql(expectedAsString);
        });

        it("should encode 'Number.POSITIVE_INFINITY' as 'null'", () => {
          // Act
          const data = Number.POSITIVE_INFINITY;

          // Arrange
          const result = encode(data);

          // Assert
          const expected = { s: [], d: null };
          const expectedAsString = getExpectedAsString(expected);
          expect(result).to.eql(expectedAsString);
        });

        it("should encode 'Number.NEGATIVE_INFINITY' as 'null'", () => {
          // Act
          const data = Number.NEGATIVE_INFINITY;

          // Arrange
          const result = encode(data);

          // Assert
          const expected = { s: [], d: null };
          const expectedAsString = getExpectedAsString(expected);
          expect(result).to.eql(expectedAsString);
        });

        it("should encode 'NaN' as 'null'", () => {
          // Act
          const data = NaN;

          // Arrange
          const result = encode(data);

          // Assert
          const expected = { s: [], d: null };
          const expectedAsString = getExpectedAsString(expected);
          expect(result).to.eql(expectedAsString);
        });
      });

      describe("strings", () => {
        it("should encode a plain string", () => {
          // Act
          const data = "foobar";

          // Arrange
          const result = encode(data);

          // Assert
          const expected = { s: [], d: "foobar" };
          const expectedAsString = getExpectedAsString(expected);
          expect(result).to.eql(expectedAsString);
        });

        it("should encode an object string", () => {
          // Act
          // eslint-disable-next-line no-new-wrappers
          const data = new String("foobar");

          // Arrange
          const result = encode(data);

          // Assert
          const expected = { s: [], d: "foobar" };
          const expectedAsString = getExpectedAsString(expected);
          expect(result).to.eql(expectedAsString);
        });
      });

      describe("booleans", () => {
        it("should encode a plain boolean", () => {
          // Act
          const data = true;

          // Arrange
          const result = encode(data);

          // Assert
          const expected = { s: [], d: true };
          const expectedAsString = getExpectedAsString(expected);
          expect(result).to.eql(expectedAsString);
        });

        it("should encode an object boolean", () => {
          // Act
          // eslint-disable-next-line no-new-wrappers
          const data = new Boolean("true");

          // Arrange
          const result = encode(data);

          // Assert
          const expected = { s: [], d: true };
          const expectedAsString = getExpectedAsString(expected);
          expect(result).to.eql(expectedAsString);
        });
      });
    });

    describe("objects", () => {
      describe("dates", () => {
        it("should encode a UTC date as ISO8601", () => {
          // Act
          const data = new Date(Date.UTC(2019, 0, 14, 0, 0, 0));

          // Arrange
          const result = encode(data);

          // Assert
          const expected = {
            s: [
              {
                t: "Date",
                p: { isValid: true, iso8601: "2019-01-14T00:00:00.000Z" },
              },
            ],
            o: "@zenaton#0",
          };
          const expectedAsString = getExpectedAsString(expected);
          expect(result).to.eql(expectedAsString);
        });

        it("should encode a date with a timezone as ISO8601, not keeping the timezone", () => {
          // Act
          const data = new Date("2019-01-14T00:00:00.000+04:00");

          // Arrange
          const result = encode(data);

          // Assert
          const expected = {
            s: [
              {
                t: "Date",
                p: { isValid: true, iso8601: "2019-01-13T20:00:00.000Z" },
              },
            ],
            o: "@zenaton#0",
          };
          const expectedAsString = getExpectedAsString(expected);
          expect(result).to.eql(expectedAsString);
        });

        it("should encode an invalid date", () => {
          // Act
          const data = new Date("Invalid Date");

          // Arrange
          const result = encode(data);

          // Assert
          const expected = {
            s: [{ t: "Date", p: { isValid: false } }],
            o: "@zenaton#0",
          };
          const expectedAsString = getExpectedAsString(expected);
          expect(result).to.eql(expectedAsString);
        });
      });

      describe("json literals", () => {
        it("should encode hashmaps", () => {
          // Act
          const data = {
            a: undefined,
            b: null,
            c: 1,
            d: "foobar",
            e: true,
            f: new Date(Date.UTC(2019, 0, 14, 0, 0, 0)),
            g: new Date("Invalid Date"),
          };

          // Arrange
          const result = encode(data);

          // Assert
          const expected = {
            s: [
              {
                k: ["a", "b", "c", "d", "e", "f", "g"],
                v: [null, null, 1, "foobar", true, "@zenaton#1", "@zenaton#2"],
              },
              {
                t: "Date",
                p: { isValid: true, iso8601: "2019-01-14T00:00:00.000Z" },
              },
              {
                t: "Date",
                p: { isValid: false },
              },
            ],
            o: "@zenaton#0",
          };
          const expectedAsString = getExpectedAsString(expected);
          expect(result).to.eql(expectedAsString);
        });

        it("should encode arrays", () => {
          // Act
          const data = [
            undefined,
            null,
            1,
            "foobar",
            true,
            new Date(Date.UTC(2019, 0, 14, 0, 0, 0)),
            new Date("Invalid Date"),
          ];

          // Arrange
          const result = encode(data);

          // Assert
          const expected = {
            s: [
              {
                v: [null, null, 1, "foobar", true, "@zenaton#1", "@zenaton#2"],
              },
              {
                t: "Date",
                p: { isValid: true, iso8601: "2019-01-14T00:00:00.000Z" },
              },
              {
                t: "Date",
                p: { isValid: false },
              },
            ],
            o: "@zenaton#0",
          };
          const expectedAsString = getExpectedAsString(expected);
          expect(result).to.eql(expectedAsString);
        });
      });

      describe("typed arrays", () => {
        TYPED_ARRAYS_CLASS_NAMES.forEach((typedArrayClassName) => {
          it(`should encode typed array '${typedArrayClassName}'`, () => {
            // Act
            const data = new global[typedArrayClassName]([1, 2, 3]);

            // Arrange
            const result = encode(data);

            // Assert
            const expected = {
              s: [
                {
                  t: typedArrayClassName,
                  v: [1, 2, 3],
                },
              ],
              o: "@zenaton#0",
            };
            const expectedAsString = getExpectedAsString(expected);
            expect(result).to.eql(expectedAsString);
          });
        });
      });

      describe("sets", () => {
        it("should encode Sets", () => {
          // Act
          const data = new Set([1, 2, 3]);

          // Arrange
          const result = encode(data);

          // Assert
          const expected = {
            s: [
              {
                t: "Set",
                v: [1, 2, 3],
              },
            ],
            o: "@zenaton#0",
          };
          const expectedAsString = getExpectedAsString(expected);
          expect(result).to.eql(expectedAsString);
        });
      });

      describe("maps", () => {
        it("should encode Maps", () => {
          // Act
          const data = new Map([["a", 1], ["b", 2], ["c", 3]]);

          // Arrange
          const result = encode(data);

          // Assert
          const expected = {
            s: [
              {
                t: "Map",
                k: ["a", "b", "c"],
                v: [1, 2, 3],
              },
            ],
            o: "@zenaton#0",
          };
          const expectedAsString = getExpectedAsString(expected);
          expect(result).to.eql(expectedAsString);
        });
      });

      describe("prototypal objects", () => {
        it("should encode prototypal objects", () => {
          // Act
          const data = new PrototypalObject();

          // Arrange
          const result = encode(data);

          // Assert
          const expected = {
            s: [
              {
                n: "PrototypalObject",
                p: {
                  a: null,
                  b: null,
                  c: 1,
                  d: "foobar",
                  e: true,
                  f: "@zenaton#1",
                  g: "@zenaton#2",
                },
              },
              {
                t: "Date",
                p: { isValid: true, iso8601: "2019-01-14T00:00:00.000Z" },
              },
              {
                t: "Date",
                p: { isValid: false },
              },
            ],
            o: "@zenaton#0",
          };
          const expectedAsString = getExpectedAsString(expected);
          expect(result).to.eql(expectedAsString);
        });
      });
    });

    describe("store behavior", () => {
      it("shoud encode deep trees with complex objects of various types", () => {
        // Act
        const data = [
          {
            foo: new PrototypalObject(),
          },
        ];

        // Arrange
        const result = encode(data);

        // Assert
        const expected = {
          s: [
            { v: ["@zenaton#1"] },
            { k: ["foo"], v: ["@zenaton#2"] },
            {
              n: "PrototypalObject",
              p: {
                a: null,
                b: null,
                c: 1,
                d: "foobar",
                e: true,
                f: "@zenaton#3",
                g: "@zenaton#4",
              },
            },
            {
              t: "Date",
              p: { isValid: true, iso8601: "2019-01-14T00:00:00.000Z" },
            },
            {
              t: "Date",
              p: { isValid: false },
            },
          ],
          o: "@zenaton#0",
        };
        const expectedAsString = getExpectedAsString(expected);
        expect(result).to.eql(expectedAsString);
      });

      it("should store only once duplicated object", () => {
        // Act
        const duplicatedObject = { foo: "bar" };
        const data = [duplicatedObject, 12, false, duplicatedObject];

        // Arrange
        const result = encode(data);

        // Assert
        const expected = {
          s: [
            {
              v: ["@zenaton#1", 12, false, "@zenaton#1"],
            },
            {
              k: ["foo"],
              v: ["bar"],
            },
          ],
          o: "@zenaton#0",
        };
        const expectedAsString = getExpectedAsString(expected);
        expect(result).to.eql(expectedAsString);
      });

      it("should handle recursion", () => {
        // Act
        const recursiveArray = [42];
        recursiveArray.push(recursiveArray);
        const data = recursiveArray;

        // Arrange
        const result = encode(data);

        // Assert
        const expected = {
          s: [
            {
              v: [42, "@zenaton#0"],
            },
          ],
          o: "@zenaton#0",
        };
        const expectedAsString = getExpectedAsString(expected);
        expect(result).to.eql(expectedAsString);
      });
    });

    describe("miscellaneous", () => {
      it("should ignore functions", () => {
        // Arrange
        const data = () => {};

        // Act
        const result = encode(data);

        // Assert
        const expected = {
          s: [],
          d: null,
        };
        const expectedAsString = getExpectedAsString(expected);
        expect(result).to.eql(expectedAsString);
      });

      it("should ignore symbols", () => {
        // Arrange
        const data = Symbol.iterator;

        // Act
        const result = encode(data);

        // Assert
        const expected = {
          s: [],
          d: null,
        };
        const expectedAsString = getExpectedAsString(expected);
        expect(result).to.eql(expectedAsString);
      });

      it("should ignore event emitters", () => {
        // Arrange
        const data = new EventEmitter();

        // Act
        const result = encode(data);

        // Assert
        const expected = {
          s: [],
          d: null,
        };
        const expectedAsString = getExpectedAsString(expected);
        expect(result).to.eql(expectedAsString);
      });
    });
  });

  describe("decode", () => {
    function getDataAsString(data) {
      return JSON.stringify({
        ...data,
        v: CURRENT_VERSION,
      });
    }

    describe("primitives", () => {
      describe("nils", () => {
        it("should decode 'null' as 'null'", () => {
          // Act
          const data = { s: [], d: null };

          // Arrange
          const dataAsString = getDataAsString(data);
          const result = decode(dataAsString);

          // Assert
          const expected = null;
          expect(result).to.eql(expected);
        });
      });

      describe("numbers", () => {
        it("should decode a plain number", () => {
          // Act
          const data = { s: [], d: 123.456 };

          // Arrange
          const dataAsString = getDataAsString(data);
          const result = decode(dataAsString);

          // Assert
          const expected = 123.456;
          expect(result).to.eql(expected);
        });
      });

      describe("strings", () => {
        it("should decode a plain string", () => {
          // Act
          const data = { s: [], d: "foobar" };

          // Arrange
          const dataAsString = getDataAsString(data);
          const result = decode(dataAsString);

          // Assert
          const expected = "foobar";
          expect(result).to.eql(expected);
        });
      });

      describe("booleans", () => {
        it("should decode a plain boolean", () => {
          // Act
          const data = { s: [], d: true };

          // Arrange
          const dataAsString = getDataAsString(data);
          const result = decode(dataAsString);

          // Assert
          const expected = true;
          expect(result).to.eql(expected);
        });
      });
    });

    describe("objects", () => {
      describe("dates", () => {
        it("should decode an ISO8601 date", () => {
          // Act
          const data = {
            s: [
              {
                t: "Date",
                p: { isValid: true, iso8601: "2019-01-13T20:00:00.000Z" },
              },
            ],
            o: "@zenaton#0",
          };

          // Arrange
          const dataAsString = getDataAsString(data);
          const result = decode(dataAsString);

          // Assert
          const expected = new Date(Date.UTC(2019, 0, 13, 20, 0, 0, 0));
          expect(result).to.eql(expected);
        });

        it("should decode an invalid date", () => {
          // Act
          const data = {
            s: [{ t: "Date", p: { isValid: false } }],
            o: "@zenaton#0",
          };

          // Arrange
          const dataAsString = getDataAsString(data);
          const result = decode(dataAsString);

          // Assert
          const expected = new Date("Invalid Date");
          expect(result).to.eql(expected);
        });
      });

      describe("json literals", () => {
        it("should decode hashmaps", () => {
          // Act
          const data = {
            s: [
              {
                k: ["a", "b", "c", "d"],
                v: [null, 12, true, "foobar"],
              },
            ],
            o: "@zenaton#0",
          };

          // Arrange
          const dataAsString = getDataAsString(data);
          const result = decode(dataAsString);

          // Assert
          const expected = { a: null, b: 12, c: true, d: "foobar" };
          expect(result).to.eql(expected);
        });

        it("should decode arrays", () => {
          // Act
          const data = {
            s: [
              {
                v: [null, 12, true, "foobar"],
              },
            ],
            o: "@zenaton#0",
          };

          // Arrange
          const dataAsString = getDataAsString(data);
          const result = decode(dataAsString);

          // Assert
          const expected = [null, 12, true, "foobar"];
          expect(result).to.eql(expected);
        });
      });

      describe("typed arrays", () => {
        TYPED_ARRAYS_CLASS_NAMES.forEach((typedArrayClassName) => {
          it(`should decode typed array '${typedArrayClassName}'`, () => {
            // Act
            const data = {
              s: [
                {
                  t: typedArrayClassName,
                  v: [1, 2, 3],
                },
              ],
              o: "@zenaton#0",
            };

            // Arrange
            const dataAsString = getDataAsString(data);
            const result = decode(dataAsString);

            // Assert
            const expected = new global[typedArrayClassName]([1, 2, 3]);
            expect(result).to.eql(expected);
          });
        });
      });

      describe("sets", () => {
        it("should decode Sets", () => {
          // Act
          const data = {
            s: [
              {
                t: "Set",
                v: [1, 2, 3],
              },
            ],
            o: "@zenaton#0",
          };

          // Arrange
          const dataAsString = getDataAsString(data);
          const result = decode(dataAsString);

          // Assert
          const expected = new Set([1, 2, 3]);
          expect(result).to.eql(expected);
        });
      });

      describe("maps", () => {
        it("should decode Maps", () => {
          // Act
          const data = {
            s: [
              {
                t: "Map",
                k: ["a", "b", "c"],
                v: [1, 2, 3],
              },
            ],
            o: "@zenaton#0",
          };

          // Arrange
          const dataAsString = getDataAsString(data);
          const result = decode(dataAsString);

          // Assert
          const expected = new Map([["a", 1], ["b", 2], ["c", 3]]);
          expect(result).to.eql(expected);
        });
      });

      describe("prototypal objects", () => {
        it("should decode prototypal objects", () => {
          // Act
          const data = {
            s: [
              {
                n: "PrototypalObject",
                p: { a: null, b: 12, c: true, d: "foobar" },
              },
            ],
            o: "@zenaton#0",
          };

          // Arrange
          const dataAsString = getDataAsString(data);
          const result = decode(dataAsString);

          // Assert
          const expected = { a: null, b: 12, c: true, d: "foobar" };
          expect(result).to.eql(expected);
          expect(result.constructor.name).to.eql("PrototypalObject");
        });
      });
    });

    describe("store behavior", () => {
      it("should decode deep trees with complex objects of various types", () => {
        // Act
        const data = {
          o: "@zenaton#0",
          s: [
            { v: ["@zenaton#1"] },
            { k: ["foo"], v: ["@zenaton#2"] },
            {
              n: "PrototypalObject",
              p: {
                foo: "@zenaton#3",
                bar: "@zenaton#4",
              },
            },
            { t: "Int32Array", v: [1, 2, 3] },
            {
              t: "Date",
              p: { isValid: true, iso8601: "2019-01-13T20:00:00.000Z" },
            },
          ],
        };

        // Arrange
        const dataAsString = getDataAsString(data);
        const result = decode(dataAsString);

        // Assert
        const expected = [
          {
            foo: {
              foo: new Int32Array([1, 2, 3]),
              bar: new Date(Date.UTC(2019, 0, 13, 20, 0, 0, 0)),
            },
          },
        ];
        expect(result).to.eql(expected);
        expect(result[0].foo.constructor.name).to.eql("PrototypalObject");
        expect(result[0].foo.foo.constructor.name).to.eql("Int32Array");
        expect(result[0].foo.bar.constructor.name).to.eql("Date");
      });

      it("should create only one instance of a stored object used in two places", () => {
        // Act
        const data = {
          o: "@zenaton#0",
          s: [{ v: ["@zenaton#1", "@zenaton#1"] }, { v: [12] }],
        };

        // Arrange
        const dataAsString = getDataAsString(data);
        const result = decode(dataAsString);

        // Assert
        const expected = [[12], [12]];
        expect(result).to.eql(expected);
        expect(result[0]).to.equal(result[1]);
      });

      it("should decode recursive arrays", () => {
        // Act
        const data = {
          o: "@zenaton#0",
          s: [{ v: [12, "foobar", null, "@zenaton#0"] }],
        };

        // Arrange
        const dataAsString = getDataAsString(data);
        const result = decode(dataAsString);

        // Assert
        const expected = [12, "foobar", null];
        expected.push(expected);
        expect(result).to.eql(expected);
        expect(result).to.equal(result[3]);
      });

      it("should decode recursive hashmaps values", () => {
        // Act
        const data = {
          o: "@zenaton#0",
          s: [
            {
              k: ["a", "b", "c", "d", "e"],
              v: [null, 12, true, "foobar", "@zenaton#0"],
            },
          ],
        };

        // Arrange
        const dataAsString = getDataAsString(data);
        const result = decode(dataAsString);

        // Assert
        const expected = { a: null, b: 12, c: true, d: "foobar" };
        expected.e = expected;
        expect(result).to.eql(expected);
        expect(result).to.equal(result.e);
      });

      it("should decode recursive Sets values", () => {
        // Act
        const data = {
          o: "@zenaton#0",
          s: [{ t: "Set", v: [12, "foobar", null, "@zenaton#0"] }],
        };

        // Arrange
        const dataAsString = getDataAsString(data);
        const result = decode(dataAsString);

        // Assert
        const expected = new Set([12, "foobar", null]);
        expected.add(expected);
        expect(result).to.eql(expected);
        expect(result.has(result)).to.eql(true);
      });

      it("should decode recursive Maps keys", () => {
        // Act
        const data = {
          o: "@zenaton#0",
          s: [
            {
              t: "Map",
              k: ["a", "b", "c", "d", "@zenaton#0"],
              v: [null, 12, true, "foobar", 42],
            },
          ],
        };

        // Arrange
        const dataAsString = getDataAsString(data);
        const result = decode(dataAsString);

        // Assert
        const expected = new Map([
          ["a", null],
          ["b", 12],
          ["c", true],
          ["d", "foobar"],
        ]);
        expected.set(expected, 42);
        expect(result).to.eql(expected);
        expect(result.get(result)).to.eql(42);
      });

      it("should decode recursive prototypal objects values", () => {
        // Act
        const data = {
          s: [
            {
              n: "PrototypalObject",
              p: {
                a: null,
                b: 12,
                c: true,
                d: "foobar",
                e: "@zenaton#0",
              },
            },
          ],
          o: "@zenaton#0",
        };

        // Arrange
        const dataAsString = getDataAsString(data);
        const result = decode(dataAsString);

        // Assert
        const expected = {
          a: null,
          b: 12,
          c: true,
          d: "foobar",
        };
        expected.e = expected;
        expect(result).to.eql(expected);
        expect(result).to.equal(result.e);
      });
    });

    describe("forbidden", () => {
      it("should throw when data makes no sense", () => {
        // Act
        const data = { foo: "bar" };

        // Arrange
        const dataAsString = getDataAsString(data);
        const result = () => decode(dataAsString);

        // Assert
        expect(result).to.throw("[Serializer] Failed to decode data");
      });

      it("should throw if token cannot be decoded", () => {
        // Act
        const data = { o: "@zenaton#0", s: [{ foo: "bar" }] };

        // Arrange
        const dataAsString = getDataAsString(data);
        const result = () => decode(dataAsString);

        // Assert
        expect(result).to.throw(
          "[Serializer] Failed to decode token '@zenaton#0'",
        );
      });
    });
  });
});
