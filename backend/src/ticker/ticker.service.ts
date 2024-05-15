import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable, map } from 'rxjs';

@Injectable()
export class TickerService {
  constructor(private httpService: HttpService) {}

  getPrevClosingPrice(market: string): Observable<AxiosResponse<any>> {
    return this.httpService
      .get(`https://api.upbit.com/v1/ticker?markets=${market}`)
      .pipe(map((response) => response.data[0].prev_closing_price));
  }
}
