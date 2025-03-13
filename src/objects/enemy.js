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

        // Stats
        this.health = 300; 
        this.isAlive = true;
    }

    takeDamage(amount) {
        if (!this.isAlive) return;
        this.health -= amount;
        if (this.health <= 0) {
            this.health = 0;
            this.isAlive = false;
            this.visible = false; 
        }
    }
}