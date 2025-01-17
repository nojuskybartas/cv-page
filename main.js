import './style.css';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
//import { loadPerson } from './assets/loadPerson.js'
import { ObjectLoader } from 'three';

import background_img from "./assets/images/214962.jpg";
import moon_img from "./assets/images/moon.jpg";
import profile_img from "./assets/images/profile.jpeg";
import normal_texture from "./assets/images/normal.jpg";

// Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 5000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);

renderer.render(scene, camera);

// Torus

const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshBasicMaterial({ color: 0xff6347, wireframe: true});
const torus = new THREE.Mesh(geometry, material);

scene.add(torus);
torus.rotation.x = 2;

// Lights

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(10, 10, 10);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
scene.add(pointLight, ambientLight);

// Helpers

// const lightHelper = new THREE.PointLightHelper(pointLight)
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper)

//const controls = new OrbitControls(camera, renderer.domElement);

// Stars
var stars = [];
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xff9f9f, wireframe: true});
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(200));

  star.position.set(x, y, z);
  scene.add(star);
  stars.push(star);
}

Array(300).fill().forEach(addStar);

function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

// Falling stars

var shooting_stars = []

function randRange(data) {
  var newTime = data[Math.floor(data.length * Math.random())];
  return newTime;
}

function shootStar() {
  var timeArray = new Array(100, 200, 300, 150, 250, 2000, 3000, 1000, 1500);

  var star = stars[Math.floor(Math.random()*stars.length)];
  shooting_stars.push(star);

  clearInterval(timer);
  timer = setInterval(shootStar, randRange(timeArray));
}

var timer = setInterval(shootStar, 1000);

// Background

const spaceTexture = new THREE.TextureLoader().load(background_img);
scene.background = spaceTexture;

// Avatar

const avatarTexture = new THREE.TextureLoader().load(profile_img);

const avatar = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), new THREE.MeshBasicMaterial({ map: avatarTexture }));
avatar.position.z = -5;
avatar.position.x = 2;

scene.add(avatar);


// Moon

const moonTexture = new THREE.TextureLoader().load(moon_img);
const normalTexture = new THREE.TextureLoader().load(normal_texture);

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture,
  })
);

//scene.add(moon);

moon.position.z = 13;
moon.position.setX(-20);
moon.position.y = 13

// Planets

const planet1 = new THREE.Mesh(
  new THREE.IcosahedronGeometry(1, 0),
  material
);
planet1.position.z = 17;
planet1.position.x = -13;
planet1.position.y = 1;

const planet2 = new THREE.Mesh(
  new THREE.IcosahedronGeometry(1, 0),
  material
);
planet2.position.z = 15;
planet2.position.x = -7;
planet2.position.y = 1;

const planet3 = new THREE.Mesh(
  new THREE.IcosahedronGeometry(1, 0),
  material
);
planet3.position.z = 13;
planet3.position.x = -3;
planet3.position.y = 1;

let planets = [planet1, planet2, planet3];
scene.add(planet1, planet2, planet3);

// Planet moons
const loader = new THREE.FontLoader();

function addTextMoon(text_input, planet, orbit) {
  loader.load( 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/fonts/helvetiker_regular.typeface.json', function ( font ) {

    const material = new THREE.MeshPhongMaterial({
      color: Math.random() * 0xFFFFFF
    });

    const geometry = new THREE.TextGeometry( text_input, {
      font: font,
      size: 0.3,
      height: 0.1,
    });

    const text = new THREE.Mesh( geometry, material );

    var rotationArray = new Array(0, 1, 2, 3, 4, 5);
    text.position.z = planet.position.z;
    text.position.x = planet.position.x;
    text.position.y = planet.position.y;
    text.rotation.y = 1 * (Math.pow(planet.position.z, 2)/220);
    text.orbit = orbit;
    text.offset = planet.moons.length+planet.position.z;
    scene.add(text);
    planet.moons.push(text);
  });
};


planet1.moons = [];
planet2.moons = [];
planet3.moons = [];

// Planet 1 is languages
addTextMoon('Java', planet1, 2)
addTextMoon('Python', planet1, 3)
addTextMoon('Javascript', planet1, 2.5)
addTextMoon('Swift', planet1, 3.5)

// Planet 2 is AI frameworks
addTextMoon('PyTorch', planet2, 2)
addTextMoon('TensorFlow', planet2, 3)

// Planet 3 is other mention-worthy frameworks
addTextMoon('Flask', planet3, 2)
addTextMoon('ReST API', planet3, 2.5)



