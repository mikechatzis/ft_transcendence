import { Module } from "@nestjs/common";
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { FtGuard, JwtGuard } from "./guard";
import { FtStrategy } from "./strategy";
import { JwtStrategy } from "./strategy/jwt.strategy";

@Module({
	imports: [JwtModule.register({
		secret: "4dfa5401b2f9e4311c824bb3f897d47ceb0029d5957d7b140ffb0dd377a03dfc",
		signOptions: {expiresIn: '15m'}
	}), PassportModule],
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy, JwtGuard, FtStrategy, FtGuard]
})
export class AuthModule {}