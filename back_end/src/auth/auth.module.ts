import { Module } from "@nestjs/common";
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { FtGuard, JwtGuard } from "./guard";
import { FtStrategy } from "./strategy";
import { JwtStrategy } from "./strategy/jwt.strategy";

@Module({
	imports: [JwtModule.register({}), PassportModule],
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy, JwtGuard, FtStrategy, FtGuard]
})
export class AuthModule {}