interface APIEndpoints {
    [APIKey: string]: string,
}
const endpoints: APIEndpoints = {
    FEEDBACK: "https://huvfmeboq0.execute-api.us-east-1.amazonaws.com/rt-v2/user/message"// mainnet feedback endpoint
}

export { endpoints };