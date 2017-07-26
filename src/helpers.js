
// generate random integer in given range:
export function randomRange(minimum, maximum) {
	return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
}
