export const approve = async (tokenContract: any, donateContract: any, account: any, amount: any) => {
    return tokenContract.methods
      .approve(donateContract.options.address, amount)
      .send({ from: account })
}