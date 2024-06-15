import { game, stage, actor, box, plane, sphere, sprite, zone, Zylem, THREE, Perspectives } from '@tcool86/zylem';
import woodBox from '../../assets/playground/wood-box.jpg';
import grass from '../../assets/playground/grass.jpg';
import rainMan from '../../assets/playground/rain-man.png';
import timboIdle from '../../assets/playground/idle.fbx';
import timboRun from '../../assets/playground/run.fbx';

const { actionOnRelease, actionWithCooldown, actionOnPress } = Zylem.Util;
const { ThirdPerson } = Perspectives;
const { Color, Vector2, Vector3 } = THREE;

const box1 = box({
	texture: woodBox,
	setup({ entity }) {
		entity.setPosition(9, 3, 30);
		entity.setRotation(14, 16, 4);
	},
});

const zone1 = zone({
	size: new Vector3(5, 20, 30),
	setup({ entity }) {
		entity.setPosition(10, 3, 20);
	},
	onEnter({ entity, other }) {
		console.log('Entered: ', other);
	},
	onExit({ entity, other }) {
		console.log('Exited: ', other);
	}
});

const ground = plane({
	tile: new Vector2(200, 200),
	repeat: new Vector2(4, 6),
	static: true,
	texture: grass,
});

const sphere1 = sphere({
	radius: 2,
	texture: rainMan,
	setup({ entity }) {
		entity.setPosition(-6, 3, 30);
		entity.setRotation(0, -0.25, 0);
	},
});

let lastMovement = new Vector3();
let moving = false;
const actorFactory = (positionX = 0, positionZ = 0) => {
	return actor({
		animations: [timboIdle, timboRun],
		static: false,
		setup({ entity }) {
			entity.setPosition(positionX, 4, positionZ);
			entity.animate(0);
		},
		update({ entity, inputs, camera }) {
			let { horizontal, vertical } = inputs[0];
			const { camera: threeCamera } = camera;
			if (camera?.target?.uuid !== entity.uuid) {
				horizontal = 0;
				vertical = 0;
			}

			let movement = new Vector3();
			movement.setX(horizontal * 12);
			movement.setZ(vertical * 12);

			const forward = new Vector3(0, 0, 1).applyQuaternion(threeCamera.quaternion);
			const right = new Vector3(1, 0, 0).applyQuaternion(threeCamera.quaternion);

			if (Math.abs(horizontal) > 0.2 || Math.abs(vertical) > 0.2) {
				moving = true;
				const deltaVector = new Vector3(movement.x, -9, movement.z)
					.addScaledVector(right, movement.x)
					.addScaledVector(forward, movement.z);
				entity.moveEntity(deltaVector);
				lastMovement = movement;
			} else {
				moving = false;
				const deltaVector = new Vector3(0, -9, 0);
				entity.moveEntity(deltaVector);
			}
			if (moving) {
				entity.animate(1);
			} else {
				entity.animate(0);
			}
			entity.rotateInDirection(lastMovement);
		},
		collision: function (entity: any, other: any, globals?: any): void {
			throw new Error("Function not implemented.");
		}
	})
}

const actor1 = actorFactory(0, 0);
const actor2 = actorFactory(15, 10);
const actor3 = actorFactory(-15, 10);

let cameraIndex = 0;
let targets = [actor1, actor2, actor3];

const stage1 = stage({
	perspective: ThirdPerson,
	backgroundColor: new Color('#88BBFF'),
	gravity: new Vector3(0, -9, 0),
	setup: ({ camera }) => {
		camera.moveCamera(new Vector3(0, 8, 10));
		camera.target = actor1;
	},
	update: ({ camera, inputs }) => {
		const { buttonB, buttonA } = inputs[0];

		actionOnPress(buttonB, () => {
			cameraIndex++;
			if (cameraIndex > 2) {
				cameraIndex = 0;
			}
			camera.target = targets[cameraIndex];
			console.log('start cooldown')
			actionWithCooldown({ timer: 5000, immediate: false }, () => {
				console.log('5 sec cooldown')
			}, () => {

			});
		});

		actionOnRelease(buttonA, () => {
			actor1.moveY(100);
		});
	},
	children: () => {
		return [
			actor1,
			actor2,
			actor3,
			box1,
			sphere1,
			ground,
			zone1,
		]
	},
})

const playground = game({
	id: 'playground',
	globals: {
		score: 0,
		lives: 3,
		time: 0,
		actualTime: 0,
	},
	stages: [stage1]
});

playground.start();