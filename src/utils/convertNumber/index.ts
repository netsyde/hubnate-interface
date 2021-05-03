const convertNumber = (number: number) => {
    try {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    } catch (e) {
        return number
    }
}

export default convertNumber;