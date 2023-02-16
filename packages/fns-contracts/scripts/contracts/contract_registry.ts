// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const namehash = require("eth-ens-namehash");
const hre = require("hardhat");
const contentHash = require("content-hash");
import { txParams, labelhash } from "../helper";

const address = "0x6a099BBaD55C2B50c159cAaA4E35B59114a0a941";
const addressTwo = "0xbeB0B97A5e238b383f45757dE2e93080DACe0eCb";
const TldName = "juan.fil";
const TldLable = labelhash(TldName);
const TldNode = namehash.hash(TldName);
const AddrName = `addr.${TldName}`;
const AddrLable = labelhash("addr");
const AddrNode = namehash.hash(AddrName);
const ZERO_HASH =
  "0x0000000000000000000000000000000000000000000000000000000000000000";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const deployer = (await ethers.getSigners())[0];
  const provider = new ethers.providers.JsonRpcProvider(
    "https://filecoin-hyperspace.chainstacklabs.com/rpc/v1"
  );
  const overrides = txParams(provider.getGasPrice());
  const Contract = await hre.ethers.getContractFactory("FNSRegistry");
  const cntract = Contract.attach(address);
  const Contractt = await hre.ethers.getContractFactory("PublicResolver");
  const cntractt = Contractt.attach(addressTwo);

  const checkNode = await cntract.recordExists(TldNode);
  console.log(checkNode);
  const ipfsHash = "QmZYmH5iDbD6v3U2ixoVAjioSzvWJszDzYdbeCLquGSpVm";

  // const contentH = contentHash.fromIpfs(ipfsHash)
  // console.log(contentH);
  // const codec = contentHash.getCodec(contentH)
  // console.log(codec);
  // Get Owner
  // const ownner = await cntract.owner(TldNode);
  // console.log(ownner);
  // Set Subnode Owner
  //   const tx = await cntract.setSubnodeOwner(
  //     ZERO_HASH,
  //     TldLable,
  //     "0x562937835cdD5C92F54B94Df658Fd3b50A68ecD5",
  //     {
  //         ...overrides
  //     }
  //   );
  //   const tx2 = await cntract.setSubnodeOwner(
  //     ZERO_HASH,
  //     AddrLable,
  //     "0xc65e8Be668CC5a2CD1823a44F9D5529bEE73093f",
  //     {
  //         ...overrides
  //     }
  //   );
  //   const tx = await cntract.setSubnodeOwner(
  //     TldNode,
  //     AddrLable,
  //     "0x751aeD410cAb124192ab0f5189fb36B99D222F19",
  //     {
  //         ...overrides
  //     }
  //   );
  // Set Addr for Name
  //   const tx2 = await cntractt["setAddr(bytes32,address)"](
  //     TldNode,
  //     "0xbeB0B97A5e238b383f45757dE2e93080DACe0eCb",
  //     {
  //         ...overrides
  //     }
  //   );

  // Function to set Content Hash
  //     const tx1 = await cntractt.setContenthash(
  //     TldNode,
  //     ethers.utils.toUtf8Bytes(contentHash.fromIpfs(ipfsHash)),
  //     {
  //         ...overrides
  //     }
  //   );

  // function to setAddr
  //   const tx2 = await cntractt['setAddr(bytes32,uint256,bytes)'](
  //     TldNode,
  //     461,
  //     ethers.utils.toUtf8Bytes("0x562937835cdD5C92F54B94Df658Fd3b50A68ecD5"),
  //     {
  //         ...overrides
  //     }
  //   );
  //   console.log("Tx hash:", tx1.hash);
  //   console.log("Tx hash:", tx2.hash);
  // const checkk = await cntract.owner(TldNode);
  // console.log(checkk);

  //function to get addr and contentHash
  const addr = await cntractt["addr(bytes32,uint256)"](TldNode, 461);
  console.log("Your address is ", ethers.utils.toUtf8String(addr));

  const conH = await cntractt.contenthash(TldNode);
  const decodedContent = contentHash.decode(ethers.utils.toUtf8String(conH));
  let cidData = contentHash.getCodec(ethers.utils.toUtf8String(conH));
  if (cidData == "ipfs-ns") {
    cidData = "ipfs://" + decodedContent;
  }
  console.log("Your content CID is ", cidData);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
