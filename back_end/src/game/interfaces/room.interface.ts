export interface Room {
	room: string,
	player1: string,
	player2: string,
	ballPos: any,
	player1Pos: string,
	player2Pos: string,
	deltaX: number,
	deltaY: number,
	p1Score: number,
	p2Score: number,
	winner: string,
	interval: any
}