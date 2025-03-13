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
    const targetHealthBarContainer = targetBar.querySelector('.health-bar-container');
    if (!targetHealthBarContainer) {
        console.error('Health bar container not found!');
        return;
    }
    const targetHealthBar = targetHealthBarContainer.querySelector('.health-bar');
    if (!targetHealthBar) {
        console.error('Health bar not found!');
        return;
    }
    const targetHealthText = targetBar.querySelector('.health-text');
    if (!targetHealthText) {
        console.error('Health text not found!');
        return;
    }

    // Hero Health Bar Setup
    const heroHealthBar = document.getElementById('hero-health-bar');
    if (!heroHealthBar) {
        console.error('Hero health bar element not found!');
        return;
    }
    const heroName = heroHealthBar.querySelector('.hero-name');
    if (!heroName) {
        console.error('Hero name element not found!');
        return;
    }
    heroName.textContent = 'Hero';
    const heroHealthBarContainer = heroHealthBar.querySelector('.health-bar-container');
    if (!heroHealthBarContainer) {
        console.error('Hero health bar container not found!');
        return;
    }
    const heroHealthBarElement = heroHealthBarContainer.querySelector('.health-bar');
    if (!heroHealthBarElement) {
        console.error('Hero health bar not found!');
        return;
    }
    const heroHealthText = heroHealthBar.querySelector('.health-text');
    if (!heroHealthText) {
        console.error('Hero health text not found!');
        return;
    }

    function updateHeroHealthBar() {
        const healthPercentage = (hero.health / 100) * 100; // Assuming max health is 100
        heroHealthBarElement.style.width = `${healthPercentage}%`;
        heroHealthText.textContent = `Health: ${hero.health}/100`;
    }

    // Initial health bar update
    updateHeroHealthBar();

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    window.selectedEnemy = null;

    function updateTargetBar() {
        if (window.selectedEnemy && window.selectedEnemy.isAlive) {
            const healthPercentage = (window.selectedEnemy.health / 300) * 100; // Enemy max health 300
            targetHealthBar.style.width = `${healthPercentage}%`;
            targetHealthText.textContent = `Health: ${window.selectedEnemy.health}/300`;
            targetBar.style.display = 'block';
        } else {
            targetBar.style.display = 'none';
            window.selectedEnemy = null;
        }
    }

    window.updateTargetBar = updateTargetBar;

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

    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            window.selectedEnemy = null;
            updateTargetBar();
            console.log('Esc pressed: Target bar hidden');
        }
    });

    function respawnHero() {
        hero.health = 100; // Reset health
        hero.position.set(0, 1, 0); // Respawn at origin
        hero.visible = true; // Make visible again
        updateHeroHealthBar();
        console.log('Hero respawned at origin');
    }

    function checkHeroHealth() {
        if (hero.health <= 0 && hero.visible) {
            hero.visible = false; // Hide hero
            console.log('Hero defeated! Respawning in 5 seconds...');
            setTimeout(respawnHero, 5000); // Respawn after 5 seconds
        }
    }

    function updateCamera() {
        const targetPosition = new THREE.Vector3(hero.position.x, 20, hero.position.z + 20);
        camera.position.lerp(targetPosition, 0.1);
        camera.lookAt(hero.position.x, hero.position.y, hero.position.z);
    }

    function animate() {
        hero.update();
        world.update(hero);
        updateCamera();
        updateTargetBar();
        updateHeroHealthBar(); // Update hero health bar each frame
        checkHeroHealth(); // Check for death and respawn
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