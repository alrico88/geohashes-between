import bearing from '@turf/bearing';
import {bearingToAzimuth, Coord} from '@turf/helpers';
import {processNumber} from 'number-helper-functions';

/**
 * Gets the bearing between two points
 * 0-359
 *
 * @export
 * @param {Coord} pointA [lon, lat] start
 * @param {Coord} pointB [lon, lat] end
 * @return {number} The bearing
 */
export function getBearingBetweenPoints(pointA: Coord, pointB: Coord): number {
  return processNumber(bearingToAzimuth(bearing(pointA, pointB)), 0);
}
