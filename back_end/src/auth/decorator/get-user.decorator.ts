import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../../prisma/prisma.service";

export const GetUser = createParamDecorator(
	(data: string | undefined, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest()
		const config = new ConfigService()
		const prisma = new PrismaService(config)
		const user = prisma.user.findUnique({
			where: {
				id: request.user['sub']
			}
		})
		if (data) {
			console.log(user)
			console.log(data)
			console.log(user[data])
			return user[data]
		}
		return user
	}
)