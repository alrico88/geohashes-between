import ngeohash from 'ngeohash';
import { ValiError } from 'valibot';
import { assert, describe, expect, test } from 'vitest';
import {
  getBBoxRingGeohashes,
  getGeohashesBetweenCoordinates,
  getGeohashesBetweenTwoGeohashes,
} from '../src';
import { getGeohashBBox } from '../src/helpers/geohash';
import { firstContact, geometryCases, oracle } from './support/geometry';

const sorted = (hashes: string[]) => [...hashes].sort();

describe('grid-cross integration', () => {
  test.each(geometryCases)(
    '$name matches independent intersections',
    ({ from, to, precision }) => {
      const actual = getGeohashesBetweenCoordinates(from, to, precision);
      const expected = oracle(from, to, precision);

      expect(sorted(actual)).toEqual(sorted(expected));
      expect(new Set(actual).size).toBe(actual.length);
      expect(
        sorted(getGeohashesBetweenCoordinates(to, from, precision)),
      ).toEqual(sorted(expected));

      const times = actual.map((hash) => {
        const time = firstContact(from, to, getGeohashBBox(hash));

        assert.isDefined(time);

        return time;
      });

      expect(times).toEqual([...times].sort((a, b) => a - b));
    },
  );

  test('matches 300 worldwide segments at precision 2', () => {
    let seed = 42;
    const random = () => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;

      return seed / 2 ** 32;
    };

    for (let i = 0; i < 300; i++) {
      const from = [random() * 360 - 180, random() * 180 - 90];
      const to = [random() * 360 - 180, random() * 180 - 90];

      expect(
        sorted(getGeohashesBetweenCoordinates(from, to, 2)),
        `${from} → ${to}`,
      ).toEqual(sorted(oracle(from, to, 2)));
    }
  });

  test('matches local segments at every precision and in every direction', () => {
    for (let precision = 1; precision <= 12; precision++) {
      const [west, south, east, north] = getGeohashBBox(
        ngeohash.encode(40.4, -3.7, precision),
      );
      const width = east - west;
      const height = north - south;

      for (const dx of [-2, -1, 0, 1, 2]) {
        for (const dy of [-2, -1, 0, 1, 2]) {
          const from = [west + width * 0.5, south + height * 0.5];
          const to = [from[0] + width * dx, from[1] + height * dy];

          if (Math.abs(to[0]) > 180 || Math.abs(to[1]) > 90) {
            continue;
          }

          expect(
            sorted(getGeohashesBetweenCoordinates(from, to, precision)),
          ).toEqual(sorted(oracle(from, to, precision)));
        }
      }
    }
  });

  test('ring matches the union of four independently checked edges', () => {
    const bbox: [number, number, number, number] = [-22.5, -11.25, 22.5, 11.25];
    const corners = [
      [bbox[0], bbox[3]],
      [bbox[2], bbox[3]],
      [bbox[2], bbox[1]],
      [bbox[0], bbox[1]],
    ];
    const expected = new Set(
      corners.flatMap((from, i) => oracle(from, corners[(i + 1) % 4], 2)),
    );

    expect(sorted(getBBoxRingGeohashes(bbox, 2))).toEqual([...expected].sort());
  });

  test('preserves boundary sides at every precision', () => {
    for (let precision = 1; precision <= 12; precision++) {
      const [west, south, east, north] = getGeohashBBox(
        ngeohash.encode(40.4, -3.7, precision),
      );
      const width = east - west;
      const height = north - south;

      for (const direction of [-1, 1]) {
        const from = [west + width * 0.25, south + height * 0.25];
        const to = [
          east + direction * Math.abs(east) * Number.EPSILON,
          south + height * 0.75,
        ];
        const expected = sorted(oracle(from, to, precision));

        expect(
          sorted(getGeohashesBetweenCoordinates(from, to, precision)),
        ).toEqual(expected);
        expect(
          sorted(getGeohashesBetweenCoordinates(to, from, precision)),
        ).toEqual(expected);
      }
    }
  });

  test('same geohash is returned once only when endpoints are included', () => {
    expect(getGeohashesBetweenTwoGeohashes('ezep', 'ezep')).toEqual([]);
    expect(getGeohashesBetweenTwoGeohashes('ezep', 'ezep', true)).toEqual([
      'ezep',
    ]);
  });

  test.each([1.5, -1, -Infinity])(
    'rejects non-integer or invalid precision %s',
    (precision) => {
      expect(() =>
        getGeohashesBetweenCoordinates([0, 0], [0, 0], precision),
      ).toThrow();
    },
  );

  test.each([
    [NaN, 0],
    [0, Infinity],
    [181, 0],
    [-181, 0],
    [0, 91],
    [0, -91],
    [0],
  ])('rejects invalid position %j', (...point) => {
    expect(() => getGeohashesBetweenCoordinates(point, [0, 0], 2)).toThrow(
      ValiError,
    );
    expect(() => getGeohashesBetweenCoordinates([0, 0], point, 2)).toThrow(
      ValiError,
    );
  });
});
