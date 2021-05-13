const BNB = require('@images/logotypes/bnb.png')
const UNI = require('@images/logotypes/uni.png')
const BUX = require('@images/logotypes/bux.png')
const NSD = require('@images/logotypes/nsd.png')

const tokens = {
    bnb: {
      name: 'BNB',
      projectLink: 'https://www.binance.com/',
      logotype: BNB
    },
    nsd: {
      name: 'NSD',
      address: {
        56: '',
        97: '',
        4: '0xb8bc99ae9F8FEF7A3D7Dbf6DA4a69D6Dd4f55cC2'
      },
      decimals: 18,
      logotype: NSD
    },
    bux: {
      name: 'BUX',
      address: {
        56: '',
        97: '',
        4: '0x5a3B809c17C31bF71670FbF19dD890d471E7642a'
      },
      decimals: 18,
      logotype: BUX
    }
}

export default tokens