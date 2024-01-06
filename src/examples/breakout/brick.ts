import { Zylem, THREE } from '@tcool86/zylem';
const { Box } = Zylem;
const { Color, Vector3 } = THREE;

export function Brick(posX: number, posY: number) {
	return {
		name: `brick`,
		type: Box,
		size: new Vector3(2, 0.5, 1),
		props: {
			health: 2,
		},
		setup: (entity: any) => {
			entity.setPosition(posX, posY, 0);
		},
		update: (_delta: number, { entity: brick }: any) => {
			if (brick.health === 1) {
				brick.mesh.material.color = new Color('aqua');
			}
		},
		collision: (brick: any) => {
			if (brick.health === 0) {
				brick.destroy();
			}
		},
		destroy: (gameState: any) => {
			gameState.globals.bricks--;
			gameState.globals.score += 100;
		}
	}
}