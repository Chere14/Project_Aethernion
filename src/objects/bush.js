import * as THREE from 'three';

export class Bush extends THREE.Mesh {
    constructor() {
        const geometry = new THREE.SphereGeometry(0.3, 12, 12);
        const material = new THREE.MeshStandardMaterial({ color: 0x80a040 });
        super(geometry, material);
        this.position.y = 0.3; // Slightly raised for realism
    }
}