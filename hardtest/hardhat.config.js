require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const INfURA_url='https://kovan.infura.io/v3/a7982ca1dd3a49d79680f309d310a933';
const privatekey='ee53d625830039c17e02e60ea07150b76f919394f18f08d636efcd5673757cfd';
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks:{
    ropsten:{
      url:INfURA_url,
      accounts:[privatekey],
    }}};
