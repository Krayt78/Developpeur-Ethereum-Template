const SimpleStorage = artifacts.require("SimpleStorage");

module.exports = async function (param) {
  const instance = await SimpleStorage.deployed();
  await instance.set(6);
  const value = await instance.get();
  console.log(value);
};
