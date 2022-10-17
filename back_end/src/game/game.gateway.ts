import { JwtService } from "@nestjs/jwt";
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { GameService } from "./game.service";

@WebSocketGateway({
	namespace: "game",
	cors: {
		origin: "http://localhost:3000",
		credentials: true
	}
})
export class GameGateway {
	constructor(private jwt: JwtService, private gameService: GameService) {}

	@WebSocketServer()
	server;

	@SubscribeMessage('connection')
	async handleConnection(socket) {
		console.log("user connected to game server")
	}
}