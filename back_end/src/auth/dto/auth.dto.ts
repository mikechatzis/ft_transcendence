import {  IsString, IsNotEmpty, IsAlpha, Matches } from 'class-validator'

export class AuthDto {
	@Matches(/^[a-zA-Z][a-zA-Z0-9.-]+$/, {
		message: "First character has to be a letter, others must be alphanumeric, dots or hyphens"
	})
	@IsNotEmpty()
	name: string;

	@IsString()
	@IsNotEmpty()
	password: string;
}