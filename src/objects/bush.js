import * as THREE from 'three';

export class Bush extends THREE.Mesh {
    constructor() {
        const geometry = new THREE.SphereGeometry(0.8, 8, 8);
        const material = new THREE.MeshStandardMaterial({ color: 0x80a040, flatShading: true });
        super(geometry, material);
        this.position.y = 0.8; // Slightly raised for realism
    }
}