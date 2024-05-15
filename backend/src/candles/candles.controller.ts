import { Controller, Get, Query } from '@nestjs/common';
import { CandlesService } from './candles.service';

@Controller('candles')
export class CandlesController {
  constructor(private readonly candlesService: CandlesService) {}

  @Get(`/minutes`)
  async getMinuteCandle(
    @Query('market') market: string,
    @Query('count') count?: number,
  ) {
    return this.candlesService.getMinuteCandles(market, count);
  }
}
