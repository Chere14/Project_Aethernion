import * as THREE from 'three';

export class Rock extends THREE.Mesh {
    constructor() {
        const geometry = new THREE.SphereGeometry(0.7, 6, 6);
        const material = new THREE.MeshStandardMaterial({ color: 0xb0b0b0, flatShading: true });
        super(geometry, material);
        this.position.y = -0.3; // Rocks sit directly on the ground
    }
}