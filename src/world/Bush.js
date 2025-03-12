import * as THREE from 'three';

export class Bush extends THREE.Mesh {
    constructor(position) {
        const geometry = new THREE.SphereGeometry(0.3, 12, 12);
        const material = new THREE.MeshStandardMaterial({ color: 0x80a040, flatShading: true });
        super(geometry, material);
        
        this.position.copy(position);
        this.castShadow = true;
        this.receiveShadow = true;
    }
}