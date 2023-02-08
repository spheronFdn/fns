// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { BigNumber } = require("@ethersproject/bignumber");
const { ethers } = require("hardhat");
const hre = require("hardhat");
import { txParams } from "./helper";



async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  // console.log(prices)
    const deployer = (await ethers.getSigners())[0];
    const provider = deployer.provider!;
    const feeData = await provider.getFeeData();
    const Data = await hre.ethers.getContractFactory("StablePriceOracle");
    const data = await Data.deploy({
      ...txParams(feeData)
    });
    await data.deployed();
    // await hre.run("verify:verify", {
    //     address: "0xED18503D82aeaa71A2333b88F78E68a9F53b62b3",
    //     // constructorArguments: constructorArgs,
    // });
    console.log("StablePriceOracle contract deployed to:", data.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
