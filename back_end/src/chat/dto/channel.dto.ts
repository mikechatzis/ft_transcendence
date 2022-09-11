import { IsOptional, IsString, Matches } from "class-validator";

export class ChannelDto {
	@Matches(/^[a-zA-Z0-9-_]{1,20}$/, {
		message: "Name must be between 1 and 20 characters, containing letters, digits, underscores or hyphens"
	})
	@IsString()
	name: string;

	@Matches(/^[a-zA-Z0-9-_]{1,20}$/, {
		message: "Password must be between 1 and 20 characters, containing letters, digits, underscores or hyphens"
	})
	@IsOptional()
	password: string;
}