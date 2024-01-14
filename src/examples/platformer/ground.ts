import { Zylem, THREE } from '@tcool86/zylem';

const { Box } = Zylem;
const { Vector3, Color } = THREE;

export function Ground({ position = new Vector3(0, -6, 0), rotation = new Vector3(0, 0, 0) }) {
	return {
		name: `ground`,
		type: Box,
		static: true,
		size: new Vector3(50, 2, 5),
		color: Color.NAMES.yellowgreen,
		props: {},
		setup: (entity: any) => {
			entity.setPosition(position.x, position.y, position.z);
			entity.setRotation(rotation.x, rotation.y, rotation.z);
		},
		update: (_delta: number, { entity, inputs }: any) => { },
	}
}