import { Module } from '@nestjs/common';
import { UpbitGateway } from './upbit.gateway';
import { MarketsModule } from 'src/markets/markets.module';
import { CandlesModule } from 'src/candles/candles.module';
import { TickerModule } from 'src/ticker/ticker.module';

@Module({
  imports: [CandlesModule, MarketsModule, TickerModule],
  providers: [UpbitGateway],
})
export class UpbitModule {}
