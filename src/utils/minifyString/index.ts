const minifyString = (str: string) => {
    try {
        return `${str.slice(0, 3)}...${str.slice(str.length - 3)}`;
    } catch (e) {
        return str
    }
};

export default minifyString;