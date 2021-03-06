require('browsernizr/test/webgl');
var Modernizr = require('browsernizr');
var THREE = require('three-js')();
var Bird = require('./bird.js');
var Boid = require('./boid.js');

var scene, camera, renderer;
var geometry, material, mesh;
var bird, birds, boid, boids, clouds;
var lastTime = new Date().getTime();

module.exports = {
  init: function() {
    // TODO: Update this detection to fall back on a safer method of displaying
    //       the effect. Maybe a looping video?
    if (!Modernizr.webgl) return; //No WebGL support in this browser

    // --Set up the view and world--
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.z = 500;

    scene.fog = new THREE.Fog(0x64A0D8, 200, 1500);

    /*
      Prepare the bird flock; birds are the graphical representation of the
      boids implementation
    */
    birds = [];
    boids = [];
    birdmat = new THREE.MeshBasicMaterial( { color: 0x333333, side: THREE.DoubleSide, } );
    for (var i = 0; i < 75; i++) {
      boid = boids[i] = new Boid();

      // Create a block of birds below the cloud line
      boid.position.x = Math.random() * 400 - 200;
      boid.position.y = -400;
      boid.position.z = Math.random() * 400 - 200;

      // Give them all the same velocity for better grouping
      boid.velocity.x = 1;
      boid.velocity.y = 1;
      boid.velocity.z = 0;

      // Limit them to the view area
      boid.setAvoidWalls(true);
      boid.setWorldSize(500, 500, 400);

      /*
        Set up the visual representation, assign the material created earlier
        and add random variation to the wing flapping pattern for each bird
      */
      bird = birds[i] = new THREE.Mesh(new Bird(), birdmat);
      bird.phase = Math.floor(Math.random() * 62.83);

      scene.add(bird);
    }

    // --Set up clouds--
    // First load the texture
    var texture = (new THREE.TextureLoader()).load('/img/home/cloud.png');
    texture.magFilter = THREE.LinearMipMapLinearFilter;
    texture.minFilter = THREE.LinearMipMapLinearFilter;

    // Create a cloud material using the texture and give it transparency options
    var cloudmat = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0.8,
      depthWrite: false, //Prevents zbuffer overwrite
      depthTest: true //Allows birds to fly through the clouds
    });

    // Create cloud geometry
    var chunk = new THREE.Geometry();
    var plane = new THREE.Mesh(new THREE.PlaneGeometry(64, 64));

    for (var i = 0; i < 1000; i++) {
      plane.position.x = Math.random() * 2500 - 1250;
      plane.position.y = - Math.random() * Math.random() * 100 - 100;
      plane.position.z = -2000 + i; // Make sure quads are depth ordered

      plane.rotation.z = Math.random()*Math.sign(Math.random()-0.5); // +- 1 Radian

      plane.scale.x = plane.scale.y = Math.random() * Math.random() * 1.5 + 1.5;

      // Make sure the matrix is updated with all of the above operations for the next step
      plane.updateMatrix();

      // Merge the quad into a larger mesh representing half of the clouds
      chunk.merge(plane.geometry, plane.matrix);
    }

    // Create the final cloud mesh starting with the farthest "chunk"
    clouds = new THREE.Mesh(chunk, cloudmat);

    /*
      Create a second "chunk" that's an exact copy of the first and paste it in
      front. This gives a seamless loop point for the animation
    */
    var duplicate = new THREE.Mesh(chunk, cloudmat);
    duplicate.position.z = 1000;
    duplicate.updateMatrix();
    clouds.geometry.merge(duplicate.geometry, duplicate.matrix);

    scene.add(clouds);

    // --Set up the renderer--
    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.getElementById('home-hero').appendChild(renderer.domElement);

    document.addEventListener('mousemove', this.onInteract, false );
    window.addEventListener('resize', this.onResize, false);
  },

  /*
    Animate the birds and clouds
  */
  animate: function() {
    var currentTime = new Date().getTime();
    if (currentTime - lastTime > 16) { // Limit boid simulation rate for fast devices
      var phase = currentTime/20; //Flapping frequency

      for (var i = 0, l = boids.length; i < l; i++) {
        // Run simulation
        boid = boids[i];
        boid.run(boids);

        // Update visual with new location
        bird = birds[i];
        bird.position.copy(boids[i].position);

        // Rotate model orientation to velocity vector
        bird.rotation.y = Math.atan2(-boid.velocity.z, boid.velocity.x);
        bird.rotation.z = Math.asin(boid.velocity.y / boid.velocity.length());

        // Flap wings when ascending, glide when descending
        if (boid.velocity.y < 0) bird.geometry.vertices[9].y = bird.geometry.vertices[10].y = 0;
        else bird.geometry.vertices[9].y = bird.geometry.vertices[10].y = Math.sin(bird.phase+phase) * 5;

        // Needed for WebGL renderer
        bird.geometry.verticesNeedUpdate = true;
      }

      lastTime = currentTime;
    }

    // Update cloud position and loop at the seam in the middle
    clouds.position.z = 500 + currentTime*0.01 % 1000;

    renderer.render(scene, camera);

    // Continue animating only if the home page is active for better performance
    if (document.getElementById('home').classList.contains('ts-slide-active'))
      requestAnimationFrame(this.animate.bind(this));
  },

  onInteract: function(event) {
    // Translate mouse position to simulation coordinates
    var vector = new THREE.Vector3(event.clientX - (window.innerWidth / 2), -event.clientY + (window.innerHeight / 2), 0);

    // Push away boids along a 2D plane
    for (var i = 0, l = boids.length; i < l; i++) {
      boid = boids[i];
      vector.z = boid.position.z;
      boid.repulse(vector);
    }
  },

  onResize: function() {
    // Update display area and camera projection matrix
  	camera.aspect = window.innerWidth / window.innerHeight;
  	camera.updateProjectionMatrix();
  	renderer.setSize(window.innerWidth, window.innerHeight);
  }
};
