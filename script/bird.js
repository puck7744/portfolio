var THREE = require('three-js')();

// File based on https://threejs.org/examples/obj/Bird.js
var Bird = function () {
	var scope = this;

	THREE.Geometry.call( this );

	// Head vertices
	v( 4.9,    0,    0);
	v( 3.5, -1.5,    0);
	v( 2.0,    0,    0);

	// Body vertices
	v( 3.2, -0.5,    0);
	v(-3.9, -0.4,    0);
	v( 0.5,  1.2,    0);

	// Tail vertices
	v(-2.5, -0.2,    0);
	v(-5.5, -1.6,    0);
	v(-6.5,  0.3,    0);

	// Wing diamond
	v(   0,   2, - 6 );
	v(   0,   2,   6 );
	v(   2,   0,   0 );
	v( - 3,   0,   0 );

	//Body faces
	f3(0, 1, 2);
	f3(3, 4, 5);
	f3(6, 7, 8);

	//Wing faces
	f3( 9, 11, 12);
	f3(10, 11, 12);

	this.computeFaceNormals();

	function v(x, y, z) {
		scope.vertices.push(new THREE.Vector3(x, y, z));
	}

	function f3(a, b, c) {
		scope.faces.push(new THREE.Face3(a, b, c));
	}
}

Bird.prototype = Object.create( THREE.Geometry.prototype );
Bird.prototype.constructor = Bird;

module.exports = Bird;
