import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

export const GetUser = createParamDecorator(
	(data: string | undefined, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest()
		const config = new ConfigService()
		const user = global.prisma.user.findUnique({
			where: {
				id: request.user.id
			}
		})
		return user
	}
)