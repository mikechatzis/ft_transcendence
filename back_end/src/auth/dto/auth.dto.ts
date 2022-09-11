import {  IsString, IsNotEmpty, IsAlpha, Matches } from 'class-validator'

export class AuthDto {
	@Matches(/^[a-zA-Z][a-zA-Z0-9.-_]{1,20}$/, {
		message: "First character has to be a letter, others must be alphanumeric, dots, hyphens or underscores. Username must contain 2-20 characters"
	})
	@IsString()
	@IsNotEmpty()
	name: string;

	@Matches(/^[a-zA-Z0-9.-_]{6,20}$/, {
		message: "Password must be between 6 and 20 characters, containing letters, digits, underscores or hyphens"
	})
	@IsString()
	@IsNotEmpty()
	password: string;
}