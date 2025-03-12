import * as THREE from 'three';

export class Tree extends THREE.Mesh {
    constructor(position) {
        const geometry = new THREE.ConeGeometry(2, 10, 12);
        const material = new THREE.MeshStandardMaterial({ color: 0x305010, flatShading: true });
        super(geometry, material);
        
        this.position.copy(position);
        this.castShadow = true;
        this.receiveShadow = true;
    }
}