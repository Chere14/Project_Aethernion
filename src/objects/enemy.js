import * as THREE from 'three';

export class Enemy extends THREE.Group {
    constructor() {
        super();

        // Enemy material and geometry
        const geometry = new THREE.CylinderGeometry(3, 3, 12, 12, 12); 
        const material = new THREE.MeshStandardMaterial({ color: "#BF3131" });

        const body = new THREE.Mesh(geometry, material);
        this.add(body); 

        this.position.set(0, 1, 0); 
    }
}