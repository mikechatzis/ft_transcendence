import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	async setTwoFactorAuthenticationSecret(secret: string, userId: number) {
		await this.prisma.user.update({
			where: {
				id: userId
			},
			data: {
				twoFactorSecret: secret
			}
		})
	}

	async turnOnTwoFactorAuthentication(userId: number) {
		await this.prisma.user.update({
			where: {
				id: userId
			},
			data: {
				twoFactorAuth: true
			}
		})
	}
}