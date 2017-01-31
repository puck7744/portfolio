# About
I am a web developer and technical consultant based out of the Harrisburg, PA area and this is the source repository for my portfolio.

# Features
## Low Overhead
With a 75 line main script file and only a handful of server-side dependencies, the project requires very little of the server. Client-side resources are pre-compiled and minified to minimize bandwidth usage and loading time.

## 3D Rendering
The home page uses a WebGL context (via Three.js) to display some fluffy scrolling clouds and abstract flocking birds where supported.

## Progressive Enhancement
Where modern browser features are utilized they are built on top of simpler solutions using a policy of progressive enhancement. This allows a single code base to gracefully degrade in older browsers that lack support for modern features like CSS transformations and animations.

## Automatic Deployment
The entire project is deployed to a Heroku dynamo from this repository's main branch. This allows seamless deployment from anywhere that GitHub is accessible and by anyone with repository access.

## Clean Development Environment
Development and deployment dependencies are carefully managed, so only the necessary packages are loaded.

All of the project's build and run tasks are implemented as simple NPM scripts, which means there is no dependency on Gulp or Grunt.

# Technology
Some of the most important technologies used in this project include the following.

* CSS3
* HTML5
* [Three.js](https://www.threejs.org/)
* [Pug](https://github.com/pugjs/pug)
* [Node.js](https://nodejs.org/en/)
* Node Package Manager
* [Browserify](http://browserify.org/)
* Nodemon/NPM scripts
* Heroku
* Git

# Credits

* MrDoob and the Three.js contributors
* Dan Uznanski for contributions to bird behavior
* Wikipedia user Kenrick95 for the image of clouds over London
* Unsplash user Helloquence for the image of people collaborating
