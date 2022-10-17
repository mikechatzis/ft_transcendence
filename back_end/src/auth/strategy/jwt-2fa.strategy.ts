import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { Strategy } from "passport-jwt";
import { UserService } from "../../user/user.service";

@Injectable()
export class Jwt2faStrategy extends PassportStrategy(Strategy, 'jwt-2fa') {
	constructor(private userService: UserService, private config: ConfigService) {
		super({
			jwtFromRequest: getToken,
			secretOrKey: config.get('JWT_SECRET'),
			ignoreExpiration: false
		})
	}

	async validate(payload) {
		try {
			const user = await global.prisma.user.findUnique({
				where: {
					id: payload.sub
				}
			})
			if (!user.twoFactorAuth) {
				return user
			}
			if (payload.isAuthenticated) {
				return user
			}
		}
		catch (error) {
			console.log(error)
		}
	}
}

const getToken = (req: Request) => {
	let token = null
	if (req && req.cookies) {
		token = req.cookies['jwt']
	}
	// console.log('cookies:', req.cookies)
	// console.log('token:', token)
	return token
}