import { Body, Controller, ForbiddenException, Get, Param, Post, Query, Req, Request, UploadedFile, UseGuards, UseInterceptors, StreamableFile } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { Jwt2faGuard, JwtGuard } from '../auth/guard';
import { UserService } from './user.service';
import { UsernameDto } from './dto/username.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { of, Observable } from 'rxjs';
import path = require('path');
import fs = require("fs");
import { createReadStream } from 'fs';
import { join } from 'path';

//import fileType = require('file-type')

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
	@Get('me/rank')
	getMyRank(@GetUser() user: User) {
		return user.rank
	}

	@UseGuards(Jwt2faGuard)
	@Get('me/profileImg')
	async getMyAvatar(@GetUser() user: User) {
		const avatar = createReadStream(user.avatar)
		return new StreamableFile(avatar)
	}

	@UseGuards(Jwt2faGuard)
	@Get(':id/profileImg')
	async getUserAvatar(@Param('id') id) {
		try {
			const user = await global.prisma.user.findUnique({
				where: {
					id: parseInt(id)
				}
			})
			const avatar = createReadStream(user.avatar)
			return new StreamableFile(avatar)
		}
		catch (e) {
			throw new ForbiddenException("failed to retrieve image")
		}

	}

	@UseGuards(Jwt2faGuard)
	@Post('me/name')
	async setMyName(@GetUser() user: User, @Body() body: UsernameDto) {
		const userUpdated = await this.userService.setName(user, body)
	}

	//28/9/2022, upload image in "destination" path (create if non existent), then save path as user.avatar: string
	@UseGuards(Jwt2faGuard)
	@Post('me/profileImg')
	@UseInterceptors(FileInterceptor('file', 
		{
			storage: diskStorage({
				destination: './images/avatars',
				filename: (req, file, cb) => {
					const filename: string = path.parse(file.originalname).name.replace(/\s/g, ' ') + uuidv4();
					const extension: string = path.parse(file.originalname).ext;

					cb(null, `${filename}${extension}`)
				}
			}),
			fileFilter: (req, file, cb) => {
				const allowedMimetypes = ['image/jpeg', 'image/jpeg', 'image/png']
				const allowedExtensions = ['.png', '.jpg', '.jpeg']
				
				//console.log(file.mimetype + "\n" + path.parse(file.originalname).ext)
				allowedMimetypes.includes(file.mimetype) &&
				allowedExtensions.includes(path.parse(file.originalname).ext) ? cb (null, true) : cb(null, false)
			}
		}))
	async uploadFile(@UploadedFile() image: Express.Multer.File, @Request() req) {
		const user: User = req.user;
		if (user.avatar && user.avatar !== "./images/avatars/default.jpg") {
			const fs = require('fs')
			try {
				fs.unlinkSync(user.avatar)
				console.log("previous profile img: %s, of user: %s, removed succesfully", user.avatar, user.name)
			}
			catch(err){
				console.error(err)
			}
		}
		if (!image?.filename)
			return of ({error: "avatar must be of type: png, jpg or jpeg"})
		const path = image?.path
		const userUpdated = await this.userService.setAvatar(user, path);
		return of({imagePath: path});
	}
	//end code

	//04/10/2022, set score and update user's rank
	@UseGuards(Jwt2faGuard)
	@Post('user/setScore')
	async updateScore(@GetUser() user: User, @Body('score') score: number) {
		try {
			const userUpdated = await this.userService.setScoreAndRank(user, score)
			delete userUpdated.hash
			return userUpdated
		}
		catch(err){
			console.error(err)
		}
	}
	//code end

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

		delete user.hash
		delete user.twoFactorSecret
		return user
	}

	@UseGuards(Jwt2faGuard)
	@Get('user/:name')
	async getByName(@Param('name') name) {
		const user = await this.userService.findByName(name)

		delete user.hash
		return user
	}

	@UseGuards(Jwt2faGuard)
	@Get('me/friends')
	async getFriends(@Req() req)
	{
		const user = await global.prisma.user.findUnique({
			where: {
				id: req.user.id
			}
		})

		let friends = []

		for (let i = 0; i < user.friends.length; i++) {
			const friend = await global.prisma.user.findUnique({
				where: {
					id: user.friends[i]
				}
			})

			delete friend.hash
			delete friend.twoFactorSecret

			friends = [...friends, friend]
		}

		return friends
	}

	@UseGuards(Jwt2faGuard)
	@Post('block')
	async blockUser(@Req() req, @Body() body) {
		await this.userService.blockUser(req, body)
	}

	@UseGuards(Jwt2faGuard)
	@Post('addFriend')
	async addFriend(@Req() req, @Body() body) {
		await this.userService.addFriend(req, body)
	}
}

