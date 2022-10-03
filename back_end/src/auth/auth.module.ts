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

@Module({
	imports: [JwtModule.register({
		secret: process.env.JWT_SECRET,
		signOptions: {expiresIn: '15m'}
	}), PassportModule, UserModule],
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy, JwtGuard, FtStrategy, FtGuard, UserService, Jwt2faStrategy, Jwt2faGuard]
})
export class AuthModule {}