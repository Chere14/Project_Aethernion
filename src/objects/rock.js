import * as THREE from 'three';

export class Rock extends THREE.Mesh {
    constructor() {
        const geometry = new THREE.SphereGeometry(0.5, 12, 12);
        const material = new THREE.MeshStandardMaterial({ color: 0xb0b0b0 });
        super(geometry, material);
        this.position.y = 0; // Rocks sit directly on the ground
    }
}