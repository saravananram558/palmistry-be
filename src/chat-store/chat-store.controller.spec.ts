import { Test, TestingModule } from '@nestjs/testing';
import { ChatStoreController } from './chat-store.controller';
import { ChatStoreService } from './chat-store.service';

describe('ChatStoreController', () => {
  let controller: ChatStoreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatStoreController],
      providers: [ChatStoreService],
    }).compile();

    controller = module.get<ChatStoreController>(ChatStoreController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
