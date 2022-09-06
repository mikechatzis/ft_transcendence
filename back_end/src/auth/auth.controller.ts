import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UnauthorizedException, UseFilters, UseGuards } from "@nestjs/common";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";
import { FtGuard, JwtGuard } from "./guard";
import { FtFilter } from "./filter";
import { UserService } from "../user/user.service";
import { GetUser } from "./decorator";
import { User } from "@prisma/client";

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService, private userService: UserService) {}

	@Post('signup')
	async signup(@Body() dto: AuthDto, @Res({passthrough: true}) res: Response) {
		const token = await this.authService.signup(dto)

		res.cookie('jwt', token, {
			httpOnly: true,
			sameSite: 'strict',
			maxAge: 15 * 60 * 1000
		})
	}

	// the HttpCode decorator lets us change the returned status code on success
	// in this case returning 200 (instead of the default 201 for POST requests) because no new data has been created on the server
	@HttpCode(HttpStatus.OK)
	@Post('signin')
	async signin(@Body() dto: AuthDto, @Res({passthrough: true}) res: Response) {
		const token = await this.authService.signin(dto)

		res.cookie('jwt', token, {
			httpOnly: true,
			sameSite: 'strict',
			maxAge: 15 * 60 * 1000
		})
	}

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
	signOut(@Res({passthrough: true}) res: Response) {
		res.cookie('jwt', '', {
			httpOnly: true,
			sameSite: 'strict',
			maxAge: 0
		})
	}

	@UseGuards(JwtGuard)
	@Get('logged_in')
	loggedIn() {
		return {
			loggedIn: true
		}
	}

	@UseGuards(JwtGuard)
	@Post('2fa/turn-on')
	async turnOnTwoFactorAuth(@GetUser() user: User, @Body() body) {
		const isCodeValid = this.authService.isTwoFactorAuthenticationCodeValid(
			body.twoFactorAuthenticationCode,
			user
		)
		if (!isCodeValid) {
			throw new UnauthorizedException("Wrong authentication code")
		}
		await this.userService.turnOnTwoFactorAuthentication(user.id)
	}

	@HttpCode(HttpStatus.OK)
	@UseGuards(JwtGuard)
	@Post('2fa/authenticate')
	async authenticate(@GetUser() user: User, @Body() body, @Res({passthrough: true}) res: Response) {
		const isCodeValid = this.authService.isTwoFactorAuthenticationCodeValid(
			body.twoFactorAuthenticationCode,
			user
		)

		if (!isCodeValid) {
			throw new UnauthorizedException("Wrong authentication code")
		}

		const logData = await this.authService.login2fa(user)

		res.cookie('jwt', logData.access_token, {
			httpOnly: true,
			sameSite: 'strict',
			maxAge: 15 * 60 * 1000
		})

		return logData
	}

}