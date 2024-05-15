import { Test, TestingModule } from '@nestjs/testing';
import { CandlesController } from './candles.controller';

describe('CandlesController', () => {
  let controller: CandlesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CandlesController],
    }).compile();

    controller = module.get<CandlesController>(CandlesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
