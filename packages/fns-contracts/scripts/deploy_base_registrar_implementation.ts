// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { BigNumber } = require("@ethersproject/bignumber");
const { ethers } = require("hardhat");
const hre = require("hardhat");
const namehash = require('eth-ens-namehash')
import { txParams } from "./helper";


const _fns = "0x6a099BBaD55C2B50c159cAaA4E35B59114a0a941";
const baseNode = namehash.hash('fil')



async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
    const constructorArgs = [
      _fns,
      baseNode,
    ];
    const deployer = (await ethers.getSigners())[0];
    const provider = deployer.provider!;
    const overrides = txParams(await provider.getFeeData());
    const Data = await hre.ethers.getContractFactory("Registrar");
    const data = await Data.deploy(...constructorArgs, {
      ...overrides
    });
    await data.deployed();
    // await hre.run("verify:verify", {
    //     address: "0x55302A5071bA99988E4B6Df0B117e01539D5E870",
    //     constructorArguments: constructorArgs,
    // });
    console.log("Registrar contract deployed to:", data.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
