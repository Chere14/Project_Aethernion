import * as THREE from 'three';
 
 export class Character extends THREE.Group {
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
 
         this.add(body, top, bottom);
         this.position.set(0, 1, 0);
 
         // Movement settings
         this.speed = 0.05;
         this.velocity = new THREE.Vector3();
         this.keys = { w: false, a: false, s: false, d: false };
 
         // Add event listeners for movement
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
 
     update() {
         if (!this.camera) {
             console.error('Camera is not assigned to the character');
             return;
         }
 
         // Get camera direction to adjust movement
         const cameraDirection = new THREE.Vector3();
         this.camera.getWorldDirection(cameraDirection);
         cameraDirection.y = 0;
         cameraDirection.normalize();
 
         // Get right direction based on camera
         const rightDirection = new THREE.Vector3().crossVectors(cameraDirection, new THREE.Vector3(0, 1, 0)).normalize();
 
         // Reset velocity
         this.velocity.set(0, 0, 0);
 
         // Apply movement relative to camera
         if (this.keys.w) this.velocity.add(cameraDirection);
         if (this.keys.s) this.velocity.sub(cameraDirection);
         if (this.keys.a) this.velocity.sub(rightDirection);
         if (this.keys.d) this.velocity.add(rightDirection);
 
         // Normalize movement speed
         if (this.velocity.length() > 0) {
             this.velocity.normalize().multiplyScalar(this.speed);
         }
 
         // Compute new position
         const newPosition = this.position.clone().add(this.velocity);
 
         // Collision Detection
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
    
        // Character bounding sphere radius
        const characterRadius = 0.5;
        const objectsToCheck = [
            { group: trees, radius: 0.6 },
            { group: rocks, radius: 0.9 },
            { group: bushes, radius: 0.55 }
        ];
    
        // Check collisions with objects
        return objectsToCheck.some(({ group, radius }) => 
            group.children.some(obj => newPosition.distanceTo(obj.position) < characterRadius + radius)
        );
    }
 }