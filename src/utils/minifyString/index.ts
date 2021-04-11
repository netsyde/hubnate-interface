const minifyString = (str: string) => {
    return `${str.slice(0, 3)}...${str.slice(str.length - 3)}`;
};

export default minifyString;