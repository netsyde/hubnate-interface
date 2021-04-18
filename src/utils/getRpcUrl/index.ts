import random from 'lodash/random'

// Array of available nodes to connect to
// export const nodes = [
//   "https://bsc-dataseed1.ninicoin.io",
//   "https://bsc-dataseed1.defibit.io",
//   "https://bsc-dataseed.binance.org"
// ]

export const nodes = [
  "https://data-seed-prebsc-1-s1.binance.org:8545/"
]

const getNodeUrl = () => {
  const randomIndex = random(0, nodes.length - 1)
  return nodes[randomIndex]
}

export default getNodeUrl