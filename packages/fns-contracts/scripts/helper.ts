import { FeeData } from "@ethersproject/providers";
import { keccak256 } from "@ethersproject/keccak256";
import { toUtf8Bytes } from "@ethersproject/strings";
const { BigNumber } = require("@ethersproject/bignumber");

// BlockGasLimit / 10 = 1000000000
export const DefaultGasLimit = 500000000;
const price = 0.5;

export const txParams = (feeData: FeeData) => {
  return {
    gasLimit: DefaultGasLimit,
    maxPriorityFeePerGas: ethers.utils.parseUnits("2", "gwei"),
  };
};

export const RootNode = "0x0000000000000000000000000000000000000000000000000000000000000000";
export const AddressZero = "0x0000000000000000000000000000000000000000";

export const labelhash = (label: string): string => keccak256(toUtf8Bytes(label));

export const isEqualIgnoreCase = (a: string, b: string): boolean => a.toLowerCase() === b.toLowerCase();