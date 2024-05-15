import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable, map } from 'rxjs';

@Injectable()
export class MarketsService {
  constructor(private httpService: HttpService) {}

  getAllMarketCodes(): Observable<AxiosResponse<any>> {
    return this.httpService
      .get('https://api.upbit.com/v1/market/all')
      .pipe(map((response) => response.data.map((item) => item.market)));
  }
}
