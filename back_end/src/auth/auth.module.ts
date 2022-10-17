import { Module } from "@nestjs/common";
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from "@nestjs/passport";
import { UserService } from "../user/user.service";
import { UserModule } from "../user/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { FtGuard, Jwt2faGuard, JwtGuard } from "./guard";
import { FtStrategy, Jwt2faStrategy } from "./strategy";
import { JwtStrategy } from "./strategy/jwt.strategy";
import { RefreshStrategy } from "./strategy/jwt-refresh.strategy";
import { RefreshTokenGuard } from "./guard/jwt-refresh.guard";

@Module({
	imports: [JwtModule.register({
		secret: process.env.JWT_SECRET,
	}), PassportModule, UserModule],
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy, JwtGuard, FtStrategy, FtGuard, UserService, Jwt2faStrategy, Jwt2faGuard, RefreshStrategy, RefreshTokenGuard]
})
export class AuthModule {}