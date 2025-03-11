import * as THREE from 'three';

export class Weapon extends THREE.Group {
    constructor() {
        super();

        // Create weapon geometry (a long parallelepiped)
        const weaponGeometry = new THREE.CylinderGeometry(0.12, 0.12, 2); // Thin, long shape
        const weaponMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
        this.weaponMesh = new THREE.Mesh(weaponGeometry, weaponMaterial);

        // Position of the weapon
        this.weaponMesh.position.set(0, 0.5, -0.6); 
        this.weaponMesh.rotation.set(0, 0, Math.PI / 6); 

        this.add(this.weaponMesh);
    }
}