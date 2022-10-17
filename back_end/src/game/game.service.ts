import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class GameService {
	constructor(private jwt: JwtService, private config: ConfigService) {}
}