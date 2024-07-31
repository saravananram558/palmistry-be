import { Test, TestingModule } from '@nestjs/testing';
import { ChatStoreService } from './chat-store.service';

describe('ChatStoreService', () => {
  let service: ChatStoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatStoreService],
    }).compile();

    service = module.get<ChatStoreService>(ChatStoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
