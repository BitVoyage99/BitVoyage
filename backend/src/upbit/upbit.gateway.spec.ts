import { Test, TestingModule } from '@nestjs/testing';
import { UpbitGateway } from './upbit.gateway';

describe('UpbitGateway', () => {
  let gateway: UpbitGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UpbitGateway],
    }).compile();

    gateway = module.get<UpbitGateway>(UpbitGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
