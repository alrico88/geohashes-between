import {getGeohashesBetween} from '../src';

describe('Test getting geohashes in between two geohashes', () => {
  test('Start and end geohashes should not be included in results by default', () => {
    const startEndGeohashes = ['ezep', 'ezex'];
    expect(getGeohashesBetween(startEndGeohashes[0], startEndGeohashes[1], 'e').some((d) => startEndGeohashes.includes(d))).toBe(false);
  });

  test('If desired start and end geohashes should be included in results', () => {
    const startEndGeohashes = ['ezep', 'ezex'];
    expect(getGeohashesBetween(startEndGeohashes[0], startEndGeohashes[1], 'e', true).some((d) => startEndGeohashes.includes(d))).toBe(true);
  });

  test('If desired start and end geohashes should be included in results', () => {
    const startEndGeohashes = ['ezep', 'ezex'];
    expect(getGeohashesBetween(startEndGeohashes[0], startEndGeohashes[1], 'e')).toStrictEqual(['ezer']);
  });
});
