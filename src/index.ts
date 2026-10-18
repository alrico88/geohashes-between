import type { Position } from 'geojson';
import ngeohash from 'ngeohash';
import type { BBox } from './helpers/geohash';
import { traverseGeohashes } from './helpers/traversal';
import {
  validatePosition,
  validatePrecision,
  validateSamePrecisionGeohashes,
} from './helpers/validator';

/**
 * Finds the geohashes of a given precision between two coordinates
 *
 * @export
 * @param {Position} pointA Starting coordinate [lon, lat]
 * @param {Position} pointB End coordinate [lon, lat]
 * @param {number} precision Desired geohash precision
 * @return {string[]} The list of geohashes between those coords
 */
export function getGeohashesBetweenCoordinates(
  pointA: Position,
  pointB: Position,
  precision: number,
): string[] {
  validatePrecision(precision);

  validatePosition(pointA);

  validatePosition(pointB);

  return traverseGeohashes(pointA, pointB, precision);
}

/**
 * Gets a list of geohashes between a starting and end geohash
 * Both geohashes should be of the same precision
 *
 * @export
 * @param {string} geohashStart The starting geohash
 * @param {string} geohashEnd The ending geohash
 * @param {boolean} [includeStartEnd=false] Whether to include starting and ending geohash in the returned list
 * @return {string[]} The list of geohashes between start and end
 */
export function getGeohashesBetweenTwoGeohashes(
  geohashStart: string,
  geohashEnd: string,
  includeStartEnd = false,
): string[] {
  validateSamePrecisionGeohashes(geohashStart, geohashEnd);

  const pointA = ngeohash.decode(geohashStart);
  const pointB = ngeohash.decode(geohashEnd);

  const geohashesBetween = getGeohashesBetweenCoordinates(
    [pointA.longitude, pointA.latitude],
    [pointB.longitude, pointB.latitude],
    geohashStart.length,
  );

  return includeStartEnd === true
    ? geohashesBetween
    : geohashesBetween.filter(
        (geohash) => ![geohashStart, geohashEnd].includes(geohash),
      );
}

/**
 * Find the geohashes of a given precision that form a BBox ring
 *
 * @export
 * @param {BBox} bbox The BBox to find the ring geohashes
 * @param {number} precision Precision for the geohashes
 * @returns {string[]} Geohashes list
 */
export function getBBoxRingGeohashes(bbox: BBox, precision: number): string[] {
  const [minLon, minLat, maxLon, maxLat] = bbox;
  const sw = [minLon, minLat];
  const se = [maxLon, minLat];
  const nw = [minLon, maxLat];
  const ne = [maxLon, maxLat];

  const uniqueGeohashes = [
    [nw, ne],
    [ne, se],
    [se, sw],
    [sw, nw],
  ].reduce((acc, coords) => {
    const [start, end] = coords;
    const geohashesBetween = getGeohashesBetweenCoordinates(
      start,
      end,
      precision,
    );

    geohashesBetween.forEach((geohash) => {
      acc.add(geohash);
    });

    return acc;
  }, new Set<string>());

  return Array.from(uniqueGeohashes);
}
