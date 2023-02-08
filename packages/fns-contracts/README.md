Filecoin Naming Service(FNS) - Contracts

A smart contract for a decentralized naming service for Filecoin Chain.

Purpose

The purpose of this smart contract is to provide a decentralized and trustless system for mapping human-readable names to FEVM addresses. This allows for easy and memorable access to addresses without having to remember long and complex strings of characters.

Features

Registering and updating names
Resolving names to Ethereum addresses
Managing ownership of names


Usage

To use the naming service, simply call the appropriate functions on the smart contract. The functions include:

registerName(name, address): Register a new name to an Ethereum address.
updateName(name, address): Update the Ethereum address associated with a name.
resolveName(name): Resolve a name to its associated Ethereum address.


The smart contract can be deployed to the Hyperspace network using a tool such as Hardhat.

npx hardhat --network hyperspace run scripts/deploy_reverse_registrar.ts


npx hardhat --network hyperspace run scripts/contracts/contract_registrar.ts 


Limitations

The smart contract is currently only compatible with the EVM Chains.


Contributions

Contributions to the smart contract are welcome. Please open a pull request or issue on the Github repository for this project.