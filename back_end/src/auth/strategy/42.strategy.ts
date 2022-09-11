import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { VerifiedCallback } from "passport-jwt";

const Strategy = require('passport-42').Strategy
const passport = require('passport')

@Injectable()
export class FtStrategy extends PassportStrategy(Strategy, '42') {
	constructor(config: ConfigService) {
		super({
			clientID: config.get('42_UID'),
			clientSecret: config.get('42_SECRET'),
			callbackURL: config.get('42_CALLBACK'),
		})
	}

	async validate(accessToken: string, refreshToken: string, profile: any, done:VerifiedCallback) {
		const user = {
			id: profile.id,
			name: profile.username
		}

		done(null, user)
	}
}