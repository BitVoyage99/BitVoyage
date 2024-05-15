import { OrderBookSocketData } from 'src/types/coin';

export class OrderBookAdapter {
  private orderBook: OrderBookSocketData;
  private prevClosingPrice?: number;

  constructor(orderBook: OrderBookSocketData, prevClosingPrice?: number) {
    this.orderBook = orderBook;
    this.prevClosingPrice = prevClosingPrice;
  }

  public adapt() {
    return {
      orderbook_units: this.orderBook.orderbook_units.map((unit) => ({
        ...unit,
        ask_size: unit.ask_size.toFixed(3),
        ask_price: unit.ask_price.toLocaleString(),
        bid_size: unit.bid_size.toFixed(3),
        bid_price: unit.bid_price.toLocaleString(),
        askChangeRate: this.getAskChangeRate(unit.ask_size),
        bidChangeRate: this.getBidChangeRate(unit.bid_size),
        askPriceChangePercent: this.calculatePricePercentageChange(
          unit.ask_price,
        ),
        bidPriceChangePercent: this.calculatePricePercentageChange(
          unit.bid_price,
        ),
      })),
      //   askMaxSize: this.getAskMaxSize(),
      //   bidMaxSize: this.getBidMaxSize(),
    };
  }

  private getAskMaxSize() {
    return Math.max(
      ...this.orderBook.orderbook_units.map((unit) => unit.ask_size),
    );
  }

  private getAskChangeRate(ask_size: number) {
    const askMaxSize = this.getAskMaxSize();
    return (ask_size / askMaxSize) * 100;
  }

  private getBidMaxSize() {
    return Math.max(
      ...this.orderBook.orderbook_units.map((unit) => unit.bid_size),
    );
  }

  private getBidChangeRate(bid_size: number) {
    const bidMaxSize = this.getBidMaxSize();
    return (bid_size / bidMaxSize) * 100;
  }

  private calculatePricePercentageChange(currentPrice: number) {
    if (!this.prevClosingPrice) return '0.00';
    const change =
      ((currentPrice - this.prevClosingPrice) / this.prevClosingPrice) * 100;
    return change.toFixed(2);
  }
}

export default OrderBookAdapter;
