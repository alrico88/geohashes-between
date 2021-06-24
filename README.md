# geohashes-between

Get a list of geohashes between two geohashes, or between two coordinates.

## Installation

Using npm, `npm i geohashes-between`.

Using yarn, `yarn add geohashes-between`.

## Usage

Using `import`

```javascript
import { getGeohashesBetweenTwoGeohashes } from 'geohashes-between';
```

In a CommonJS environment

```javascript
const { getGeohashesBetweenTwoGeohashes } = require('geohashes-between');
```

Then:

```javascript
const list = getGeohashesBetweenTwoGeohashes('ezep', 'ezex');
// list is ['ezer']
```

## Table of contents

### Functions

- [getGeohashesBetweenCoordinates](modules.md#getgeohashesbetweencoordinates)
- [getGeohashesBetweenTwoGeohashes](modules.md#getgeohashesbetweentwogeohashes)

## Functions

### getGeohashesBetweenCoordinates

▸ **getGeohashesBetweenCoordinates**(`pointA`: Position, `pointB`: Position, `precision`: _number_): _string_[]

Finds the geohashes of a given precision between two coordinates

#### Parameters

| Name        | Type     | Description                    |
| :---------- | :------- | :----------------------------- |
| `pointA`    | Position | Starting coordinate [lon, lat] |
| `pointB`    | Position | End coordinate [lon, lat]      |
| `precision` | _number_ | Desired geohash precision      |

**Returns:** _string_[]

The list of geohashes between those coords

---

### getGeohashesBetweenTwoGeohashes

▸ **getGeohashesBetweenTwoGeohashes**(`geohashStart`: _string_, `geohashEnd`: _string_, `includeStartEnd?`: _boolean_): _string_[]

Gets a list of geohashes between a starting and end geohash
Both geohashes should be of the same precision

#### Parameters

| Name              | Type      | Default value | Description                                                         |
| :---------------- | :-------- | :------------ | :------------------------------------------------------------------ |
| `geohashStart`    | _string_  | -             | The starting geohash                                                |
| `geohashEnd`      | _string_  | -             | The ending geohash                                                  |
| `includeStartEnd` | _boolean_ | false         | Whether to include starting and ending geohash in the returned list |

**Returns:** _string_[]

The list of geohashes between start and end
