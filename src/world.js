import * as THREE from 'three';

export class World extends THREE.Group {
    #objectPositions = [];

    constructor() {
        super();

        this.width = 300;
        this.height = 300;
        this.treeCount = 600;
        this.rockCount = 400;
        this.bushCount = 300;
        this.edgeMargin = 2; // Prevent objects from spawning too close to edges
        this.minDistance = 2; // Minimum distance between objects
        this.safeRadius = 3; // Safe zone radius around the origin to prevent objects from blocking the character

        this.trees = new THREE.Group();
        this.rocks = new THREE.Group();
        this.bushes = new THREE.Group();

        this.add(this.trees, this.rocks, this.bushes);
        this.generate();
    }

    generate() {
        this.clear();
        this.createTerrain();
        this.placeObjects(this.trees, this.treeCount, 0.6, new THREE.ConeGeometry(2, 10, 12), 1.5, 0x305010);
        this.placeObjects(this.rocks, this.rockCount, 0.5, new THREE.SphereGeometry(0.5, 12, 12), 0, 0xb0b0b0);
        this.placeObjects(this.bushes, this.bushCount, 0.4, new THREE.SphereGeometry(0.3, 12, 12), 0.3, 0x80a040);
    }

    clear() {
        if (this.terrain) {
            this.terrain.geometry.dispose();
            this.terrain.material.dispose();
            this.remove(this.terrain);
        }

        [this.trees, this.rocks, this.bushes].forEach(group => {
            group.children.forEach(obj => {
                obj.geometry?.dispose();
                obj.material?.dispose();
            });
            group.clear();
        });

        this.#objectPositions = [];
    }

    createTerrain() {
        const terrainMaterial = new THREE.MeshStandardMaterial({ color: 0x5a000 });
        const terrainGeometry = new THREE.PlaneGeometry(this.width, this.height, this.width, this.height);

        this.terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
        this.terrain.rotation.x = -Math.PI / 2;
        this.add(this.terrain);
    }

    getRandomPosition() {
        let position;
        let attempts = 0;
        do {
            position = new THREE.Vector3(
                THREE.MathUtils.randFloat(-this.width / 2 + this.edgeMargin, this.width / 2 - this.edgeMargin),
                0,
                THREE.MathUtils.randFloat(-this.height / 2 + this.edgeMargin, this.height / 2 - this.edgeMargin)
            );
            attempts++;
        } while (this.isInSafeZone(position) && attempts < 100);

        return position;
    }

    isInSafeZone(position) {
        return position.length() < this.safeRadius;
    }

    isValidPosition(newPos, minDist) {
        return this.#objectPositions.every(pos => newPos.distanceTo(pos) >= minDist);
    }

    placeObjects(group, count, radius, geometry, yOffset, color) {
        const material = new THREE.MeshStandardMaterial({ color, flatShading: true });

        for (let i = 0; i < count; i++) {
            let position;
            let attempts = 0;
            do {
                position = this.getRandomPosition();
                attempts++;
            } while ((!this.isValidPosition(position, this.minDistance) || this.isInSafeZone(position)) && attempts < 100);

            if (attempts >= 100) continue; // Avoid infinite loops

            position.y = yOffset;
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.copy(position);
            group.add(mesh);
            this.#objectPositions.push(position.clone());
        }
    }
}