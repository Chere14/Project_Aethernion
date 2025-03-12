import * as THREE from 'three';
import { Tree } from './objects/tree.js';
import { Rock } from './objects/rock.js';
import { Bush } from './objects/bush.js';

export class World extends THREE.Group {
    #objectPositions = [];

    constructor() {
        super();

        this.width = 300;
        this.height = 300;
        this.treeCount = 600;
        this.rockCount = 400;
        this.bushCount = 300;
        this.edgeMargin = 2;
        this.minDistance = 6; // Minimum distance between objects
        this.safeRadius = 5; // Safe radius from the origin

        this.trees = new THREE.Group();
        this.rocks = new THREE.Group();
        this.bushes = new THREE.Group();

        this.add(this.trees, this.rocks, this.bushes);
        this.generate();
    }

    generate() {
        this.clear();
        this.createTerrain();
        this.placeObjects(this.trees, this.treeCount, Tree, 0.9);
        this.placeObjects(this.rocks, this.rockCount, Rock, 0.75);
        this.placeObjects(this.bushes, this.bushCount, Bush, 0.45);
    }

    clear() {
        if (this.terrain) {
            this.terrain.geometry.dispose();
            this.terrain.material.dispose();
            this.remove(this.terrain);
        }

        [this.trees, this.rocks, this.bushes].forEach(group => {
            group.children.forEach(obj => {
                obj.geometry.dispose();
                obj.material.dispose();
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

    // Generate random position for objects
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

    // Check if object is in a safe radius from the origin (center of the world)
    isInSafeZone(position) {
        return position.length() < this.safeRadius;
    }

    // Validate the position ensuring the distance between objects is sufficient
    isValidPosition(newPos, objectScale, baseRadius) {
        const scaledMinDist = this.minDistance * objectScale; // Scale collision range based on object size
        return this.#objectPositions.every(pos => newPos.distanceTo(pos) >= scaledMinDist);
    }

    placeObjects(group, count, ObjectClass, baseRadius) {
        for (let i = 0; i < count; i++) {
            let position;
            let attempts = 0;
            let scale;

            do {
                position = this.getRandomPosition();
                scale = THREE.MathUtils.randFloat(0.7, 1.5); // Randomize object size
                attempts++;
            } while ((!this.isValidPosition(position, scale, baseRadius) || this.isInSafeZone(position)) && attempts < 100);

            if (attempts >= 100) continue; // Avoid infinite loops if unable to find a valid spot

            // Create object and apply random scaling
            const object = new ObjectClass();
            object.scale.set(scale, scale, scale);

            // Adjust position
            position.y = object.position.y || 0; // Ensure it has a proper Y position
            object.position.copy(position);

            // Add to world
            group.add(object);
            this.#objectPositions.push(position.clone()); // Store the position for future checks
        }
    }
}