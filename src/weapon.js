import * as THREE from 'three';
import { gsap } from 'gsap';

export class Weapon extends THREE.Group {
    constructor() {
        super();

        // Create weapon geometry (a long parallelepiped)
        const weaponGeometry = new THREE.BoxGeometry(0.1, 1, 0.2); // Thin, long shape
        const weaponMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
        this.weaponMesh = new THREE.Mesh(weaponGeometry, weaponMaterial);

        // Position the weapon relative to the character
        this.weaponMesh.position.set(0.6, 0, 0.2); 
        this.add(this.weaponMesh);
    }

    swing() {
        gsap.to(this.weaponMesh.rotation, {
            x: -Math.PI / 2,  // Swing downward
            duration: 0.2,
            yoyo: true, // Swing back
            repeat: 1,
            ease: "power2.inOut"
        });
    }
}