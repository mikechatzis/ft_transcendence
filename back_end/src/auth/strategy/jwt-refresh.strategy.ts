import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { Strategy } from "passport-jwt";
import { UserService } from "../../user/user.service";

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
	constructor(private config: ConfigService, private userService: UserService) {
		super({
			jwtFromRequest: getToken,
			secretOrKey: config.get('REFRESH_SECRET'),
			passReqToCallback: true
		})
	}

	async validate(req: Request, payload: any) {
		try {
			const refreshToken = req.cookies['jwt-refresh']
			return {...payload, refreshToken}
		}
		catch (error) {
			console.log(error)
		}
	}
}

const getToken = (req: Request) => {
	let token = null
	if (req && req.cookies) {
		token = req.cookies['jwt-refresh']
	}
	return token
}
