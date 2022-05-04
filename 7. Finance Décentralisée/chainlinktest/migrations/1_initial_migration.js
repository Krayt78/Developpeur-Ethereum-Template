const Migrations = artifacts.require("Chainlink2");

module.exports = function (deployer) {
  deployer.deploy(Chainlink2,);
};
