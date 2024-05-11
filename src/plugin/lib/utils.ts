export const findClosestNumberIndex = (arr: number[], target: number): number => {
	return arr.reduce((prev, curr, index) => {
	  return Math.abs(curr - target) < Math.abs(arr[prev] - target) ? index : prev;
	}, 0);
  }