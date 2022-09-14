import { Body, Controller, ForbiddenException, Get, Param, Post, Req, Request, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { Jwt2faGuard, JwtGuard } from '../auth/guard';
import { UserService } from './user.service';
import { UsernameDto } from './dto/username.dto';

@Controller('users')
export class UserController {

	constructor(private userService: UserService) {}

	// if get decorator is left with no parameters it will use the one in @controller
	// something like @Get('test') would work for 'GET /users/test'
	// if controller had nothing, an empty @Get() would catch it at '/'
	@UseGuards(Jwt2faGuard)
	@Get('me')
	getMe(@GetUser() user: User) {
		delete user.hash
		delete user.twoFactorSecret
		return user
	}

	@UseGuards(Jwt2faGuard)
	@Get('me/name')
	getMyName(@GetUser() user: User) {
		return user.name
	}

	@UseGuards(Jwt2faGuard)
	@Post('me/name')
	async setMyName(@GetUser() user: User, @Body() body: UsernameDto) {
		const userUpdated = await this.userService.setName(user, body)
	}

	// @UseGuards(Jwt2faGuard)
	@Get('all')
	async getAllUsers() {
		const users = await global.prisma.user.findMany()

		for (let i = 0; i < users.length; i++) {
			delete users[i].hash
			delete users[i].twoFactorSecret
		}
		return users
	}

	@UseGuards(Jwt2faGuard)
	@Get(':id')
	async getById(@Param('id') id) {
		const user = await this.userService.findById(parseInt(id))

		return user
	}

	@UseGuards(Jwt2faGuard)
	@Get('user/:name')
	async getByName(@Param('name') name) {
		const user = await this.userService.findByName(name)

		return user
	}
}

