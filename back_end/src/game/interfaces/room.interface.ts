export interface Room {
	room: string,
	player1: string,
	player2: string,
	ballPos: any,
	player1Pos: number,
	player2Pos: number,
	deltaX: number,
	deltaY: number,
	p1Score: number,
	p2Score: number,
	winner: string,
	interval: any
}