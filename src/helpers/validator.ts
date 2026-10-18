import type { Position } from 'geojson';
import {
  check,
  finite,
  integer,
  maxValue,
  minValue,
  number,
  parse,
  pipe,
  string,
  tuple,
} from 'valibot';

const precisionMessage = 'Precision should be a number between 1 and 12';
const precisionSchema = pipe(
  number(precisionMessage),
  integer(precisionMessage),
  minValue(1, precisionMessage),
  maxValue(12, precisionMessage),
);
const positionSchema = tuple([
  pipe(number(), finite(), minValue(-180), maxValue(180)),
  pipe(number(), finite(), minValue(-90), maxValue(90)),
]);
const geohashPairSchema = pipe(
  tuple([string(), string()]),
  check(
    ([start, end]) => start.length === end.length,
    'Both geohashes should be of the same length',
  ),
);

/**
 * @param precision - Integer geohash precision from 1 to 12.
 * @throws {ValiError} If precision is outside the supported range or not an integer.
 */
export function validatePrecision(precision: number): void {
  parse(precisionSchema, precision);
}

/**
 * @param point - Coordinate with longitude and latitude, optionally altitude.
 * @throws {ValiError} If longitude or latitude is missing, non-finite or out of range.
 */
export function validatePosition(point: Position): void {
  parse(positionSchema, point);
}

/**
 * @param geohashA - Starting geohash.
 * @param geohashB - Ending geohash, which must have the same length.
 * @throws {ValiError} If the inputs are not strings of matching length.
 */
export function validateSamePrecisionGeohashes(
  geohashA: string,
  geohashB: string,
): void {
  parse(geohashPairSchema, [geohashA, geohashB]);
}
