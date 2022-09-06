import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport'
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt'
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(config: ConfigService, private prisma: PrismaService) {
		super({
			jwtFromRequest: getToken,
			secretOrKey: config.get('JWT_SECRET'),
			ignoreExpiration: true
		})
	}

	async validate(payload: {sub: number, email: string}) {
		const user = await this.prisma.user.findUnique({
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