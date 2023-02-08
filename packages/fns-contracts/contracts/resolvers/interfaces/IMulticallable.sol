// SPDX-License-Identifier: MIT
pragma solidity >=0.8.17 <0.9.0;

interface IMulticallable {
    function multicall(bytes[] calldata data)
        external
        returns (bytes[] memory results);

    function multicallWithNodeCheck(bytes32, bytes[] calldata data)
        external
        returns (bytes[] memory results);
}