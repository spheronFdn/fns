<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://github.com/spheronFdn/fns/blob/main/.github/assets/spheron-logo-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://github.com/spheronFdn/fns/blob/main/.github/assets/spheron-logo.svg">
    <img alt="Spheron" src="https://github.com/spheronFdn/fns/blob/main/.github/assets/spheron-logo.svg" width="250">
  </picture>
</p>
<p align="center">
  🧰 <a href="https://www.npmjs.com/package/@spheron/fnslib">FNSlib</a> is the ultimate solution for working with the FNS(.fil) on the FEVM chain. Powered by Spheron.
  <br>
  It is built with
  <a href="https://github.com/ethers-io/ethers.js">ethers.js</a>
  at its core, and inspired by and modelled on the
  <a href="https://github.com/ensdomains/ensjs-v3">ENS Package</a>.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@spheron/fnslib" target="_blank" rel="noreferrer">
    <img src="https://img.shields.io/static/v1?label=npm&message=v1.0.20&color=red" />
  </a>
  <a href="https://github.com/spheronFdn/fns/blob/main/LICENSE" target="_blank" rel="noreferrer">
    <img src="https://img.shields.io/static/v1?label=license&message=MIT&color=green" />
  </a>
  <a href="https://discord.com/invite/ahxuCtm" target="_blank" rel="noreferrer">
    <img src="https://img.shields.io/static/v1?label=community&message=discord&color=blue" />
  </a>
  <a href="https://twitter.com/SpheronFdn" target="_blank" rel="noreferrer">
    <img src="https://img.shields.io/twitter/url/https/twitter.com/cloudposse.svg?style=social&label=Follow%20%40SpheronFdn" />
  </a>
</p>

## NOTE!!!
🌟 Welcome to FNSlib 🌟

Our project is in the early development stage, meaning things might change. 

But don't worry, we're actively seeking feedback! So if you see something that needs improvement, please don't hesitate to create an issue or PR. 🙌

Good news! FNSlib can already be used on both **Filecoin Mainnet** and **Filecoin Hyperspace** testnet networks. 🚀


## Installation
You can find the FNS library in NPM package - https://www.npmjs.com/package/@spheron/fnslib

Using NPM
```
npm install @spheron/fnslib ethers
```
Using Yarn
```
yarn add @spheron/fnslib ethers
```

## Getting Started

🚀 Ready to get started with FNSlib? 🚀

You only need to grab an 🌟 ethers provider instance 🌟 from https://filecoin-hyperspace.chainstacklabs.com/rpc/v1 (Testnet) or https://filecoin-mainnet.chainstacklabs.com/rpc/v1 (Mainnet).

Once you've got your hands on that, creating a new FNS instance is a breeze! Just pass it in using setProvider and you're good to go. 💪

Happy coding! 🤖👨‍💻👩‍💻

```js
import { FNS } from '@spheron/fnslib'
import { ethers } from 'ethers'

const provider = new ethers.providers.JsonRpcProvider(providerUrl)

const FNSInstance = new FNS()
await FNSInstance.setProvider(provider)
```

**NOTE:**
If using FNSlib with Node, you may need to pass the `--experimental-specifier-resolution=node` flag.

```sh
node --experimental-specifier-resolution=node ./index.js
```

## Single-use Providers

If you want to use a specific provider to make a single call occasionally, you can easily do so.

```js
import { FNS } from '@spheron/fnslib'

const FNSInstance = new FNS()

const callWithProvider = await FNSInstance.withProvider(otherProvider).getText(
  'juan.fil',
  'foo',
)
```
## Name Availability 
Check if a name is available to be registered on the FEVM Naming Service.

```js
const name = "juan.fil"
const isAvailable = await FNSInstance.getAvailable(name);
```
## Price
View the current price of registering or updating a name on the FEVM Naming Service. The price is determined by market demand and is subject to change.

```js
const name = "juan.fil"
const price = await FNSInstance.getPrice(name, duration);
``` 

## Expiration
View the timestamp in which a particular registered name will expire. 

```js
const name = "juan.fil"
const price = await FNSInstance.getExpiry(name);
``` 

## Profiles

