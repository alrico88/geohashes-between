# geohashes-between

Get a list of geohashes between a starting and end geohash, in a desired direction

## Installation

Using npm, `npm i geohashes-between`.

Using yarn, `yarn add geohashes-between`.

## Usage

Using `import`

```javascript
import { getGeohashesBetween } from 'geohashes-between';
```

In a CommonJS environment

```javascript
const { getGeohashesBetween } = require('geohashes-between');
```

Then:

```javascript
const list = getGeohashesBetween('ezep', 'ezex', 'e');
// list is ['ezer']
```

## Table of contents

### Type aliases

- [Direction](modules.md#direction)

### Functions

- [getGeohashesBetween](modules.md#getgeohashesbetween)

## Type aliases

### Direction

Ƭ **Direction**: `"n"` \| `"ne"` \| `"nw"` \| `"s"` \| `"se"` \| `"sw"` \| `"e"` \| `"w"`

Defined in: index.ts:3

## Functions

### getGeohashesBetween

▸ **getGeohashesBetween**(`geohashStart`: _string_, `geohashEnd`: _string_, `direction`: [_Direction_](modules.md#direction), `includeStartEnd?`: _boolean_): _string_[]

Gets a list of geohashes between a starting and end geohash, in a given direction
Be careful if both geohashes are not in the same grid, as this function will run indefinitely

**`export`**

#### Parameters

| Name              | Type                                | Default value | Description                                                                      |
| :---------------- | :---------------------------------- | :------------ | :------------------------------------------------------------------------------- |
| `geohashStart`    | _string_                            | -             | The starting geohash                                                             |
| `geohashEnd`      | _string_                            | -             | The ending geohash                                                               |
| `direction`       | [_Direction_](modules.md#direction) | -             | The direction to use to calculate the next neighboring geohash between those two |
| `includeStartEnd` | _boolean_                           | false         | -                                                                                |

**Returns:** _string_[]

The list of geohashes between start and end

Defined in: index.ts:27
