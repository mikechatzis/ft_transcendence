import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from "@nestjs/common";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";
import { FtGuard } from "./guard";

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('signup')
	signup(@Body() dto: AuthDto) {
		return this.authService.signup(dto)
	}

	// the HttpCode decorator lets us change the returned status code on success
	// in this case returning 200 (instead of the default 201 for POST requests) because no new data has been created on the server
	@HttpCode(HttpStatus.OK)
	@Post('signin')
	signin(@Body() dto: AuthDto) {
		return this.authService.signin(dto)
	}

	@UseGuards(FtGuard)
    @Get('42/login')
    async login() {}

	@UseGuards(FtGuard)
	@Get('42/callback')
	async fortyTwoAuthCallback(@Req() req: Request, @Res({passthrough: true}) res: Response) {
		console.log(req.user)
		res.redirect("http://localhost:3000")
	}
}