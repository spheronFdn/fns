require("@nomicfoundation/hardhat-toolbox");
require("hardhat-gas-reporter");
require("hardhat-contract-sizer");
const dotenv = require("dotenv");
dotenv.config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
  networks: {
    hyperspace: {
      url: 'https://filecoin-hyperspace.chainstacklabs.com/rpc/v1',
      accounts: [process.env.DEPLOYER_KEY],
    },
    goerli: {
      url: `https://eth-goerli.public.blastapi.io`, // <---- YOUR INFURA ID! (or it won't work)
      accounts: [process.env.DEPLOYER_KEY],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  gasReporter: {
    enabled: true,
  },
  contractSizer: {
    alphaSort: true,
    runOnCompile: true,
    disambiguatePaths: false,
  },
};
