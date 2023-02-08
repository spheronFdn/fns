// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { BigNumber } = require("@ethersproject/bignumber");
const { ethers } = require("hardhat");
const hre = require("hardhat");



async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  // console.log(prices)
    const metaHost = "ens-metadata-service.appspot.com";
    const constructorArgs = [
        metaHost,
    ];
    // const Data = await hre.ethers.getContractFactory("StaticMetadataService");
    // const data = await Data.deploy(...constructorArgs);
    // await data.deployed();
    await hre.run("verify:verify", {
        address: "0x7eCF0CEBb24F8AD583e6361B3341592Cb8d1fd9d",
        constructorArguments: constructorArgs,
    });
    // console.log("StaticMetadataService contract deployed to:", data.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
