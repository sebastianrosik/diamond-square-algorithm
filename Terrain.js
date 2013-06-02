/**

Generates a terrain by using a diamond square algorithm. 
http://en.wikipedia.org/wiki/Diamond-square_algorithm


Usage:

A Terrain instance returns a two dimensional Array witch value from 0 to 1

var terrain = new Terrain({
  size  : 33,
	noise : 5
});


terrain.eachNode(function( value, x, y )){
	console.log('Node:', [x, y], value );
});

**/
var Terrain = function( options ){
	this.size  = 9;
	this.noise  = 0.1;
	this.deviation = 5;
	this.roughness = 13;

	for( var i in options ) this[ i ] = options[ i ];

	this.generate();

	this.map.size     = this.size;
	this.map.eachNode = this.eachNode;

	return this.map;
}

Terrain.prototype = {
	// Iterates through each node and 
	// executes the given function (fn) 
	// with three arguments:
	//  - value of the node (from 0 to 1)
	//  - x index
	//  - y index
	eachNode : function( fn ){
		for( var x = 0; x < this.size; ++x ) {
			for( var y = 0; y < this.size; ++y ) {
				fn( this[ x ][ y ], x, y );
			}
		}
	},

	// Generates the terrain
	generate : function(){
		this.map = [];
		
		var w = this.size;
		while(w--) {
			var h = this.size;
			if ( typeof this.map[ w ] == 'undefined' ) this.map[ w ] = [];
			while(h--) {
				this.map[ w ][ h ] = null;
			}
		}

		this.set( 0              , 0               , Math.random() * 1 );
		this.set( this.size - 1 , 0               , Math.random() * 1 );
		this.set( this.size - 1 , this.size - 1 , Math.random() * 1 );
		this.set( 0              , this.size - 1 , Math.random() * 1 );

		this.set( Math.floor( this.size / 2 ), Math.floor( this.size / 2 ), Math.random() * 1);

		this.subdivide( 0, 0, this.size - 1 , 1);
	},

	// Sets the value of a node
	set : function( x, y, value ){
		if ( this.map[ x ][ y ] == null ) {
			this.map[ x ][ y ] = value;
		}
	},

	// Gets the value of a node
	get : function( x, y ){
		return this.map[ x ][ y ];
	},

	// Returns the average value of given numbers (arguments)
	average : function(){
		var sum = 0;
		for( var i = 0, l = arguments.length ; i < l; ++i ) {
			sum += arguments[i];
		}
		return ( sum / arguments.length )// + ( Math.random() - 0.5 ) / deviation * 15 ;
	},

	// Fits the given number between 0 - 1 range.
	constrain  : function( num ){
	    return num < 0 ? 0 : num > 1 ? 1 : num;
	},


	// Returns a displacement value.
	displace : function( num, roughness ){
	    var max = num / (this.size + this.size) * roughness;
	    return ( Math.random() - 0.5 ) * max;
	},

	// Subdivides the terrain recursively.
	subdivide : function( x, y, s, level ){
		if ( s > 1 ) {
			var half_size = Math.floor( s / 2 );

			var midpoint_x = x + half_size,
				midpoint_y = y + half_size;

		 	var roughness = this.noise / level;

			// Diamond stage
			var top_left     = this.get( x     , y     ),
				top_right    = this.get( x + s , y     ),
				bottom_left  = this.get( x     , y + s ),
				bottom_right = this.get( x + s , y + s );
			
		 	midpoint_value = this.constrain( this.average( top_left, top_right, bottom_right, bottom_left ) + this.displace( half_size + half_size, roughness ) )
			
			this.set(midpoint_x, midpoint_y, midpoint_value );

		 	// Square stage
			var top_x = x + half_size,
		 		top_y = y;

		 	var right_x = x + s,
		 		right_y = y + half_size;

		 	var bottom_x = x + half_size,
		 		bottom_y = y + s;

		 	var left_x = x,
		 		left_y = y + half_size;

			var top_value    = this.constrain( this.average( top_left    , top_right    ) + this.displace( half_size + half_size, roughness ) ),
				right_value  = this.constrain( this.average( top_right   , bottom_right ) + this.displace( half_size + half_size, roughness ) ),
				bottom_value = this.constrain( this.average( bottom_left , bottom_right ) + this.displace( half_size + half_size, roughness ) ),
				left_value   = this.constrain( this.average( top_left    , bottom_left  ) + this.displace( half_size + half_size, roughness ) );

		 	this.set( top_x    , top_y    , top_value    );
		 	this.set( right_x  , right_y  , right_value  );
		 	this.set( bottom_x , bottom_y , bottom_value );
		 	this.set( left_x   , left_y   , left_value   );

		 	this.subdivide( x          , y          , half_size, level + 1 );
		 	this.subdivide( x          , midpoint_y , half_size, level + 1 );
		 	this.subdivide( midpoint_x , midpoint_y , half_size, level + 1 );
		 	this.subdivide( midpoint_x , y          , half_size, level + 1 );
		} 
	} 
}
