import { NewDataMessage } from '@/types/types.ts';

class NewDataAdapter {
  private message;

  constructor(message: NewDataMessage) {
    this.message = message;
  }

  public adapt(): NewDataMessage {
    return {
      timestamp: Math.floor(this.message.timestamp / 1000), // Ensure this is a UNIX timestamp
      opening_price: this.message.opening_price,
      high_price: this.message.high_price,
      low_price: this.message.low_price,
      trade_price: this.message.trade_price,
      trade_volume: this.message.trade_volume,
    };
  }
}

export default NewDataAdapter;
