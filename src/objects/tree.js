import * as THREE from 'three';

export class Tree extends THREE.Mesh {
    constructor() {
        const geometry = new THREE.ConeGeometry(2, 12, 12);
        const material = new THREE.MeshStandardMaterial({ color: 0x305010, flatShading: true });
        super(geometry, material);
        this.position.y = 1.5; // Offset to sit properly on the ground
    }
}