import Ball from "./ball.js"
import Paddle from "./paddle.js"

const ball = new Ball(document.getElementById("ball"))
const playerPaddle = new Paddle(document.getElementById("player-paddle"))
const computerPaddle = new Paddle(document.getElementById("computer-paddle"))
const playerScoreElem = document.getElementById("player-score")
const computerScoreElem = document.getElementById("computer-score")

const buttons = document.getElementById("buttons")

let playerVictories = 0
let computerVictories = 0

let lastTime 
function update(time) {
	if (lastTime){
		const delta = time - lastTime
		ball.update(delta, [playerPaddle.rect(), computerPaddle.rect()])
		computerPaddle.update(delta, ball.y)
		const hue = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--hue"))
		document.documentElement.style.setProperty("--hue", (hue + delta * 0.01).toString())

		if (lose()) {
			handleLose()
		}
		if (playerScoreElem.textContent == '3' ) {

			playerVictories++
			//buttons.style.visibility = 'visible'
			console.log("player 1 won, score: player: %d, computer %d", playerVictories, computerVictories)
			return
		}
		else if (computerScoreElem.textContent == '3'){
			computerVictories++
			//buttons.style.visibility = 'visible'
			console.log("computer won, score: player: %d, computer %d", playerVictories, computerVictories)
			return
		}
	}
	
	lastTime = time
	window.requestAnimationFrame(update)
}

function handleLose() {
	const rect = ball.rect()
	if (rect.right >= window.innerWidth)
		playerScoreElem.textContent = (parseInt(playerScoreElem.textContent) + 1).toString()
	else
		computerScoreElem.textContent = (parseInt(computerScoreElem.textContent) + 1).toString()
	ball.reset()
	computerPaddle.reset()
}

function lose() {
	const rect = ball.rect()
	return rect.right >= window.innerWidth || rect.left <= 0
}

window.requestAnimationFrame(update)
document.addEventListener("mousemove", e => {
	playerPaddle.position = e.y / window.innerHeight * 100
})

window.restart = function() {
	playerScoreElem.textContent = 0
	computerScoreElem.textContent = 0
	buttons.style.visibility = 'hidden'
	ball.reset()
	computerPaddle.reset()
	window.requestAnimationFrame(update)
	//window.requestAnimationFrame(update) //frame bug requires second call
}
