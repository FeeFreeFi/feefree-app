const shortString = (str, start = 6, end = -4) => `${str.slice(0, start)}...${str.slice(end)}`

export default shortString
