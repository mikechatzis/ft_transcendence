import { IsNotEmpty, IsString, Matches } from "class-validator";

export class UsernameDto {
	@Matches(/^[a-zA-Z][a-zA-Z0-9.-]{1,20}$/, {
		message: "First character has to be a letter, others must be alphanumeric, dots or hyphens. Username must contain 2-20 characters"
	})
	@IsString()
	@IsNotEmpty()
	name: string;
}