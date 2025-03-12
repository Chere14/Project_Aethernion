import * as THREE from 'three';
import { Weapon } from './weapon.js';
import { checkCollision } from './collision.js';
import { HeroAttack } from '../attacks/heroAttack.js'; // Import HeroAttack

export class Hero extends THREE.Group {
    constructor(world, camera) {
        super();
        this.world = world;
        this.camera = camera;

        const material = new THREE.MeshStandardMaterial({ color: 0xffaa00 });
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 2, 12), material);
        const top = new THREE.Mesh(new THREE.SphereGeometry(0.5, 12, 12), material);
        const bottom = new THREE.Mesh(new THREE.SphereGeometry(0.5, 12, 12), material);

        top.position.y = 1;
        bottom.position.y = -1;

        this.weapon = new Weapon();
        this.weaponDrawn = false; // Track if the weapon is in hand
        this.attachWeaponToBack();

        this.add(body, top, bottom, this.weapon);
        
        // Initialize the attack controller
        this.heroAttack = new HeroAttack(this); // Pass hero instead of just weapon

        // Shoulder armor boxes
        const armorMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
        this.shoulderArmorL = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.5, 0.6), armorMaterial);
        this.shoulderArmorR = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.5, 0.6), armorMaterial);
        
        // Shoulder position
        this.shoulderArmorL.position.set(-0.9, 0.55, 0);
        this.shoulderArmorR.position.set(0.9, 0.55, 0);

        // Hand spheres
        const handMaterial = new THREE.MeshStandardMaterial({ color: 0xffaa00 });
        this.handL = new THREE.Mesh(new THREE.SphereGeometry(0.25, 12, 12), handMaterial);
        this.handR = new THREE.Mesh(new THREE.SphereGeometry(0.25, 12, 12), handMaterial);

        // Hand positions
        this.handL.position.set(0.8, -0.15, 0);
        this.handR.position.set(-0.8, -0.15, 0);
        
        this.add(body, top, bottom, this.shoulderArmorL, this.shoulderArmorR, this.handL, this.handR);
        this.position.set(0, 1, 0);
        this.rotation.y = Math.PI;

        // Movement settings
        this.speed = 0.04;
        this.velocity = new THREE.Vector3();
        this.keys = { w: false, a: false, s: false, d: false };

        // Animation properties
        this.shoulderAnimationTime = 0;
        this.shoulderAmplitude = 0.08;
        this.shoulderFrequency = 0.08;

        this.initControls();
    }

    initControls() {
        window.addEventListener('keydown', (e) => this.handleKey(e, true));
        window.addEventListener('keyup', (e) => this.handleKey(e, false));
        
        // Spacebar now triggers weapon draw + attack
        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                if (!this.weaponDrawn) {
                    this.attachWeaponToHand(); // Draw weapon automatically
                }
                this.heroAttack.startSwing(); // Attack after weapon is positioned
            }
        });

        // Toggle weapon manually with Z key
        window.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 'z') {
                this.toggleWeapon();
            }
        });
    }

    handleKey(event, isPressed) {
        const key = event.key.toLowerCase();
        if (this.keys.hasOwnProperty(key)) {
            this.keys[key] = isPressed;
        }
    }

    toggleWeapon() {
        this.weaponDrawn = !this.weaponDrawn;
        if (this.weaponDrawn) {
            this.attachWeaponToHand();
        } else {
            this.attachWeaponToBack();
        }
    }

    attachWeaponToBack() {
        this.weaponDrawn = false;
        this.weapon.position.set(0, 0.8, -0.8);
        this.weapon.rotation.set(0, 0, 20 * (Math.PI / 180));
    }

    attachWeaponToHand() {
        this.weaponDrawn = true;

        // Ensure weapon is positioned relative to the right hand
        const handPosition = this.handR.position.clone();

        const offsetX = 0; 
        const offsetY = 0.1; 
        const offsetZ = 0.2; 

        // Apply these offsets to the weapon position relative to the hand
        this.weapon.position.set(handPosition.x + offsetX, handPosition.y + offsetY, handPosition.z + offsetZ);

        // Reset the weapon's rotation to make sure it is aligned correctly when drawn
        this.weapon.rotation.set(Math.PI / 2, Math.PI / 2, 5 * Math.PI / 6);
    }

    update(deltaTime) {
        if (!this.camera) {
            console.error('Camera is not assigned to the character');
            return;
        }

        if (this.weaponDrawn) {
            // Update the position of the weapon relative to the right hand while in motion
            this.weapon.position.copy(this.handR.position.clone().add(new THREE.Vector3(0, 0.1, 0.2)));
        }
    
        const cameraDirection = new THREE.Vector3();
        this.camera.getWorldDirection(cameraDirection);
        cameraDirection.y = 0;
        cameraDirection.normalize();
    
        const rightDirection = new THREE.Vector3().crossVectors(cameraDirection, new THREE.Vector3(0, 1, 0)).normalize();
    
        this.velocity.set(0, 0, 0);
    
        if (this.keys.w) this.velocity.add(cameraDirection);
        if (this.keys.s) this.velocity.sub(cameraDirection);
        if (this.keys.a) this.velocity.sub(rightDirection);
        if (this.keys.d) this.velocity.add(rightDirection);
    
        if (this.velocity.length() > 0) {
            this.velocity.normalize().multiplyScalar(this.speed);
    
            const angle = Math.atan2(this.velocity.x, this.velocity.z);
            const targetQuaternion = new THREE.Quaternion();
            targetQuaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle);
            this.quaternion.slerp(targetQuaternion, 0.2);
    
            const movementSpeedFactor = this.velocity.length() / this.speed;
            const shoulderRotation = Math.sin(performance.now() * 0.005 * movementSpeedFactor) * 0.3 * movementSpeedFactor;
            this.shoulderArmorL.rotation.x = +shoulderRotation;
            this.shoulderArmorR.rotation.x = -shoulderRotation;
    
            const handOffset = Math.sin(performance.now() * 0.005 * movementSpeedFactor) * 0.2 * movementSpeedFactor;
            this.handL.position.z = 0.1 + handOffset;
            this.handR.position.z = 0.1 - handOffset;
        } else {
            // Smoothly return shoulders and hands to initial positions
            this.shoulderArmorL.rotation.x = THREE.MathUtils.lerp(this.shoulderArmorL.rotation.x, 0, 0.1);
            this.shoulderArmorR.rotation.x = THREE.MathUtils.lerp(this.shoulderArmorR.rotation.x, 0, 0.1);
            this.handL.position.z = THREE.MathUtils.lerp(this.handL.position.z, 0.1, 0.1);
            this.handR.position.z = THREE.MathUtils.lerp(this.handR.position.z, 0.1, 0.1);
        }
    
        const newPosition = this.position.clone().add(this.velocity);
    
        // Pass hero's scale to the collision function
        const heroScale = this.scale.x; // Assuming uniform scaling
        if (!checkCollision(newPosition, this.world, heroScale)) {
            this.position.copy(newPosition);
        }
    }
}