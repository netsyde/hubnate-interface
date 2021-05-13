import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import web3NoAccount from '@src/utils/web3'
import bep20Abi from '@src/data/abi/erc20.json'
import ctAbi from '@src/data/abi/ct.json'

// Addresses
import {
  getHubnateAddress
} from '@src/utils/addressHelpers'

// ABI
import hubnateAbi from '@src/data/abi/hubnate.json'

const getContract = (abi: any, address: string, web3?: Web3) => {
  const _web3 = web3 ?? web3NoAccount
  return new _web3.eth.Contract((abi as unknown) as AbiItem, address)
}

export const getHubnateContract = (web3?: Web3) => {
  return getContract(hubnateAbi, getHubnateAddress(), web3)
}

export const getBep20Contract = (address: string, web3?: Web3) => {
  return getContract(bep20Abi, address, web3)
}

export const getCTContract = (address: string, web3?: Web3) => {
  return getContract(ctAbi, address, web3)
}