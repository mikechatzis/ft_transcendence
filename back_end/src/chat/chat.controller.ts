import { Body, Controller, ForbiddenException, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { Jwt2faGuard } from '../auth/guard';
import { ChatService } from './chat.service';
import { ChannelDto } from './dto/channel.dto';

@Controller('chat')
export class ChatController {
	constructor(private chatService: ChatService) {}

	@UseGuards(Jwt2faGuard)
	@Get('channels')
	async getAllChannels() {
		return await this.chatService.getAllChannels()
	}

	@UseGuards(Jwt2faGuard)
	@Get(':name/users')
	async getChannelMembers(@Param('name') name) {
		return await this.chatService.getChannelMembers(name)
	}

	@UseGuards(Jwt2faGuard)
	@Post('new')
	async createNewChannel(@Req() req, @Body() body: ChannelDto) {
		await this.chatService.createNewChannel(req, body)
	}

	@UseGuards(Jwt2faGuard)
	@Post('join/:name')
	async joinChannel(@Req() req, @Param('name') name, @Body() body) {
		await this.chatService.joinChannel(req, name, body.password)
	}

	@UseGuards(Jwt2faGuard)
	@Post('leave/:name')
	async leaveChannel(@Req() req, @Param('name') name) {
		await this.chatService.leaveChannel(req, name)
	}

	@UseGuards(Jwt2faGuard)
	@Post('delete/:name')
	async deleteChannel(@Req() req, @Param('name') name) {
		await this.chatService.deleteChannel(req, name)
	}

	@UseGuards(Jwt2faGuard)
	@Post('change-pass/:name')
	async changePassword(@Req() req, @Param('name') name, @Body() body) {
		await this.chatService.changePassword(req, name, body)
	}

	@UseGuards(Jwt2faGuard)
	@Get(':name/messages')
	async getChannelMessages(@Param('name') name, @Req() req) {
		const channel = await global.prisma.channel.findUnique({
			where: {
				name
			}
		})

		const user = req.user

		if (!channel.blocked.includes(user.id)) {
			return channel.messages
		}
		throw new ForbiddenException("Not allowed")
	}

	@UseGuards(Jwt2faGuard)
	@Get(':name/admins')
	async getChannelAdmins(@Param('name') name) {
		const channel = await global.prisma.channel.findUnique({
			where: {
				name
			}
		})
		return channel.admins
	}

	@UseGuards(Jwt2faGuard)
	@Post(':name/permaban')
	async permabanUser(@Req() req, @Param('name') name, @Body() body) {
		await this.chatService.handleBan(req, name, body)
	}

	@UseGuards(Jwt2faGuard)
	@Post(':name/ban')
	async banUser(@Req() req, @Param('name') name, @Body() body) {
		await this.chatService.handleBan(req, name, body)
		setTimeout(async () => {
			const channel = await global.prisma.channel.findUnique({
				where: {
					name
				}
			})
			
			const index = channel.blocked.indexOf(body.id)
			if (index > -1) {
				channel.blocked.splice(index, 1)
				await global.prisma.channel.update({
					where: {
						name
					},
					data: {
						blocked: channel.blocked
					}
				})
			}
		}, 900000)
	}

	@UseGuards(Jwt2faGuard)
	@Get(':name/isBanned')
	async isUserBanned(@Param('name') name, @Req() req) {
		const user = req.user

		const channel = await global.prisma.channel.findUnique({
			where: {
				name
			}
		})

		if (channel.blocked.includes(user.id)) {
			return {banned: true}
		}
		return {banned: false}
	}

	@UseGuards(Jwt2faGuard)
	@Get(":name/isBanned/:id")
	async isUserBannedId(@Param('name') name, @Param('id') id) {
		const user = await global.prisma.user.findUnique({
			where: {
				id
			}
		})

		const channel = await global.prisma.channel.findUnique({
			where: {
				name
			}
		})

		if (channel.blocked.includes(user.id)) {
			return ({banned: true})
		}
		return ({banned: false})
	}
}
