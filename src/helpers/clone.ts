/**
 * Clones an array
 *
 * @export
 * @param {string[]} array Array to clone
 * @return {string[]} Cloned array
 */
export function cloneArray(array: string[]): string[] {
  return JSON.parse(JSON.stringify(array));
}
