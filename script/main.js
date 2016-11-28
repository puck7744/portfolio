require('browsernizr/test/webgl');
var Modernizr = require('browsernizr');
var THREE = require("three-js")();
var Bird = require('./bird.js');
var Boid = require('./boid.js');

var scene, camera, renderer;
var geometry, material, mesh;

function init() {
  //TODO: Update this detection to fall back on a safer method of displaying a
  //      home hero. Maybe a static video or a three.js alternative renderer?
  if (!Modernizr.webgl) return; //No WebGL support in this browser

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.z = 450;

  birds = [];
  boids = [];
  birdmat = new THREE.MeshPhongMaterial( { color: 0x808080, side: THREE.DoubleSide } );
  for ( var i = 0; i < 75; i ++ ) {
    boid = boids[ i ] = new Boid();
    boid.position.x = Math.random() * 400 - 200;
    boid.position.y = Math.random() * 400 - 200;
    boid.position.z = Math.random() * 400 - 200;
    boid.velocity.x = 1;
    boid.velocity.y = 0;
    boid.velocity.z = 0;
    boid.setAvoidWalls(true);
    boid.setWorldSize(500, 500, 400);
    bird = birds[ i ] = new THREE.Mesh( new Bird(), birdmat );
    bird.phase = Math.floor( Math.random() * 62.83 );
    scene.add(bird);
  }
  var verticesOfCube = [
      -1,-1,-1,    1,-1,-1,    1, 1,-1,    -1, 1,-1,
      -1,-1, 1,    1,-1, 1,    1, 1, 1,    -1, 1, 1,
  ];
  var indicesOfFaces = [
      2,1,0,    0,3,2,
      0,4,7,    7,3,0,
      0,1,5,    5,4,0,
      1,2,6,    6,5,1,
      2,3,7,    7,6,2,
      4,5,6,    6,7,4
  ];
  var cloudmat = new THREE.MeshPhongMaterial( { color: 0xeeeeee, shading: THREE.FlatShading } );

  for ( var c = 0; c < 5; c ++ ) {
    var cloud = new THREE.Group();
    for ( var i = 0; i < 10; i ++ ) {
      var part = new THREE.Mesh(new THREE.PolyhedronGeometry( verticesOfCube, indicesOfFaces, Math.random()*75+25, 1 ), cloudmat);
      part.position.x = Math.random() * 400 - 200;
      part.position.y = Math.random() * 100 - 50;
      part.position.z = Math.random() * 200 - 100;
      cloud.add(part);
    }
    cloud.position.x = Math.random() * 1000 - 500;
    cloud.position.y = Math.random() * 500 - 250;
    cloud.position.z = Math.random() * -500;
    scene.add(cloud);
  }

  //scene.add(new THREE.AmbientLight(0xffffff));
  hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 1 );
	hemiLight.color.setHSL( 0.095, 0.2, 1 );
	hemiLight.groundColor.setHSL( 0.6, 0.5, 0.8 );
	hemiLight.position.set( 0, 500, 0 );
	scene.add( hemiLight );

  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(0xb6daff);
	renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.getElementById('home-hero').appendChild(renderer.domElement);

  document.addEventListener( 'mousemove', onDocumentMouseMove, false );
  window.addEventListener('resize', onWindowResize, false);
}

function animate() {

  for ( var i = 0, l = birds.length; i < l; i++ ) {
    boid = boids[ i ];
    boid.run( boids );
    bird = birds[ i ];
    bird.position.copy( boids[ i ].position );
    // color = bird.material.color;
    // var factor = (500-bird.position.z) / 1000;
    // color.r = factor * 0.8; color.g = factor * 0.9; color.b = factor * 1.0;
    bird.rotation.y = Math.atan2( - boid.velocity.z, boid.velocity.x );
    bird.rotation.z = Math.asin( boid.velocity.y / boid.velocity.length() );
    bird.phase = ( bird.phase + ( Math.max( 0, bird.rotation.z ) + 0.1 )  ) % 62.83;
    bird.geometry.vertices[ 5 ].y = bird.geometry.vertices[ 4 ].y = Math.sin( bird.phase ) * 5;
  }

  renderer.render(scene, camera);

  requestAnimationFrame(animate);
}

function onDocumentMouseMove( event ) {
  var vector = new THREE.Vector3( event.clientX - (window.innerWidth / 2), - event.clientY + (window.innerHeight / 2), 0 );
  for ( var i = 0, il = boids.length; i < il; i++ ) {
    boid = boids[ i ];
    vector.z = boid.position.z;
    boid.repulse( vector );
  }
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

init();
animate();
