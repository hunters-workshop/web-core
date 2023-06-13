const networkMap = new Map<string, number>();
networkMap.set('eth', 1);
networkMap.set('oeth', 10);
networkMap.set('bnb', 56);
networkMap.set('gno', 100);
networkMap.set('matic', 137);
networkMap.set('arbi', 42161);

export const getSafeData = (safe: string) => {
  const data = safe.split(':')
  return {
    chainId: networkMap.get(data[0]),
    address: data[1],
    chainPrefix: data[0]
  }
}