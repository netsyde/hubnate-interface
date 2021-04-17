import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import web3NoAccount from '@src/utils/web3'

// Addresses
import {
  getDonateAddress
} from '@src/utils/addressHelpers'

// ABI
import donateAbi from '@src/data/abi/donate.json'

const getContract = (abi: any, address: string, web3?: Web3) => {
  const _web3 = web3 ?? web3NoAccount
  return new _web3.eth.Contract((abi as unknown) as AbiItem, address)
}

export const getDonateContract = (web3?: Web3) => {
  return getContract(donateAbi, getDonateAddress(), web3)
}