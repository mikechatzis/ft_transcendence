import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { GameGateway } from "./game.gateway";
import { GameService } from "./game.service";

@Module({
	controllers: [],
	providers: [GameService, GameGateway],
	imports: [JwtModule]
})
export class GameModule {}
