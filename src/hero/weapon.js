import * as THREE from 'three';

export class Weapon extends THREE.Group {
    constructor() {
        super();

        // Create handle (cylinder)
        const handleGeometry = new THREE.CylinderGeometry(0.12, 0.12, 2);
        const handleMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
        this.handle = new THREE.Mesh(handleGeometry, handleMaterial);

        // Create hammerhead (box)
        const headGeometry = new THREE.BoxGeometry(1, 0.5, 0.5);
        const headMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
        this.head = new THREE.Mesh(headGeometry, headMaterial);

        // Position the head at one end of the handle
        this.head.position.set(0, -1, 0);

        this.add(this.handle, this.head);
    }
}