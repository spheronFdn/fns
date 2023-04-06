enum ChainType {
  TESTNET = 'testnet',
  MAINNET = 'mainnet',
}

export interface IConfig {
  web3: {
    CHAIN_ID: number
    TYPE: ChainType
    NETWORK: {
      chainName: string
      nativeCurrency: {
        name: string
        symbol: string
        decimals: number
      }
      blockExplorerUrls: string[]
    }
  }
}

const NODE_ENV: string = process.env.REACT_APP_STAGE || 'local'

const local: IConfig = {
  web3: {
    CHAIN_ID: 3141,
    TYPE: ChainType.TESTNET,
    NETWORK: {
      chainName: 'Filecoin hyperspace',
      nativeCurrency: {
        name: 'tFIL',
        symbol: 'tFIL',
        decimals: 18,
      },
      blockExplorerUrls: ['https://hyperspace.filfox.info'],
    },
  },
}

const production: IConfig = {
  web3: {
    CHAIN_ID: 314,
    TYPE: ChainType.MAINNET,
    NETWORK: {
      chainName: 'Filecoin',
      nativeCurrency: {
        name: 'FIL',
        symbol: 'FIL',
        decimals: 18,
      },
      blockExplorerUrls: ['https://filfox.info'],
    },
  },
}

const config: {
  [name: string]: IConfig
} = {
  local,
  production,
}

export default config[NODE_ENV]
