import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable, map } from 'rxjs';

@Injectable()
export class CandlesService {
  constructor(private httpService: HttpService) {}

  getLastMinuteCandle(market: string): Observable<AxiosResponse<any>> {
    return this.httpService
      .get(
        `https://api.upbit.com/v1/candles/minutes/1?market=${market}&count=1`,
      )
      .pipe(map((response) => response.data[0]));
  }

  getMinuteCandles(
    market: string,
    count: number = 200,
  ): Observable<AxiosResponse<any>> {
    return this.httpService
      .get(
        `https://api.upbit.com/v1/candles/minutes/1?market=${market}&count=${count}`,
      )
      .pipe(
        map((response) => {
          return response.data;
        }),
      );
  }
}
