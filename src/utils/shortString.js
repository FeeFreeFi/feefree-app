const shortString = (str, first = 6, end = -4) => `${str.slice(0, first)}...${str.slice(end)}`

export default shortString
