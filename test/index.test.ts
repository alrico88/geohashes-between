import {describe, test, expect} from 'vitest';
import {getBBoxRingGeohashes, getGeohashesBetweenCoordinates, getGeohashesBetweenTwoGeohashes} from '../src';
import {BBox} from '../src/helpers/geohash';


describe('Test getting geohashes in between two geohashes', () => {
  test('Start and end geohashes should not be included in results by default', () => {
    const startEndGeohashes = ['ezep', 'ezex'];
    expect(getGeohashesBetweenTwoGeohashes(startEndGeohashes[0], startEndGeohashes[1]).some((d) => startEndGeohashes.includes(d))).toBe(false);
  });

  test('If desired start and end geohashes should be included in results', () => {
    const startEndGeohashes = ['ezep', 'ezex'];
    expect(getGeohashesBetweenTwoGeohashes(startEndGeohashes[0], startEndGeohashes[1], true).some((d) => startEndGeohashes.includes(d))).toBe(true);
  });

  test('If desired start and end geohashes should be included in results', () => {
    const startEndGeohashes = ['ezep', 'ezex'];
    expect(getGeohashesBetweenTwoGeohashes(startEndGeohashes[0], startEndGeohashes[1])).toStrictEqual(['ezer']);
  });

  test('An error should be thrown if both geohashes are not the same length', () => {
    expect(() => {
      getGeohashesBetweenTwoGeohashes('ez', 'ezy');
    }).toThrow();
  });
});


describe('Test coords methods', () => {
  test('Coordinates in same geohash should return only one for that precision', () => {
    expect(getGeohashesBetweenCoordinates([-5.646972656250001, 36.679433365517774], [-5.654869079589845, 36.667592771893275], 5)).toStrictEqual(['eyebx']);
  });

  test('Coordinates in different geohashes should return more than one geohash', () => {
    expect(getGeohashesBetweenCoordinates([-5.646972656250001, 36.679433365517774], [-5.595640857204868, 36.68808899697991], 5)).toStrictEqual(['eyebx', 'eys08']);
  });

  test('Test a few more geohashes between', () => {
    expect(getGeohashesBetweenCoordinates([-5.646972656250001, 36.679433365517774], [-5.52103918210534, 36.67588866176514], 5)).toStrictEqual(['eyebx', 'eys08', 'eys09', 'eys0d']);
  });
});

describe('Test BBox methods', () => {
  test('Should return more than one geohash for a valid BBox that encompasses more than one geohash', () => {
    const bbox: BBox = [-4.702112, 39.287546, -2.76849, 41.286062];

    expect(getBBoxRingGeohashes(bbox, 7).length).toBeGreaterThan(0);
  });

  test('Should return only one geohash is BBox is fully inside a geohash', () => {
    const bbox: BBox = [-4.702112, 39.287546, -2.76849, 41.286062];

    expect(getBBoxRingGeohashes(bbox, 1).length).toStrictEqual(1);
  });

  test('Resulting geohashes should have no duplicates', () => {
    const bbox: BBox = [-4.702112, 39.287546, -2.76849, 41.286062];
    const list = getBBoxRingGeohashes(bbox, 7);
    const uniques = [...new Set(list)];

    expect(uniques.length).toStrictEqual(list.length);
  });
});
