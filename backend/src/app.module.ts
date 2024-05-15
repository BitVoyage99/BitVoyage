import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TickerModule } from './ticker/ticker.module';
import { HttpModule } from '@nestjs/axios';
import { CandlesModule } from './candles/candles.module';
import { MarketsModule } from './markets/markets.module';
import { CommonModule } from './common/common.module';
import { UpbitModule } from './upbit/upbit.module';

@Module({
  imports: [
    CommonModule,
    TickerModule,
    HttpModule,
    CandlesModule,
    MarketsModule,
    UpbitModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
