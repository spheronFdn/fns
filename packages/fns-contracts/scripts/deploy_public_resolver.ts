// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { BigNumber } = require("@ethersproject/bignumber");
const { ethers } = require("hardhat");
const hre = require("hardhat");
import { txParams } from "./helper";


const _fns = "0x6a099BBaD55C2B50c159cAaA4E35B59114a0a941";
const _trustedRegistrarController = "0x2667Ae54d789De3bEA1fBEb76dc5624e7e7d09E8";
const _trustedReverseRegistrar = "0x751aeD410cAb124192ab0f5189fb36B99D222F19";



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
      _trustedRegistrarController,
      _trustedReverseRegistrar
    ];
    const deployer = (await ethers.getSigners())[0];
    const provider = deployer.provider!;
    const overrides = txParams(await provider.getFeeData());
    const Data = await hre.ethers.getContractFactory("PublicResolver");
    const data = await Data.deploy(...constructorArgs, {
      ...overrides
    });
    await data.deployed();
    // await hre.run("verify:verify", {
    //     address: "0x7408e72DaD483859570df578F57f4F61434a8d39",
    //     constructorArguments: constructorArgs,
    // });
    console.log("PublicResolver contract deployed to:", data.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
