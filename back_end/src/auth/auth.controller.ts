import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseFilters, UseGuards } from "@nestjs/common";
import { Request, Response, Router } from "express";
import * as bodyParser from 'body-parser'
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";
import { FtGuard, JwtGuard } from "./guard";
import { FtFilter } from "./filter";

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
	@UseFilters(FtFilter)
	@Get('42/callback')
	async fortyTwoAuthCallback(@Req() req: Request, @Res({passthrough: true}) res: Response) {
		let user = await this.authService.getUser(req.user)

		if (!user) {
			user = await this.authService.singUpIntra(req)
		}
		const accessToken = await this.authService.signToken({
			sub: user.id
		})
		res.cookie('jwt', accessToken, {
			httpOnly: true,
			sameSite: 'strict',
			maxAge: 15 * 60 * 1000
		})
		res.redirect("http://localhost:3000/account")
	}

	@UseGuards(JwtGuard)
	@Get('signout')
	signOut(@Res() res: Response) {
		res.cookie('jwt', '', {
			httpOnly: true,
			sameSite: 'strict',
			maxAge: 15 * 60 * 1000
		})
		console.log('bruh')
		res.redirect('http://localhost:3000/account')
	}
}