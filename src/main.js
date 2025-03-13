import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { World } from './world.js';
import { Hero } from './hero/hero.js';

console.log('main.js loaded');

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded');
    console.log('Target bar:', document.getElementById('target-bar'));

    const stats = new Stats();
    document.body.appendChild(stats.dom);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(15, 15, 15);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enabled = false;

    const world = new World();
    scene.add(world);

    const hero = new Hero(world, camera);
    scene.add(hero);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(30, 50, 30);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const damageDisplay = document.getElementById('damageDisplay');
    if (!damageDisplay) {
        console.error('Damage display element not found!');
        return;
    }
    const damageDisplayPosition = { x: 800, y: 600 };
    damageDisplay.style.left = `${damageDisplayPosition.x}px`;
    damageDisplay.style.top = `${damageDisplayPosition.y}px`;

    function showDamageMessage(message, duration = 2000) {
        damageDisplay.textContent = message;
        damageDisplay.style.display = 'block';
        console.log(message);
        setTimeout(() => {
            damageDisplay.style.display = 'none';
        }, duration);
    }

    const targetBar = document.getElementById('target-bar');
    if (!targetBar) {
        console.error('Target bar element not found!');
        return;
    }
    const targetName = targetBar.querySelector('.target-name');
    if (!targetName) {
        console.error('Target name element not found!');
        return;
    }
    targetName.textContent = 'Enemy';
    const healthBarContainer = targetBar.querySelector('.health-bar-container');
    if (!healthBarContainer) {
        console.error('Health bar container not found!');
        return;
    }
    const healthBar = healthBarContainer.querySelector('.health-bar');
    if (!healthBar) {
        console.error('Health bar not found!');
        return;
    }
    const healthText = targetBar.querySelector('.health-text');
    if (!healthText) {
        console.error('Health text not found!');
        return;
    }

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    window.selectedEnemy = null;

    function updateTargetBar() {
        if (window.selectedEnemy && window.selectedEnemy.isAlive) {
            const healthPercentage = (window.selectedEnemy.health / 300) * 100;
            healthBar.style.width = `${healthPercentage}%`;
            healthText.textContent = `Health: ${window.selectedEnemy.health}`;
            targetBar.style.display = 'block';
        } else {
            targetBar.style.display = 'none';
            window.selectedEnemy = null;
        }
    }

    window.updateTargetBar = updateTargetBar;

    // Right-click detection
    window.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(world.enemies.children, true);

        if (intersects.length > 0) {
            window.selectedEnemy = intersects[0].object.parent;
            updateTargetBar();
        } else {
            window.selectedEnemy = null;
            targetBar.style.display = 'none';
        }
    });

    // Esc key to hide target bar
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            window.selectedEnemy = null;
            updateTargetBar();
            console.log('Esc pressed: Target bar hidden');
        }
    });

    function updateCamera() {
        const targetPosition = new THREE.Vector3(hero.position.x, 20, hero.position.z + 20);
        camera.position.lerp(targetPosition, 0.1);
        camera.lookAt(hero.position.x, hero.position.y, hero.position.z);
    }

    function animate() {
        hero.update();
        world.update();
        updateCamera();
        updateTargetBar();
        renderer.render(scene, camera);
        stats.update();
    }
    renderer.setAnimationLoop(animate);

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    window.showDamageMessage = showDamageMessage;
    window.damageDisplayPosition = damageDisplayPosition;
});