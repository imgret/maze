/**
 * Function receives an array and returns a new array with randomly reordered elements.
 * It is based on Durstenfeld's shuffle: https://w.wiki/yG8
 * @param array Array to shuffle
 * @returns New instance of shuffled array
 */
export function shuffle<T>(array: T[]) {
  const newArray = Array.from(array);
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

/**
 * Function checks if given value exists in given boundaries (including min and max).
 * @param value Value to check
 * @param min Minimum value for boundary
 * @param max Maximum value for boundary
 */
export function between(value: number, min: number, max: number) {
  return min <= value && value <= max;
}
