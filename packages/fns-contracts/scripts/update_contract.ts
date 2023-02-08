// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
// import { keccak256, namehash, toUtf8Bytes } from "ethers/lib/utils";
import { keccak256 } from "@ethersproject/keccak256";
import { toUtf8Bytes } from "@ethersproject/strings";
import { contracts } from "../typechain-types";
const { BigNumber } = require("@ethersproject/bignumber");
const namehash = require('eth-ens-namehash')
const hre = require("hardhat");
import { txParams, labelhash } from "./helper";


const address = "0x751aeD410cAb124192ab0f5189fb36B99D222F19";
const addressTwo = "0xbeB0B97A5e238b383f45757dE2e93080DACe0eCb";
const baseNode = namehash.hash('test')


const TldName = "fil";
const TldLable = labelhash(TldName);
const TldNode = namehash.hash(TldName);
const AddrName = `addr.${TldName}`;
// const AddrLable = labelhash("addr");
// const AddrNode = namehash(AddrName);


const TldNameAlt = "fil";
const TldLabel = labelhash(TldName);
// const TldNodeAlt = namehash(TldName);
const ReserveNames = ["manank", "mitra"];
const ReserveDuration = 3600 * 24 * 30;

const nh = namehash.hash('fil');
// const labelhash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(tld));
const managers = ["0xbae1b2c5ecd83c00bad64d45492750b978214a61"];
const escrow = "0x97F5aE30eEdd5C3c531C97E41386618b1831Cb7b";
const resolverLabel = labelhash("resolver");
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const ZERO_HASH = "0x0000000000000000000000000000000000000000000000000000000000000000";

const tokenName = ["WETH", "WMATIC", "USDT", "DAI"];
const tokenAddresses = [
  "0xB20Ca4FD8C23B0ff8259EcDF6F3232A589562CdC",
  "0x960d7D3aD51CbFe74CF61a5c882C9020DF50a18d",
  "0x36fEe18b265FBf21A89AD63ea158F342a7C64abB",
  "0xf0728Bfe68B96Eb241603994de44aBC2412548bE",
];
const tokenDecimals = [18, 18, 6, 18];
const isChainlink = [true, true, true, true];
const priceFeedAddresses = [
  "0x0715A7794a1dc8e42615F059dD6e406A6594651A",
  "0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada",
  "0x92C09849638959196E976289418e5973CC96d645",
  "0x0FCAa9c899EC5A91eBc3D5Dd869De833b06fB046",
];
const priceFeedPrecisions = [8, 8, 8, 8];

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
  const cntraact = Contract.attach(address);
  const price = 9.4608;

    // const tess = await cntraact.rentPrice("legendarome", ReserveDuration);
    // const basePrice = (BigNumber.from(tess.base));
    // basePrice.add(tess.premium);
    // console.log("totalPrice", basePrice);
  const Contractt = await hre.ethers.getContractFactory("PublicResolver");
  const cntraactt = Contractt.attach(addressTwo);
//   const tryit = await cntraact.resolver("0x78f6b1389af563cc5c91f234ea46b055e49658d8b999eeb9e0baef7dbbc93fdb", {
//     ...overrides
//   });
//   console.log(tryit);
  const txxx = await cntraact.node("0x562937835cdD5C92F54B94Df658Fd3b50A68ecD5");
//   console.log(txxx);
  const xxt = await cntraactt.name(txxx);
  console.log("Reserve resolver name for address : ", xxt);

//   const tx2 = await cntraact.setResolver(
//     TldNode,
//     "0x032666197A5d9329e717800FC90E8C951bA12290",
//     {
//         ...overrides
//     }
//   );
//   for (const name of ReserveNames) {
//     const id = labelhash(name);
//     if (!await cntraact.available(id)) {
//       continue;
//     }
//     console.log(`Register reserve name: ${name} ...`);
//     const tx = await cntraact.register(
//         name,
//         "0x562937835cdD5C92F54B94Df658Fd3b50A68ecD5",
//         ReserveDuration,
//         ZERO_ADDRESS, {
//             ...overrides
//         }
//     );
//     console.log(`> tx: ${tx.hash}`);
//   }
// const baseDetails = await cntraact.available("legendarome");
// console.log("baseDetails", baseDetails);
// const baseRentprice = await cntraact.rentPrice("legendarome", ReserveDuration);
// console.log("baseRentprice", BigNumber.from(baseRentprice));
//   const id = labelhash("manank");
//   const status = await cntraact.available(id);
//   console.log("Status", status);

//   const tx = await cntraact.owner();

//   console.log(tx);
//   const tx2 = await cntraact.recordExists(baseNode);
//   console.log("tx", tx2);
//   console.log(tx)
  
//   console.log("Tx hash:", tx.hash);
//   console.log("Tx hash:", tx2.hash);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
