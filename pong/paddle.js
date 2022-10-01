const SPEED = 0.02

export default class Paddle {
	constructor(paddleElem){
		this.paddleElem = paddleElem
		this.reset
	}

	get position() {
		return parseFloat( getComputedStyle(this.paddleElem).getPropertyValue("--position"))
	}

	set position(value) {
		this.paddleElem.style.setProperty("--position", value)
	}

	update(time, position) {
		this.position += SPEED * time * (position - this.position)
	}

	rect() {
		return this.paddleElem.getBoundingClientRect()
	}

	reset() {
		this.position = 50
	}
}
