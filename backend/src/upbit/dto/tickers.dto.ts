export class TickersAdapter {
  private allMarketCodes: string[];
  private data: any;

  constructor(allMarketCodes: string[], data: any) {
    this.allMarketCodes = allMarketCodes;
    this.data = data;
  }

  adapt() {
    const initTickers = this.initializeObjectKeys(this.data);

    return {
      ...initTickers,
      [this.data.code]: this.data,
    };
  }

  private initializeObjectKeys = (keys: string[]) => {
    return keys.reduce<{ [key: string]: null }>((acc, key) => {
      acc[key] = null;
      return acc;
    }, {});
  };
}

export default TickersAdapter;
