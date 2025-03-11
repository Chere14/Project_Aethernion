import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { World } from './world';
import { Character } from './character.js';

// GUI and Stats
const gui = new GUI();
const stats = new Stats();
document.body.appendChild(stats.dom);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Scene
const scene = new THREE.Scene();

// Camera Setup (closer to the character)
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(15, 15, 15); //initial camera position

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enabled = false; // Disable manual control

// Create World
const world = new World();
scene.add(world);

// Character
const character = new Character(world, camera); 
scene.add(character);

// Lighting
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(30, 50, 30);
directionalLight.castShadow = true;
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Camera Update Function
function updateCamera() {
    const targetPosition = new THREE.Vector3(character.position.x, 20, character.position.z + 20); // camera distance when character is moving
    camera.position.lerp(targetPosition, 0.1); 
    camera.lookAt(character.position.x, character.position.y, character.position.z);
}

// Animation Loop
function animate() {
    character.update(); 
    updateCamera(); 
    renderer.render(scene, camera);
    stats.update();
}
renderer.setAnimationLoop(animate);

// Handle Window Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// GUI
const worldFolder = gui.addFolder('World');
worldFolder.add(world, 'generate').name('Generate');