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
      logotype: NSD,
      description: 'The NSD Token (NSD) is a Binance Smart Chain powered BEP20 utility token that can be used on the NSD Crypto platform to trade with 0% commission and access premium features. In the near future, NSD aims to enrich a range of community features so that the token offers tangible advantages on the NSD Crypto platform. The goal is to create a strong use case for NSD and power a micro-economy within the platform.'
    },
    bux: {
      name: 'BUX',
      address: {
        56: '',
        97: '',
        4: '0x5a3B809c17C31bF71670FbF19dD890d471E7642a'
      },
      decimals: 18,
      logotype: BUX,
      description: 'The BUX Token (BUX) is a Binance Smart Chain powered BEP20 utility token that can be used on the BUX Crypto platform to trade with 0% commission and access premium features. In the near future, BUX aims to enrich a range of community features so that the token offers tangible advantages on the BUX Crypto platform. The goal is to create a strong use case for BUX and power a micro-economy within the platform.'
    }
}

export default tokens