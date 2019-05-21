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
          // Arrange
          const data = undefined;

          // Act
          const result = encode(data);

          // Assert
          const expected = { s: [], d: null };
          const expectedAsString = getExpectedAsString(expected);
          expect(result).to.eql(expectedAsString);
        });

        it("should encode 'null' as 'null'", () => {
          // Arrange
          const data = null;

          // Act
          const result = encode(data);

          // Assert
          const expected = { s: [], d: null };
          const expectedAsString = getExpectedAsString(expected);
          expect(result).to.eql(expectedAsString);
        });
      });

      describe("numbers", () => {
        it("should encode a plain number", () => {
          // Arrange
          const data = 42.25;

          // Act
          const result = encode(data);

          // Assert
          const expected = { s: [], d: 42.25 };
          const expectedAsString = getExpectedAsString(expected);
          expect(result).to.eql(expectedAsString);
        });

        it("should encode an object number", () => {
          // Arrange
          // eslint-disable-next-line no-new-wrappers
          const data = new Number(42);

          // Act
          const result = encode(data);

          // Assert
          const expected = { s: [], d: 42 };
          const expectedAsString = getExpectedAsString(expected);
          expect(result).to.eql(expectedAsString);
        });

        it("should encode 'Number.POSITIVE_INFINITY' as 'null'", () => {
          // Arrange
          const data = Number.POSITIVE_INFINITY;

          // Act
          const result = encode(data);

          // Assert
          const expected = { s: [], d: null };
          const expectedAsString = getExpectedAsString(expected);
          expect(result).to.eql(expectedAsString);
        });

        it("should encode 'Number.NEGATIVE_INFINITY' as 'null'", () => {
          // Arrange
          const data = Number.NEGATIVE_INFINITY;

          // Act
          const result = encode(data);

          // Assert
          const expected = { s: [], d: null };
          const expectedAsString = getExpectedAsString(expected);
          expect(result).to.eql(expectedAsString);
        });

        it("should encode 'NaN' as 'null'", () => {
          // Arrange
          const data = NaN;

          // Act
          const result = encode(data);

          // Assert
          const expected = { s: [], d: null };
          const expectedAsString = getExpectedAsString(expected);
          expect(result).to.eql(expectedAsString);
        });
      });

      describe("strings", () => {
        it("should encode a plain string", () => {
          // Arrange
          const data = "foobar";

          // Act
          const result = encode(data);

          // Assert
          const expected = { s: [], d: "foobar" };
          const expectedAsString = getExpectedAsString(expected);
          expect(result).to.eql(expectedAsString);
        });

        it("should encode an object string", () => {
          // Arrange
          // eslint-disable-next-line no-new-wrappers
          const data = new String("foobar");

          // Act
          const result = encode(data);

          // Assert
          const expected = { s: [], d: "foobar" };
          const expectedAsString = getExpectedAsString(expected);
          expect(result).to.eql(expectedAsString);
        });
      });

      describe("booleans", () => {
        it("should encode a plain boolean", () => {
          // Arrange
          const data = true;

          // Act
          const result = encode(data);

          // Assert
          const expected = { s: [], d: true };
          const expectedAsString = getExpectedAsString(expected);
          expect(result).to.eql(expectedAsString);
        });

        it("should encode an object boolean", () => {
          // Arrange
          // eslint-disable-next-line no-new-wrappers
          const data = new Boolean("true");

          // Act
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
          // Arrange
          const data = new Date(Date.UTC(2019, 0, 14, 0, 0, 0));

          // Act
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
          // Arrange
          const data = new Date("2019-01-14T00:00:00.000+04:00");

          // Act
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
          // Arrange
          const data = new Date("Invalid Date");

          // Act
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
          // Arrange
          const data = {
            a: undefined,
            b: null,
            c: 1,
            d: "foobar",
            e: true,
            f: new Date(Date.UTC(2019, 0, 14, 0, 0, 0)),
            g: new Date("Invalid Date"),
            h: () => {},
          };

          // Act
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
          // Arrange
          const data = [
            undefined,
            null,
            1,
            "foobar",
            true,
            new Date(Date.UTC(2019, 0, 14, 0, 0, 0)),
            new Date("Invalid Date"),
          ];

          // Act
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
            // Arrange
            const data = new global[typedArrayClassName]([1, 2, 3]);

            // Act
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
          // Arrange
          const data = new Set([1, 2, 3]);

          // Act
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
          // Arrange
          const data = new Map([["a", 1], ["b", 2], ["c", 3]]);

          // Act
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
          // Arrange
          const data = new PrototypalObject();

          // Act
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
        // Arrange
        const data = [
          {
            foo: new PrototypalObject(),
          },
        ];

        // Act
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
        // Arrange
        const duplicatedObject = { foo: "bar" };
        const data = [duplicatedObject, 12, false, duplicatedObject];

        // Act
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
        // Arrange
        const recursiveArray = [42];
        recursiveArray.push(recursiveArray);
        const data = recursiveArray;

        // Act
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
          // Arrange
          const data = { s: [], d: null };

          // Act
          const dataAsString = getDataAsString(data);
          const result = decode(dataAsString);

          // Assert
          const expected = null;
          expect(result).to.eql(expected);
        });
      });

      describe("numbers", () => {
        it("should decode a plain number", () => {
          // Arrange
          const data = { s: [], d: 123.456 };

          // Act
          const dataAsString = getDataAsString(data);
          const result = decode(dataAsString);

          // Assert
          const expected = 123.456;
          expect(result).to.eql(expected);
        });
      });

      describe("strings", () => {
        it("should decode a plain string", () => {
          // Arrange
          const data = { s: [], d: "foobar" };

          // Act
          const dataAsString = getDataAsString(data);
          const result = decode(dataAsString);

          // Assert
          const expected = "foobar";
          expect(result).to.eql(expected);
        });
      });

      describe("booleans", () => {
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
      });
    });

    describe("objects", () => {
      describe("dates", () => {
        it("should decode an ISO8601 date", () => {
          // Arrange
          const data = {
            s: [
              {
                t: "Date",
                p: { isValid: true, iso8601: "2019-01-13T20:00:00.000Z" },
              },
            ],
            o: "@zenaton#0",
          };

          // Act
          const dataAsString = getDataAsString(data);
          const result = decode(dataAsString);

          // Assert
          const expected = new Date(Date.UTC(2019, 0, 13, 20, 0, 0, 0));
          expect(result).to.eql(expected);
        });

        it("should decode an invalid date", () => {
          // Arrange
          const data = {
            s: [{ t: "Date", p: { isValid: false } }],
            o: "@zenaton#0",
          };

          // Act
          const dataAsString = getDataAsString(data);
          const result = decode(dataAsString);

          // Assert
          const expected = new Date("Invalid Date");
          expect(result).to.eql(expected);
        });
      });

      describe("json literals", () => {
        it("should decode hashmaps", () => {
          // Arrange
          const data = {
            s: [
              {
                k: ["a", "b", "c", "d"],
                v: [null, 12, true, "foobar"],
              },
            ],
            o: "@zenaton#0",
          };

          // Act
          const dataAsString = getDataAsString(data);
          const result = decode(dataAsString);

          // Assert
          const expected = { a: null, b: 12, c: true, d: "foobar" };
          expect(result).to.eql(expected);
        });

        it("should decode arrays", () => {
          // Arrange
          const data = {
            s: [
              {
                v: [null, 12, true, "foobar"],
              },
            ],
            o: "@zenaton#0",
          };

          // Act
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
            // Arrange
            const data = {
              s: [
                {
                  t: typedArrayClassName,
                  v: [1, 2, 3],
                },
              ],
              o: "@zenaton#0",
            };

            // Act
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
          // Arrange
          const data = {
            s: [
              {
                t: "Set",
                v: [1, 2, 3],
              },
            ],
            o: "@zenaton#0",
          };

          // Act
          const dataAsString = getDataAsString(data);
          const result = decode(dataAsString);

          // Assert
          const expected = new Set([1, 2, 3]);
          expect(result).to.eql(expected);
        });
      });

      describe("maps", () => {
        it("should decode Maps", () => {
          // Arrange
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

          // Act
          const dataAsString = getDataAsString(data);
          const result = decode(dataAsString);

          // Assert
          const expected = new Map([["a", 1], ["b", 2], ["c", 3]]);
          expect(result).to.eql(expected);
        });
      });

      describe("prototypal objects", () => {
        it("should decode prototypal objects", () => {
          // Arrange
          const data = {
            s: [
              {
                n: "PrototypalObject",
                p: { a: null, b: 12, c: true, d: "foobar" },
              },
            ],
            o: "@zenaton#0",
          };

          // Act
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
        // Arrange
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

        // Act
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
        // Arrange
        const data = {
          o: "@zenaton#0",
          s: [{ v: ["@zenaton#1", "@zenaton#1"] }, { v: [12] }],
        };

        // Act
        const dataAsString = getDataAsString(data);
        const result = decode(dataAsString);

        // Assert
        const expected = [[12], [12]];
        expect(result).to.eql(expected);
        expect(result[0]).to.equal(result[1]);
      });

      it("should decode recursive arrays", () => {
        // Arrange
        const data = {
          o: "@zenaton#0",
          s: [{ v: [12, "foobar", null, "@zenaton#0"] }],
        };

        // Act
        const dataAsString = getDataAsString(data);
        const result = decode(dataAsString);

        // Assert
        const expected = [12, "foobar", null];
        expected.push(expected);
        expect(result).to.eql(expected);
        expect(result).to.equal(result[3]);
      });

      it("should decode recursive hashmaps values", () => {
        // Arrange
        const data = {
          o: "@zenaton#0",
          s: [
            {
              k: ["a", "b", "c", "d", "e"],
              v: [null, 12, true, "foobar", "@zenaton#0"],
            },
          ],
        };

        // Act
        const dataAsString = getDataAsString(data);
        const result = decode(dataAsString);

        // Assert
        const expected = { a: null, b: 12, c: true, d: "foobar" };
        expected.e = expected;
        expect(result).to.eql(expected);
        expect(result).to.equal(result.e);
      });

      it("should decode recursive Sets values", () => {
        // Arrange
        const data = {
          o: "@zenaton#0",
          s: [{ t: "Set", v: [12, "foobar", null, "@zenaton#0"] }],
        };

        // Act
        const dataAsString = getDataAsString(data);
        const result = decode(dataAsString);

        // Assert
        const expected = new Set([12, "foobar", null]);
        expected.add(expected);
        expect(result).to.eql(expected);
        expect(result.has(result)).to.eql(true);
      });

      it("should decode recursive Maps keys", () => {
        // Arrange
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

        // Act
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
        // Arrange
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

        // Act
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
        // Arrange
        const data = { foo: "bar" };

        // Act
        const dataAsString = getDataAsString(data);
        const result = () => decode(dataAsString);

        // Assert
        expect(result).to.throw("[Serializer] Failed to decode data");
      });

      it("should throw if token cannot be decoded", () => {
        // Arrange
        const data = { o: "@zenaton#0", s: [{ foo: "bar" }] };

        // Act
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
