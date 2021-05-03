import addresses from '@src/data/constants/contracts'
import tokens from '@src/data/constants/tokens'

interface Address {
    97?: string // testnet
    56: string // mainnet
    4?: string // rinkeby
}

export const getAddress = (address: Address): string => {
  const chainId = 4 //97;
  return address[chainId]
}

export const getNSDAddress = () => {
  return getAddress(tokens.nsd.address)
}

export const getDonateAddress = () => {
  return getAddress(addresses.donate)
}