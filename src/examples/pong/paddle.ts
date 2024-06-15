import { box, THREE } from "@tcool86/zylem";
import { board, BoardSide } from './board';

const { Color, Vector3 } = THREE;
const paddleSpeed = 20.0;
const paddleSize = new Vector3(0.5, 4, 1);

export function Paddle(inputKey: number, side: BoardSide, y = 0) {
	return box({
		size: paddleSize,
		name: inputKey ? 'right' : 'left',
		color: new Color(1, 1, 1),
		setup: ({ entity }) => {
			entity.setPosition(board[side], y, 0);
		},
		update: ({ entity: paddle, inputs }) => {
			const { y } = paddle.getPosition();
			const { moveUp, moveDown, buttonW, buttonY } = inputs[inputKey];
			let upPressed = (inputKey) ? buttonW : moveUp;
			let downPressed = (inputKey) ? buttonY : moveDown;
			const canMoveUp = y < board.top;
			const canMoveDown = y > board.bottom;
			if (upPressed && canMoveUp) {
				paddle.moveY(paddleSpeed);
			} else if (downPressed && canMoveDown) {
				paddle.moveY(-paddleSpeed);
			} else {
				paddle.moveY(0);
			}
		},
		destroy: () => { }
	});
}