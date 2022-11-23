/** @type import('hardhat/config').HardhatUserConfig */

require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.16",
  networks: {
    hardhat: {
      forking: {
        url: "https://eth-mainnet.g.alchemy.com/v2/7WlHnUL9mHzJ2-JFkRj3s7lSJ7-XZMlH",
      },
    },
  },
};
