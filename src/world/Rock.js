import * as THREE from 'three';

export class Rock extends THREE.Mesh {
    constructor(position) {
        const geometry = new THREE.SphereGeometry(0.5, 12, 12);
        const material = new THREE.MeshStandardMaterial({ color: 0xb0b0b0, flatShading: true });
        super(geometry, material);
        
        this.position.copy(position);
        this.castShadow = true;
        this.receiveShadow = true;
    }
}