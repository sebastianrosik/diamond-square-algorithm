DiamondSquareAlgorithm
======================
Generates a terrain by using a diamond square algorithm. [See more info](http://en.wikipedia.org/wiki/Diamond-square_algorithm).


Usage:
-----

A Terrain instance returns a two dimensional Array with value from 0 to 1

```javascript
var terrain = new Terrain({
  size  : 33,
  noise : 5
});

terrain.eachNode(function( value, x, y )){
  console.log('Node:', [x, y], value );
});
```
