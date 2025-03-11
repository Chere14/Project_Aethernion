import * as THREE from 'three';
import { Weapon } from './weapon';

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

        // Weapon 
        this.weapon = new Weapon(); 
        this.add(body, top, bottom, this.weapon);

        this.rotation.y = Math.PI;

        // Create shoulder armor boxes
        const armorMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
        this.shoulderArmorL = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.5, 0.6), armorMaterial);
        this.shoulderArmorR = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.5, 0.6), armorMaterial);
        
        // Shoulder position
        this.shoulderArmorL.position.set(-0.9, 0.55, 0);
        this.shoulderArmorR.position.set(0.9, 0.55, 0);

        // Create hand spheres
        const handMaterial = new THREE.MeshStandardMaterial({ color: 0xffaa00 });
        this.handL = new THREE.Mesh(new THREE.SphereGeometry(0.25, 12, 12), handMaterial);
        this.handR = new THREE.Mesh(new THREE.SphereGeometry(0.25, 12, 12), handMaterial);

        // Hand positions
        this.handL.position.set(-0.8, -0.15, 0);
        this.handR.position.set(0.8, -0.15, 0);
        
        this.add(body, top, bottom, this.shoulderArmorL, this.shoulderArmorR, this.handL, this.handR);
        this.position.set(0, 1, 0);

        // Movement settings
        this.speed = 0.04;
        this.velocity = new THREE.Vector3();
        this.keys = { w: false, a: false, s: false, d: false };

        // Animation properties
        this.shoulderAnimationTime = 0; // Tracks time for shoulder movement
        this.shoulderAmplitude = 0.08;  // Maximum movement up/down
        this.shoulderFrequency = 0.08;     // Speed of movement (higher = faster)

        this.initControls();
    }

    initControls() {
        window.addEventListener('keydown', (e) => this.handleKey(e, true));
        window.addEventListener('keyup', (e) => this.handleKey(e, false));
    }

    handleKey(event, isPressed) {
        const key = event.key.toLowerCase();
        if (this.keys.hasOwnProperty(key)) {
            this.keys[key] = isPressed;
        }
    }

    update(deltaTime) {
        if (!this.camera) {
            console.error('Camera is not assigned to the character');
            return;
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
    
            // Compute new rotation angle
            const angle = Math.atan2(this.velocity.x, this.velocity.z);
    
            // Create target quaternion
            const targetQuaternion = new THREE.Quaternion();
            targetQuaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle);
    
            // Use quaternion slerp for smooth rotation
            this.quaternion.slerp(targetQuaternion, 0.2);

            // Movement speed factor for animations
            const movementSpeedFactor = this.velocity.length() / this.speed;
    
            // Shoulder animation effect
            const shoulderRotation = Math.sin(performance.now() * 0.005 * movementSpeedFactor) * 0.3 * movementSpeedFactor;
            this.shoulderArmorL.rotation.x = -shoulderRotation;
            this.shoulderArmorR.rotation.x = +shoulderRotation;

            // Hand oscillating motion
            const handOffset = Math.sin(performance.now() * 0.005 * movementSpeedFactor) * 0.4 * movementSpeedFactor;
            this.handL.position.z = 0.1 + handOffset;
            this.handR.position.z = 0.1 - handOffset;

            // Weapon animation
            const weaponOffset = Math.sin(performance.now() * 0.005 * movementSpeedFactor) * 0.12 * movementSpeedFactor;
            this.weapon.position.y = weaponOffset;
        }
    
        const newPosition = this.position.clone().add(this.velocity);
    
        if (!this.checkCollision(newPosition)) {
            this.position.copy(newPosition);
        }
    }

    checkCollision(newPosition) {
        const { width, height, edgeMargin, trees, rocks, bushes } = this.world;
        const halfWidth = width / 2 - edgeMargin;
        const halfHeight = height / 2 - edgeMargin;

        // Prevent moving outside the world bounds
        if (Math.abs(newPosition.x) > halfWidth || Math.abs(newPosition.z) > halfHeight) {
            return true;
        }

        // Define bounding spheres for each part
        const bodyRadius = 0.5;
        const shoulderRadius = 0.25;
        const handRadius = 0.15;

        // Positions of additional body parts
        const shoulderLPos = new THREE.Vector3(newPosition.x - 0.7, newPosition.y + 0.4, newPosition.z);
        const shoulderRPos = new THREE.Vector3(newPosition.x + 0.7, newPosition.y + 0.4, newPosition.z);
        const handLPos = new THREE.Vector3(newPosition.x - 0.7, newPosition.y - 0.1, newPosition.z);
        const handRPos = new THREE.Vector3(newPosition.x + 0.7, newPosition.y - 0.1, newPosition.z);

        // Objects to check for collisions
        const objectsToCheck = [
            { group: trees, radius: 0.6 },
            { group: rocks, radius: 0.9 },
            { group: bushes, radius: 0.55 }
        ];

        // Function to check if any body part collides with objects
        const checkPartCollision = (partPos, partRadius) => {
            return objectsToCheck.some(({ group, radius }) =>
                group.children.some(obj => partPos.distanceTo(obj.position) < partRadius + radius)
            );
        };

        // Check for collisions with the body, shoulders, and hands
        return (
            checkPartCollision(newPosition, bodyRadius) ||
            checkPartCollision(shoulderLPos, shoulderRadius) ||
            checkPartCollision(shoulderRPos, shoulderRadius) ||
            checkPartCollision(handLPos, handRadius) ||
            checkPartCollision(handRPos, handRadius)
        );
    }
}