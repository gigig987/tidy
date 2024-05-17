import chroma from 'chroma-js';

export const findClosestColorIndex = (colorArray: RGB[], targetColor: RGB) => {
	let closestIndex = -1;
	let closestColorDelta = Infinity;

	colorArray.forEach((color, index) => {
		const col1 = chroma([color.r * 255, color.g * 255, color.b * 255]);
		const col2 = chroma([
			targetColor.r * 255,
			targetColor.g * 255,
			targetColor.b * 255,
		]);
		const delta = chroma.deltaE(col1, col2);
		if (delta < closestColorDelta) {
			closestColorDelta = delta;
			closestIndex = index;
		}
	});

	return closestIndex;
};
