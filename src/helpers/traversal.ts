import type { Position } from 'geojson';
import { traverseGrid } from 'grid-cross';
import ngeohash from 'ngeohash';
import { getGeohashBBox } from './geohash';

/**
 * @param coordinate - Longitude or latitude in degrees.
 * @param origin - Corresponding edge of the starting geohash.
 * @param size - Cell width or height in degrees.
 * @returns Grid coordinate retaining the original side of a rounded boundary.
 */
function normalize(coordinate: number, origin: number, size: number): number {
  const value = (coordinate - origin) / size;
  const boundary = origin + value * size;

  if (Number.isInteger(value) && coordinate !== boundary) {
    return (
      value +
      Math.sign(coordinate - boundary) *
        Math.max(Number.MIN_VALUE, Math.abs(value) * Number.EPSILON)
    );
  }

  return value;
}

/**
 * Traverse a straight segment in longitude/latitude without longitude wrapping.
 * @param pointA - Validated starting coordinate.
 * @param pointB - Validated ending coordinate.
 * @param precision - Validated integer geohash precision.
 * @returns All touched geohashes in first-contact order, including boundary contacts.
 */
export function traverseGeohashes(
  pointA: Position,
  pointB: Position,
  precision: number,
): string[] {
  const start = ngeohash.encode(pointA[1], pointA[0], precision);
  const [west, south, east, north] = getGeohashBBox(start);
  const width = east - west;
  const height = north - south;
  const minColumn = Math.round((-180 - west) / width);
  const maxColumn = Math.round((180 - west) / width) - 1;
  const minRow = Math.round((-90 - south) / height);
  const maxRow = Math.round((90 - south) / height) - 1;
  const geohashes: string[] = [];

  // A local origin retains small offsets that adding 180/90 could round away.
  for (const [column, row] of traverseGrid({
    from: [
      normalize(pointA[0], west, width),
      normalize(pointA[1], south, height),
    ],
    to: [
      normalize(pointB[0], west, width),
      normalize(pointB[1], south, height),
    ],
  })) {
    // The grid is infinite; geohashes only cover the longitude/latitude domain.
    if (
      column < minColumn ||
      column > maxColumn ||
      row < minRow ||
      row > maxRow
    ) {
      continue;
    }

    geohashes.push(
      ngeohash.encode(
        south + (row + 0.5) * height,
        west + (column + 0.5) * width,
        precision,
      ),
    );
  }

  return geohashes;
}
