// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { BigNumber } = require("@ethersproject/bignumber");
const { ethers } = require("hardhat");
const hre = require("hardhat");
import { txParams } from "./helper";


const _registrar = "0x480D84AADf8B72929de7b99C9708bf58506b8568";
const _prices = "0x1bAdE58957af002A87653af0242627914397e7A1";
const _reverseRegistrar = "0x751aeD410cAb124192ab0f5189fb36B99D222F19";



async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
    const constructorArgs = [
      _registrar,
      _prices,
      _reverseRegistrar
    ];
    const deployer = (await ethers.getSigners())[0];
    const provider = deployer.provider!;
    const overrides = txParams(await provider.getFeeData());
    const Data = await hre.ethers.getContractFactory("RegistrarController");
    const data = await Data.deploy(...constructorArgs, {
      ...overrides
    });
    await data.deployed();
    // await hre.run("verify:verify", {
    //     address: "0x4549a91b4727537372925C8C589d9BCfF9B6c261",
    //     constructorArguments: constructorArgs,
    // });
    console.log("RegistrarController contract deployed to:", data.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
