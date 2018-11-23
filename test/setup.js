const chai = require("chai");
const dirtyChai = require("dirty-chai");
const chaiAsPromised = require("chai-as-promised");
const sinonChai = require("sinon-chai");

chai.use(chaiAsPromised);
chai.use(dirtyChai);
chai.use(sinonChai);
