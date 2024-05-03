import { OrderBook } from '@/types/coin';

class OrderBookAdapter {
  private orderBook: OrderBook;

  constructor(orderBook: OrderBook) {
    this.orderBook = orderBook;
  }

  public adapt() {
    return {
      orderbook_units: this.orderBook.orderbook_units.map(unit => ({
        ...unit,
        askChangeRate: this.getAskChangeRate(unit.ask_size),
        bidChangeRate: this.getBidChangeRate(unit.bid_size),
      })),
      askMaxSize: this.getAskMaxSize(),
      bidMaxSize: this.getBidMaxSize(),
    };
  }

  private getAskMaxSize() {
    return Math.max(
      ...this.orderBook.orderbook_units.map(unit => unit.ask_size)
    );
  }

  private getAskChangeRate(ask_size: number) {
    const askMaxSize = this.getAskMaxSize();
    return (ask_size / askMaxSize) * 100;
  }

  private getBidMaxSize() {
    return Math.max(
      ...this.orderBook.orderbook_units.map(unit => unit.bid_size)
    );
  }

  private getBidChangeRate(bid_size: number) {
    const bidMaxSize = this.getBidMaxSize();
    return (bid_size / bidMaxSize) * 100;
  }
}

export default OrderBookAdapter;
