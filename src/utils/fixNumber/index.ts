const fixNumber = (number: number, decimals: number) => {
    return Number((number / Math.pow(10, decimals)).toFixed(0))
}

export default fixNumber;