// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const namehash = require('eth-ens-namehash')
const hre = require("hardhat");
import { txParams, labelhash, AddressZero } from "../helper";


const address = "0x2667Ae54d789De3bEA1fBEb76dc5624e7e7d09E8";
const baseNode = namehash.hash('fil')
const ReserveNames = ["resolver", "fns", "spheron", "sphwallet"];
const ReserveDuration = 3600 * 24 * 90;


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
  const Contract = await hre.ethers.getContractFactory("RegistrarController");
  const cntract = Contract.attach(address);
  const price = 3;


  const isAvailable = await cntract.available("vitalik");
  console.log("is this name available? ", isAvailable);

//   const checkNode = await cntract.baseNode();
//   console.log(checkNode);
  // first transaction
//   const tx = await cntract.addController(
//     "0x37a08cC87B67ee1fb9c56A2f57509Cb7dcf9685F",
//     {
//         ...overrides
//     }
//   );

// second transaction
//   const tx = await cntract.addController(
//     "0x562937835cdD5C92F54B94Df658Fd3b50A68ecD5",
//     {
//         ...overrides
//     }
//   );

// third transaction

//   const tx = await cntract.setResolver(
//     "0x8E5996A3963011Ca9dFa04E3CB773147F98C0e17",
//     {
//         ...overrides
//     }
//   );

  // const tx = await cntract.register(
  //   "vitalik",
  //   "0x562937835cdD5C92F54B94Df658Fd3b50A68ecD5",
  //   ReserveDuration,
  //   "0xbeB0B97A5e238b383f45757dE2e93080DACe0eCb",
  //   [],
  //   true,
  //   {
  //       value: ethers.utils.parseEther(price.toString()),
  //       ...overrides
  //   }
  // );


  // const tx = await cntract.setPriceOracle(
  //   "0x086B7C8372837C183369dB37b8d9e045e606556e",
  //   {
  //       ...overrides
  //   }
  // );
// const namme = await cntract.costName();
// console.log(namme);
// const nammme = await cntract.moneyName();
// console.log(nammme);

  // console.log("Tx hash:", tx.hash);
  // console.log(ReserveDuration);
  // const yes = await cntract.available("abrahamarome")
  // console.log("Name available? ", yes);
//fourth transaction

// for (const name of ReserveNames) {
//         const id = labelhash(name);
//         if (!await cntract.available(id)) {
//           continue;
//         }
//         console.log(`Register reserve name: ${name} ...`);
//         const tx = await cntract.register(
//             name,
//             "0x562937835cdD5C92F54B94Df658Fd3b50A68ecD5",
//             ReserveDuration,
//             AddressZero, {
//                 ...overrides
//             }
//         );
//         console.log(`> tx: ${tx.hash}`);
//       }
}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
