import { Zylem } from '@tcool86/zylem';

import invader1 from '../../assets/space-invaders/invader-1.png';
import invader2 from '../../assets/space-invaders/invader-2.png';
import invaderShot from '../../assets/space-invaders/invader-shot.png';

const { Sprite } = Zylem.GameEntityType;
const { destroy } = Zylem;
const { Vector3 } = Zylem.THREE;

const invaderSize = new Vector3(0.3, 0.3, 0.3);
const bulletSize = new Vector3(0.1, 0.1, 0.1);

function InvaderBullet({ x = 0, y = -8, health = 2 }) {
	return {
		name: `bullet`,
		type: Sprite,
		size: bulletSize,
		images: [invaderShot],
		props: {},
		setup: (entity: any) => {
			entity.setPosition(x, y, 0);
		},
		update: (_delta: number, { entity: bullet, inputs }: any) => {
			const { y } = bullet.getPosition();
			bullet.moveXY(Math.sin(y) * 8, -15);
			if (y < -10) {
				destroy(bullet);
			}
		},
		collision: (bullet: any, other: any, { gameState }: any) => {
			if (other.name.includes('player')) {
				destroy(bullet);
				other.health--;
			}
		},
		destroy: () => { }
	}
}

export function Invader(x = 0, y = 0, health = 2) {
	return {
		name: `invader_${x}_${y}`,
		type: Sprite,
		size: invaderSize,
		images: [invader1, invader2],
		props: {
			animationRate: 1,
			animationCurrent: 0,
			dropRate: 1.5,
			dropCurrent: 0,
			direction: 1,
			speed: 5,
			fireRate: 2,
			fireChance: 12,
			fireCurrent: 0,
		},
		setup: (entity: any) => {
			entity.setPosition(x, y, 0);
		},
		update: (_delta: number, { entity: invader, inputs }: any) => {
			const { x, y } = invader.getPosition();
			if (invader.animationCurrent < invader.animationRate) {
				invader.animationCurrent += _delta;
			} else {
				invader.sprites[invader.spriteIndex].visible = false;
				invader.spriteIndex = invader.spriteIndex === 0 ? 1 : 0;
				invader.animationCurrent = 0;
				invader.sprites[invader.spriteIndex].visible = true;
			}
			if (invader.dropCurrent < invader.dropRate) {
				invader.dropCurrent += _delta;
			} else {
				invader.dropCurrent = 0;
				invader.direction = invader.direction === 1 ? -1 : 1;
				invader.moveY(-invader.speed);
				return;
			}
			invader.moveX(invader.speed * invader.direction);
			if (invader.fireCurrent < invader.fireRate) {
				invader.fireCurrent += _delta;
			} else {
				invader.fireCurrent = 0;
				const chance = Math.floor(Math.random() * invader.fireChance);
				if (chance <= 6) {
					invader.spawn(InvaderBullet, { x: x, y: y });
				}
			}
		},
		collision: (invader: any, other: any) => {
			if (other.name === 'player') {
				invader.destroy();
				other.health--;
			}
		},
		destroy: () => { }
	}
}