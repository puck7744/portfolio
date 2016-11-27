require('browsernizr/test/webgl');
var Modernizr = require('browsernizr');
var THREE = require("three-js")();
var scene, camera, renderer;
var geometry, material, mesh;

function init() {
  //TODO: Update this detection to fall back on a safer method of displaying a
  //      home hero. Maybe a static video or a three.js alternative renderer?
  if (!Modernizr.webgl) return; //No WebGL support in this browser

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.z = 1000;

  geometry = new THREE.BoxGeometry( 200, 200, 200 );
  material = new THREE.MeshBasicMaterial({ color: 0x00aaff, wireframe: true });

  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(0xb6daff);
	renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.getElementById('home-hero').appendChild(renderer.domElement);
  window.addEventListener('resize', onWindowResize, false);
}

function animate() {
  requestAnimationFrame(animate);

  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.02;

  renderer.render(scene, camera);
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

init();
animate();
