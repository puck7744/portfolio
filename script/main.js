require('browsernizr/test/webgl');
var Modernizr = require('browsernizr');
var THREE = require('three-js')();
var Bird = require('./bird.js');
var Boid = require('./boid.js');

var scene, camera, renderer;
var geometry, material, mesh;
var bird, birds, boid, boids, clouds;

function init() {
  //TODO: Update this detection to fall back on a safer method of displaying a
  //      home hero. Maybe a static video or a three.js alternative renderer?
  if (!Modernizr.webgl) return; //No WebGL support in this browser

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 2000);
  camera.position.z = 500;

  birds = [];
  boids = [];
  birdmat = new THREE.MeshBasicMaterial( { color: 0x333333, side: THREE.DoubleSide, } );
  for ( var i = 0; i < 75; i ++ ) {
    boid = boids[i] = new Boid();

    boid.position.x = Math.random() * 400 - 200;
    boid.position.y = -400;
    boid.position.z = Math.random() * 400 - 200;

    boid.velocity.x = 1;
    boid.velocity.y = 1;
    boid.velocity.z = 0;

    boid.setAvoidWalls(true);
    boid.setWorldSize(500, 500, 400);

    bird = birds[i] = new THREE.Mesh( new Bird(), birdmat );
    bird.phase = Math.floor( Math.random() * 62.83 );

    scene.add(bird);
  }

  scene.fog = new THREE.Fog(0x3590D9, 200, 1500);

  var texture = (new THREE.TextureLoader()).load('/img/cloud.png', null, animate);
  texture.magFilter = THREE.LinearMipMapLinearFilter;
  texture.minFilter = THREE.LinearMipMapLinearFilter;

  var cloudmat = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    opacity: 0.8,
    depthWrite: false,
    depthTest: true
  });

  var chunk = new THREE.Geometry();
  var plane = new THREE.Mesh(new THREE.PlaneGeometry(64, 64));

  for (var i = 0; i < 1000; i++) {
    plane.position.x = Math.random() * 2500 - 1250;
    plane.position.y = - Math.random() * Math.random() * 100 - 100;
    plane.position.z = -2000 + i;
    plane.rotation.z = Math.random()*Math.sign(Math.random()-0.5);
    plane.scale.x = plane.scale.y = Math.random() * Math.random() * 1.5 + 1.5;
    plane.updateMatrix();

    chunk.merge(plane.geometry, plane.matrix);
  }

  clouds = new THREE.Mesh(chunk, cloudmat);
  var duplicate = new THREE.Mesh(chunk, cloudmat);
  duplicate.position.z = 1000;
  duplicate.updateMatrix();
  clouds.geometry.merge(duplicate.geometry, duplicate.matrix);
  scene.add(clouds);

  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.getElementById('home-hero').appendChild(renderer.domElement);

  document.addEventListener( 'mousemove', onDocumentMouseMove, false );
  window.addEventListener('resize', onWindowResize, false);
}

var lastTime = new Date().getTime();
function animate() {
  var currentTime = new Date().getTime();
  if (currentTime-lastTime > 16) {
    var phase = currentTime/20;
    var phase2 = currentTime/1000;

    for (var i = 0, l = birds.length; i < l; i++) {
      boid = boids[i];
      boid.run(boids);

      bird = birds[i];
      bird.position.copy(boids[i].position);

      bird.rotation.y = Math.atan2( - boid.velocity.z, boid.velocity.x );
      bird.rotation.z = Math.asin( boid.velocity.y / boid.velocity.length() );

      if (boid.velocity.y < 0) bird.geometry.vertices[5].y = bird.geometry.vertices[4].y = 0;
      else bird.geometry.vertices[5].y = bird.geometry.vertices[4].y = Math.sin(bird.phase+phase) * 5;
      // bird.geometry.vertices[5].y = bird.geometry.vertices[4].y = Math.sin(bird.phase+phase)*Math.max(0, Math.sign(Math.sin(bird.phase+phase2))) * 5;
      bird.geometry.verticesNeedUpdate = true;
    }

    lastTime = currentTime;
  }

  clouds.position.z = 500 + currentTime*0.01 % 1000;

  renderer.render(scene, camera);

  requestAnimationFrame(animate);
}

function onDocumentMouseMove( event ) {
  var vector = new THREE.Vector3( event.clientX - (window.innerWidth / 2), - event.clientY + (window.innerHeight / 2), 0 );
  for (var i = 0, l = boids.length; i < l; i++) {
    boid = boids[i];
    vector.z = boid.position.z;
    boid.repulse(vector);
  }
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

init();
animate();
