import { Module } from '@nestjs/common';
import { JwtModule} from '@nestjs/jwt';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';

@Module({
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
  imports: [JwtModule]
})
export class ChatModule {}
