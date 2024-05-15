import {
  SubscribeMessage,
  WebSocketGateway,
  ConnectedSocket,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import * as WebSocket from 'ws';
import { firstValueFrom } from 'rxjs';
import { CandlesService } from 'src/candles/candles.service';
import { MarketsService } from 'src/markets/markets.service';

import { TickerService } from 'src/ticker/ticker.service';
import OrderBookAdapter from './dto/orderbook.dto';
import TickersAdapter from './dto/tickers.dto';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET'],
  },
  namespace: 'upbit',
})
export class UpbitGateway {
  @WebSocketServer() server: Server;
  private ws: WebSocket;

  constructor(
    private tickerService: TickerService,
    private candleService: CandlesService,
    private marketService: MarketsService,
  ) {
    this.connectToUpbit();
  }

  connectToUpbit() {
    this.ws = new WebSocket('wss://api.upbit.com/websocket/v1', {});
    this.ws.binaryType = 'arraybuffer';
  }

  @SubscribeMessage('ticker')
  async handleMessage(
    @MessageBody() market: string,
    @ConnectedSocket() socket,
  ) {
    // const lastMinuteCandleData = await firstValueFrom(
    //   this.candleService.getLastMinuteCandle('KRW-BTC'),
    // );

    const allMarketCodes = await firstValueFrom(
      this.marketService.getAllMarketCodes(),
    );

    const prevPrice = await firstValueFrom(
      this.tickerService.getPrevClosingPrice('KRW-BTC'),
    );

    const message = [
      { ticket: 'UNIQUE_TICKET' },
      { type: 'orderbook', codes: [market] },
      { type: 'ticker', codes: allMarketCodes },
    ];

    this.ws.send(JSON.stringify(message));

    const sendData: any = {};

    this.ws.on('message', (data) => {
      const unit8Array = new Uint8Array(data);
      const stringData = new TextDecoder('utf-8').decode(unit8Array);
      const parsedData = JSON.parse(stringData);

      if (parsedData.type === 'orderbook') {
        const orderbookDetail = new OrderBookAdapter(
          parsedData,
          prevPrice as any,
        ).adapt();
        sendData.orderbookDetail = orderbookDetail;
      } else if (parsedData.type === 'ticker' && parsedData.code === market) {
        sendData.selectedTicker = parsedData;
      } else if (parsedData.type === 'ticker') {
        const test = new TickersAdapter(allMarketCodes as any, parsedData);
        sendData.tickers = test;
      }

      socket.emit('ticker', sendData);
    });
  }
}