var timestamp = 0;


// Person model

// const person = await loadPerson();
// scene.add(person);
// person.scale.set(0.5,0.5,0.5)
// person.position.z = 35;
// person.position.x = -20;
// person.position.y = -3;
// person.rotation.z = 1;




// Terminal Type-out

function print_text (container, text) {
  const node = document.querySelector(container)
  node.innerText = ""
  node.type(text)
}

const sleep = time => new Promise(resolve => setTimeout(resolve, time))

class TypeAsync extends HTMLSpanElement {
  get typeInterval () {
    const randomMs = 50 * Math.random()
    return randomMs < 50 ? 10 : randomMs
  }
  
  async type (text) {
    for (let character of text) {
      this.innerText += character
      await sleep(this.typeInterval)
    }
  }
  
  async delete (text_to_delete) {
    for (let character of text_to_delete) {
      this.innerText = this.innerText.slice(0, this.innerText.length -1)
      await sleep(this.typeInterval)
    }
  }
}

customElements.define('type-async', TypeAsync, { extends: 'span' })

function print_console_text() {
 
print_text("#type-text-1", `
📜 System check: installed libraries

Checking basic libraries:
Object Oriented Programming - found

Checking artificial intelligence modules:
AI deep learning module - found
AI reinforcement module - found
AI vision module - found
AI natural language processing module - incomplete, missing libraries...

Checking robotics modules:
Wiring - no shortings found
Servers - online
Positioning module - found
Tracking module - found
Engine control modules - found

Full-stack systems online!
`)
}
//document.getElementById("check-libraries-button").onclick = print_console_text;


// Scroll Animation
var libCheckControl = 0;

function moveCamera() {
  var t = document.body.getBoundingClientRect().top;
  // moon.rotation.x += 0.05;
  // moon.rotation.y += 0.075;
  // moon.rotation.z += 0.05;


  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;

  if (camera.position.z > 8 && libCheckControl==1) {
    //print_console_text();
    libCheckControl += 1;
  }
}


document.body.onscroll = moveCamera;
moveCamera();

var terminal = document.getElementById('terminal');
const run_terminal_event = new Event('run-terminal');
var virgin = true;

// Animation Loop

function animate() {
  requestAnimationFrame(animate);

  //torus.rotation.z += 0.01
  
  
  moon.rotation.x += 0.005;

  avatar.rotation.x = camera.position.x*7;
  avatar.rotation.y = camera.position.x*3;
  avatar.rotation.z = camera.position.x*4;

  torus.rotation.x = camera.position.x*7;
  torus.rotation.y = camera.position.x*3;

  torus.rotation.z += 0.005 

  torus.position.z = (-2*Math.exp((camera.position.x)*50))-5;
  avatar.position.z = (-2*Math.exp((camera.position.x)*40))-2;
  // controls.update();

  // Shooting star animation
  shooting_stars.map(star => {
    star.position.z -= -2*(Math.exp(star.position.z/100));
    if (star.position.z > 100){
      //console.log("deleting star")
      shooting_stars = shooting_stars.filter(function(stars) { return stars.id != star.id; }); 
      addStar()
    }

  })

  planets.map(planet => {
    timestamp = Date.now() * 0.0001;
    planet.rotation.z += 0.002;
    planet.rotation.x += 0.001;
    planet.position.z = (-2*Math.exp((camera.position.x)*2))+4;

    // Moon orbit
    let speed = 0.0008;
    planet.moons.map( moon => {
      var date = Date.now() * speed;
      moon.position.set(
        planet.position.x,
        ((Math.cos(date+moon.offset) * moon.orbit)+planet.position.y),
        ((Math.sin(date+moon.offset) * moon.orbit)+planet.position.z),
      );
      moon.rotation.y =  (Math.pow(moon.position.x, 3)/420) * speed * -100;
      moon.rotation.x += (0.01 + Math.random()/20)*speed*1000;
      moon.rotation.z = -0.2 * (speed*1000);
    })
  })

  // if (camera.position.z > 4 && camera.position.z < 12) {
  //   terminal.style.opacity = (`100%`)
  // } else {
  //   terminal.style.opacity = (`0%`)
  // }
  
  terminal.style.opacity = (2/(Math.pow((camera.position.z - 8.5), 2)))
  if (camera.position.z > 8 && virgin) {
    virgin = false;
    terminal.dispatchEvent(run_terminal_event);
  }

  renderer.render(scene, camera);
}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

window.addEventListener( 'resize', onWindowResize, false );


animate();
