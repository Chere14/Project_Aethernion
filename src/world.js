import * as THREE from 'three';
import { Tree } from './objects/tree.js';
import { Rock } from './objects/rock.js';
import { Bush } from './objects/bush.js';
import { Enemy } from './objects/enemy.js';

export class World extends THREE.Group {
    #objectPositions = [];
    #enemyPositions = [];

    constructor() {
        super();

        this.width = 300;
        this.height = 300;
        this.treeCount = 600;
        this.rockCount = 400;
        this.bushCount = 300;
        this.enemyCount = 10;
        this.edgeMargin = 2;
        this.minDistance = 6;
        this.enemyBufferZone = 12;
        this.safeRadius = 5;

        this.trees = new THREE.Group();
        this.rocks = new THREE.Group();
        this.bushes = new THREE.Group();
        this.enemies = new THREE.Group();

        this.add(this.trees, this.rocks, this.bushes, this.enemies);
        this.generate();
    }

    generate() {
        this.clear();
        this.createTerrain();
        this.placeEnemies();
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

        [this.trees, this.rocks, this.bushes, this.enemies].forEach(group => {
            group.children.forEach(obj => {
                if (obj.geometry) obj.geometry.dispose();
                if (obj.material) obj.material.dispose();
            });
            group.clear();
        });

        this.#objectPositions = [];
        this.#enemyPositions = [];
    }

    createTerrain() {
        const terrainMaterial = new THREE.MeshStandardMaterial({ color: "#5CB338" });
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

    isTooCloseToEnemies(position) {
        return this.#enemyPositions.some(enemyPos => position.distanceTo(enemyPos) < this.enemyBufferZone);
    }

    isValidPosition(newPos, objectScale) {
        const scaledMinDist = this.minDistance * objectScale;
        return this.#objectPositions.every(pos => newPos.distanceTo(pos) >= scaledMinDist) &&
               !this.isTooCloseToEnemies(newPos);
    }

    placeEnemies() {
        for (let i = 0; i < this.enemyCount; i++) {
            let position;
            let attempts = 0;

            do {
                position = this.getRandomPosition();
                attempts++;
            } while ((this.isTooCloseToEnemies(position) || this.isInSafeZone(position)) && attempts < 100);

            if (attempts >= 100) continue;

            const enemy = new Enemy();
            enemy.setScale(1.5); // Adjusts attack range to 4.5
            enemy.position.copy(position);

            this.enemies.add(enemy);
            this.#enemyPositions.push(position.clone());
        }
    }

    placeObjects(group, count, ObjectClass, baseRadius) {
        for (let i = 0; i < count; i++) {
            let position;
            let attempts = 0;
            let scale;

            do {
                position = this.getRandomPosition();
                scale = THREE.MathUtils.randFloat(0.7, 1.5);
                attempts++;
            } while ((!this.isValidPosition(position, scale) || this.isInSafeZone(position)) && attempts < 100);

            if (attempts >= 100) continue;

            const object = new ObjectClass();
            object.scale.set(scale, scale, scale);
            position.y = object.position.y || 0;
            object.position.copy(position);

            group.add(object);
            this.#objectPositions.push(position.clone());
        }
    }

    update(hero) {
        this.enemies.children = this.enemies.children.filter(enemy => enemy.isAlive);
        this.enemies.children.forEach(enemy => enemy.update(hero));
    }

    checkEnemyCollision(position, heroScale) {
        for (const enemy of this.enemies.children) {
            if (!enemy.isAlive) continue;
            const enemyPos = enemy.position.clone();
            const enemyRadius = enemy.body.geometry.parameters.radius * enemy.scale.x; // 4.5 with scale 1.5
            const heroRadius = heroScale * 0.5; // Hero radius 0.5
            const distance = position.distanceTo(enemyPos);
            const minDistance = enemyRadius + heroRadius; // ~5 units
            if (distance < minDistance) {
                console.log(`Collision with enemy at ${distance.toFixed(2)} < ${minDistance.toFixed(2)}`);
                return true;
            }
        }
        return false;
    }
}