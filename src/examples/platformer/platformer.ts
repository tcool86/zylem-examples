import { Zylem, THREE } from '@tcool86/zylem';
import { Ground } from "./ground";
import { Player } from "./player";
import { coinImage } from './assets';

const { create, ThirdPerson, Sprite, Zone } = Zylem;
const { Color, Vector3 } = THREE;

export function Coin({ position = new Vector3(0, 0, 0) }) {
	return {
		name: `coin`,
		type: Sprite,
		sensor: true,
		images: [coinImage],
		setup: (entity: any) => {
			entity.setPosition(position.x, position.y, position.z);
		},
		collision: (coin: any, other: any, { gameState }: any) => {
			if (other.name === 'player') {
				gameState.globals.score += 100;
				coin.destroy();
			}
		},
		destroy: () => { }
	}
}

function Goal() {
	return {
		debug: true,
		type: Zone,
		name: 'goal',
		props: {
			hasEntered: false,
		},
		size: new Vector3(20, 10, 20),
		setup(entity: any) {
			entity.setPosition(30, -3, 0);
		},
		update: (delta: number, { entity: goal }: any) => {
			if (!goal._debugMesh) {
				return;
			}
			goal._debugMesh.material.color = new Color(Color.NAMES.limegreen);
			if (goal.hasEntered) {
				goal._debugMesh.material.color = new Color(Color.NAMES.darkorange);
			}
			goal.hasEntered = false;
		},
		collision: (goal: any, other: any, { gameState }: any) => {
			if (other.name === 'player') {
				goal.hasEntered = true;
			}
		}
	}
}

const game = create({
	id: 'platformer',
	globals: {
		score: 0,
		lives: 3,
		time: 0,
		actualTime: 0,
	},
	stages: [
		{
			id: 'level-1',
			perspective: ThirdPerson,
			gravity: new Vector3(0, -10, 0),
			backgroundColor: new Color(0xA1ADFF),
			conditions: [
				(globals, game) => {
					if (globals.lives <= 0) {
						game.reset();
					}
				}
			],
			setup: ({ scene, HUD }) => {
				// TODO: fix HUD for perspective camera
				HUD.createText({
					text: '0',
					binding: 'score',
					position: { x: -10, y: 10, z: 10 }
				});
				HUD.createText({
					text: '0',
					binding: 'time',
					position: { x: 15, y: 10, z: 10 }
				});
			},
			children: ({ gameState }) => {
				return [
					Player(),
					Coin({ position: new Vector3(10, 0, 0) }),
					Coin({ position: new Vector3(12, 0, 0) }),
					Coin({ position: new Vector3(14, 0, 0) }),
					Coin({ position: new Vector3(16, 0, 0) }),
					Coin({ position: new Vector3(18, 0, 0) }),
					Coin({ position: new Vector3(20, 0, 0) }),
					Coin({ position: new Vector3(22, 0, 0) }),
					Coin({ position: new Vector3(24, 0, 0) }),
					Coin({ position: new Vector3(26, 0, 0) }),
					Ground({}),
					Ground({ position: new Vector3(30, -4, 0) }),
					Ground({ position: new Vector3(-30, -4, 0) }),
					Goal()
				];
			},
			update: (delta, { camera, stage, inputs, globals }) => {
				const player = stage.getEntityByName('player');
				const { x, y } = player.getPosition();
				camera.moveCamera(new Vector3(x, y, 0));
				const { actualTime } = globals;
				globals.actualTime = actualTime + delta;
				globals.time = Math.round(actualTime);
			}
		}
	],
});

export default game;