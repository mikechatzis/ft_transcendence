import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport'
import { Request } from 'express';
import { Strategy } from 'passport-jwt'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(config: ConfigService) {
		super({
			jwtFromRequest: getToken,
			secretOrKey: 'my_secret_key',
			ignoreExpiration: false
		})
	}

	async validate(payload: {sub: number, name: string}) {
		const user = await global.prisma.user.findUnique({
			where: {
				id: payload.sub
			}
		})
		delete user.hash
		return payload
	}
}

const getToken = (req: Request) => {
	let token = null
	if (req && req.cookies) {
		token = req.cookies['jwt']
	}
	return token
}