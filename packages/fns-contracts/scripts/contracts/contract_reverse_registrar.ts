// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const namehash = require('eth-ens-namehash')
const hre = require("hardhat");
import { txParams, labelhash } from "../helper";


const address = "0x751aeD410cAb124192ab0f5189fb36B99D222F19";
const baseNode = namehash.hash('fil')


async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const deployer = (await ethers.getSigners())[0];
  const provider = deployer.provider!;
  const overrides = txParams(await provider.getFeeData());
  const Contract = await hre.ethers.getContractFactory("ReverseRegistrar");
  const cntract = Contract.attach(address);
  // transaction one
//   const tx = await cntract.setDefaultResolver(
//     "0xbeB0B97A5e238b383f45757dE2e93080DACe0eCb",
//     {
//         ...overrides
//     }
//   );
  const tx = await cntract.setController(
    "0x2667Ae54d789De3bEA1fBEb76dc5624e7e7d09E8",
    true,
    {
        ...overrides
    }
  );

//   const tx = await cntract.setController(
//     "0x8E5996A3963011Ca9dFa04E3CB773147F98C0e17",
//     true,
//     {
//         ...overrides
//     }
//   );

  console.log("Tx hash:", tx.hash);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