You can fetch almost all information about an FNS name (or address) using getProfile.
If an address is used as the first argument, it will fetch the primary name and give the same response as a name would.
It will automatically get all the records for a name, as well as get the resolver address for the name.
Specific records can also be used as an input, if you only want to get certain ones. If an address is used as an input alongside this,
you also save 1 RPC call.

**NOTE:**  
The profile function will always request an ETH addr record.
For names, this means the address will always at the top level of the returned object.
For addresses, this means the "match" property (a boolean value for matching reverse/forward resolution) will always be at the top level of the returned object.
`coinType` is the cryptocurrency coin type index from [SLIP44](https://github.com/satoshilabs/slips/blob/master/slip-0044.md)


```js
/* Normal profile fetching */
const profile = await FNSInstance.getProfile('juan.fil')

 /* Get Blockchain Address

Get Blockchain Address
🔍 Need to find the blockchain address associated with your FNS name and coinType? 🔍

Our handy function can help! Simply provide the node (FNS name) and coinType, and we'll return the associated blockchain address. If no address is found, don't worry - the function will return 0. 😎

At the moment, FNSlib supports BTC, LTC, DOGE, and native FIL, but we're always looking to add support for more major chains in the future. 

If you have a specific request for a coinType, head to our 💬 [discord channel](https://discord.com/invite/ahxuCtm) and let us know. We're always considering new ideas for subsequent updates. 🚀

Our goal is to make FNSlib as comprehensive and user-friendly as possible, and we appreciate your feedback and suggestions. So don't hesitate to reach out and help us achieve this goal. 💪

Keep building something great. 🤖👨‍💻👩‍💻
*/

enum BlockchainIdentifier {
  BITCOIN = 0,
  LITECOIN = 2,
  DOGECOIN = 3,
  FILCOIN = 4610,
  FILCOINEVM = 461,
}


/* For FIL Address - t410fkyutpa243vojf5klstpwld6twufgr3gv5rmsx5y */

const  address  =  await FNSInstance.getAddress('juan.fil', BlockchainIdentifier.FILCOIN)
  

/* For FIL(ETH) Address - 0x562937835cdD5C92F54B94Df658Fd3b50A68ecD5 */

const  address  =  await FNSInstance.getAddress('juan.fil', BlockchainIdentifier.FILCOINEVM)


/* For BTC - 3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5 */

const  address  =  await FNSInstance.getAddress('juan.fil', BlockchainIdentifier.BITCOIN)


/* For LTC - MGxNPPB7eBoWPUaprtX9v9CXJZoD2465zN */
const  address  =  await FNSInstance.getAddress('juan.fil', BlockchainIdentifier.LITECOIN)

/* For DOGE - DLCDJhnh6aGotar6b182jpzbNEyXb3C361 */

const  address  =  await FNSInstance.getAddress('juan.fil', BlockchainIdentifier.DOGECOIN)


/* Normal content fetching 
To get content hash attached to a fns name
*/

const  contentHash  =  await FNSInstance.getContent('juan.fil')
/* ipfs://QmZYmH5iDbD6v3U2ixoVAjioSzvWJszDzYdbeCLquGSpVm */
/*
The code block above  is used to fetch the content hash associated with a FNS name 'juan.fil'. The content hash is a unique identifier for the content associated with the FNS name.

The code uses the getContent function of the FNSInstance object to retrieve the content hash. The await keyword is used to wait for the content hash to be retrieved before assigning it to the contentHash variable.

Once the content hash is retrieved, it is returned as a string. In this case, the content hash is ipfs://QmZYmH5iDbD6v3U2ixoVAjioSzvWJszDzYdbeCLquGSpVm.

Overall, this code block demonstrates how to use the FNSlib to retrieve the content associated with a FNS name. It is a crucial feature of the FNSlib, enabling users to easily retrieve content associated with FNS names on the FEVM chain.
*/
/* FNS name fetching 
To get the FNS name attached to an address
*/
/*
The code block below is used to retrieve the FNS name associated with an address on the FEVM chain. Here is an explanation of how it works:
*/
const address = "0x562937835cdD5C92F54B94Df658Fd3b50A68ecD5";
const node = await FNSInstance.getNameNode(address);
const name = await FNSInstance.getAddrName(node);
/* juan.fil */
/*
The getNameNode function is used to retrieve the node associated with an address. The node variable will contain the node associated with the provided address. This node can then be used to retrieve the FNS name associated with it.

The getAddrName function takes a node as input and retrieves the FNS name associated with it. The name variable will contain the FNS name associated with the provided node.

Overall, this code block demonstrates how to use the FNSlib to retrieve the FNS name associated with an address on the FEVM chain. It is a useful feature that enables users to easily retrieve FNS names associated with specific addresses.
*/
/* Get Name from Address */
const node = await FNSInstance.getNameNode(address);
const name = await FNSInstance.getAddrName(node);

/* Profile fetching from an address */
const profile = await FNSInstance.getProfile(
  '0x562937835cdD5C92F54B94Df658Fd3b50A68ecD5',
)

/* Get all records of a specific type (or multiple) */
const profile = await FNSInstance.getProfile('juan.fil', {
  texts: true,
  coinTypes: true,
  contentHash: true,
})

/* Get specific records */
const profile = await FNSInstance.getProfile('juan.fil', {
  texts: ['foo'],
  coinTypes: ['FIL'],
})
```

Returns:

```typescript
type RecordItem = {
  key: string | number
  type: 'addr' | 'text' | 'contentHash'
  coin?: string
  addr?: string
  value?: string
}

type ProfileReturn = {
  address?: string // ONLY RETURNED AT TOP-LEVEL FOR NAME QUERIES
  name?: string // ONLY RETURNED AT TOP-LEVEL FOR ADDRESS QUERIES
  records: {
    contentHash?: ContentHashObject | null
    texts?: RecordItem[]
    coinTypes?: RecordItem[]
  }
  resolverAddress: string
}
```


## Ownership Levels

The `getOwner` function returns not only an owner (and potentially a registrant), but also a ownershipLevel value.
This value essentially means the contract for the "real owner" of any given name. In most cases it means the NFT contract
of the name, but if there is no NFT then it's just the registry. This value is useful for input into the `transferName`
function, where a contract needs to be specified.



## Write Transaction Options

Currently, some write functions have an `options` argument. While this may expand over time,
it currently just allows you to pass an address or index for an account array to ethers for specifying the signer of the transaction.

## Register A Name
```js
/* write operation to register name */
await FNSInstance.register('aromedev.fil', address, duration, { value: 2000 });
/* write operation to set record */
await FNSInstance.setRecord('arome.fil', {
    type: 'contentHash',
    record: ipfsHash,
    resolverAddress
})
```

## Internal Structure

### Raw Functions

Raw functions are a crucial part of how FNSlib works. In the function file itself
a `raw` and `decode` function both need to be defined, with the export being an object with those properties.
This allows for the encoding and decoding of contract calls to be split, meaning that multiple calls can be batched together.
For calling a raw function by itself, the raw and decode functions are stitched together with a provider call. This is done
using `importGenerator` which is explained below.

### importGenerator

The importGenerator function generates a wrapped function for any given input.
The result of the wrapped function obfuscates the processing that FNSlib does, and exposes a cleaner API to the user/developer.
The reason we do this is to:

1. Pass through all the required variables for the function
2. Split individual functions from the main class
3. Dynamically load functions and their dependencies
4. Allow each function's dependencies to be imported regularly
5. Remove duplicate code
6. Make it easier to isolate errors
7. Stitch `raw` and `decode` functions together

### ContractManager

The contract manager is where all the contracts are dynamically loaded in and resolved based on the network.
A new instance of ContractManager is created every time you switch providers.


### initialProvider

The `initialProvider`, and similarly `checkInitialProvider` are used when creating single-use class instances with `withProvider`.
It allows `withProvider` to act as a new FNS instance without having to await a promise, which simplifies the API.
`checkInitialProvider` is run on every function call given that it's extremely lightweight.

## Individual Functions

### Utils

Utils can be imported at follows
`import { encodeContenthash } from '@spheron/fnslib/utils/contentHash'`


### getName

Gets the primary name for a specified address.

Input:

- `address`: string
  - Target address

Output:

- `name`: string | null
  - Resolved name
- `match`: boolean
  - Forward resolved match check value

### getOwner

Gets the owner of a specified name. See _ownership levels_ for more details about the output.

Input:

- `name`: string
  - Target name

Output:

- `owner`: string
  - Controller of records for name
- `registrant`: string?
  - NFT Owner
- `ownershipLevel`: string
  - Level at which the ownership data is being read

### getProfile

Gets the profile of a specified name or address, or just certain records if specified.

Input:

- `nameOrAddress`: string
  - Target name or address
- `options`: object?
  - `contentHash`: boolean?
  - `texts`: boolean? | string[]?
    - Array of keys, or true for all keys
  - `coinTypes`: boolean? | string[]?
    - Array of keys, or true for all keys

Output:

- `resolverAddress`: string
  - Address of resolver
- `records`: object
  - matching records from input
  - `contentHash`: object? | null?
    - Decoded content hash
  - `texts`: array?
    - `key`: string
    - `value`: string
  - `coinTypes`: array?
    - `key`: number
    - `coin`: string
      - Coin name
    - `value`: string
      - Decoded address
- `name`: string?
  - _Only applicable for address inputs_
  - Resolved name
- `address`: string?
  - _Only applicable for name inputs_
  - Resolved address
- `match`: boolean?
  - _Only applicable for address inputs_
  - Forward resolved match check value

### getRecords

Gets all the records of a specified name, or just certain records if specified.

Input:

- `name`: string
- `options`: object?
  - `contentHash`: boolean?
  - `texts`: boolean? | string[]?
    - Array of keys, or true for all keys
  - `coinTypes`: boolean? | string[]?
    - Array of keys, or true for all keys

Output: **see getProfile**

### getResolver

Gets the resolver for a specified name.

Input:

- `name`: string
  - Target name

Output:

- string
  - Resolver address

### getContentHash

Gets the content hash record for a specified name.

Input:

- `name`: string
  - Target name

Output:

- object | null
  - Decoded content hash

### getText

Gets a text record for a specified name.

Input:

- `name`: string
  - Target name
- `key`: string
  - Target key

Output:

- string | null
  - Text record value

### getAddr

Gets an address record for a specified name.

Input:

- `name`: string
  - Target name
- `coinType`: string? | number?
  - Target coin
  - Defaults to 60 (ETH) if undefined

Output:

- string | null
  - Address record value


### setName

Sets the primary name for a specified address.

Input:

- `name`: string
  - Name to set
- `address`: string?
  - _Setting other primary names requires authorisation_
  - Address to set name for
- `resolver`: string?
  - _Setting other primary names requires authorisation_
  - Target resolver

Output:

- transaction

### setRecords

Sets multiple records at once for the specified name.

Input:

- `name`: string
  - Target name
- `records`: object
  - `contentHash`: string?
    - Formatted and encoded content hash
  - `texts`: array?
    - object
      - `key`: string
        - Text key
      - `value`: string
        - Text value
  - `coinTypes`: array?
    - object
      - `key`: string
        - Coin name or ID
      - `value`: string
        - Coin address

Output:

- transaction

### setResolver

Sets the resolver for the specified name, using the specified contract.

Input:

- `name`: string
  - Target Name
- `contract`: `registry` | `nameWrapper`
  - Target contract
- `resolver`: string?
  - _Leaving this undefined will use the default public resolver_

Output:

- transaction

### transferName

Transfers a name, using the specified contract.

Input:

- `name`: string
  - Target name
- `newOwner`: string
  - Address to transfer name to
- `contract`: `registry` | `nameWrapper` | `baseRegistrar`
  - Target contract

Output:

- transaction

## Contribution
We encourage you to read the [contribution guidelines](https://github.com/spheronFdn/fns/blob/main/.github/contribution-guidelines.md) to learn about our development process and how to propose bug fixes and improvements before submitting a pull request.

The Spheron community extends beyond issues and pull requests! You can support Spheron [in many other ways](https://github.com/spheronFdn/fns/blob/main/.github/support.md) as well.

## Community
For help, discussions or any other queries: [Join us on Discord](https://discord.com/invite/ahxuCtm)
