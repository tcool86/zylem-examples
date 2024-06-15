import { game, stage, Perspectives, THREE } from '@tcool86/zylem';
import { Invader } from "./invader";
import { Player } from "./player";

const { Flat2D } = Perspectives;
const { Color, Vector2 } = THREE;

const spaceInvaders = game({
	id: 'space-invaders',
	globals: {
		score: 0,
		lives: 3,
		invaderCount: 0,
	},
	stages: [stage({
		perspective: Flat2D,
		backgroundColor: new Color(Color.NAMES.black),
		conditions: [
			{
				bindings: ['score', 'lives'],
				callback: (globals, game) => {
					const { lives } = globals;
					if (lives.get() <= 0) {
						game.reset();
					}
				}
			}
		],
		setup: ({ HUD }) => {
			HUD.addText('0', {
				binding: 'score',
				update: (element, value) => {
					element.text = `Score: ${value}`;
				},
				position: new Vector2(50, 5)
			});
			HUD.addText('3', {
				binding: 'lives',
				update: (element, value) => {
					element.text = `Lives: ${value}`;
				},
				position: new Vector2(25, 5)
			});
		},
		children: ({ globals }) => {
			const { invaderCount } = globals;
			const invaders: any[] = [];
			for (let i = -8; i <= 8; i += 2) {
				for (let j = 8; j >= 4; j -= 2) {
					const invader = Invader(i, j);
					invaders.push(invader);
				}
			}
			invaderCount.set(invaders.length);
			return [
				Player(),
				...invaders
			]
		},
	})],
});

spaceInvaders.start();