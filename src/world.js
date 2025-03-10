import * as THREE from 'three';

export class World extends THREE.Group {
    #objectMap = new Map();

    constructor() {
        super();

        this.width = 300; 
        this.height = 300;
        this.treeCount = 600; 
        this.rockCount = 400; 
        this.bushCount = 300; 
        this.edgeMargin = 2; // Prevent objects from spawning too close to the edges

        this.trees = new THREE.Group();
        this.add(this.trees);

        this.rocks = new THREE.Group();
        this.add(this.rocks);

        this.bushes = new THREE.Group();
        this.add(this.bushes);

        this.generate();
    }

    generate() {
        this.clear();
        this.createTerrain();
        this.createTrees();
        this.createRocks();
        this.createBushes();
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

        this.#objectMap.clear();
    }

    createTerrain() {
        const terrainMaterial = new THREE.MeshStandardMaterial({ color: 0x5a000 });
        const terrainGeometry = new THREE.PlaneGeometry(this.width, this.height, this.width, this.height);

        this.terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
        this.terrain.rotation.x = -Math.PI / 2;
        this.terrain.position.set(0, 0, 0); // Center terrain

        this.add(this.terrain);
    }

    getRandomPosition() {
        return {
            x: THREE.MathUtils.randFloat(-this.width / 2 + this.edgeMargin, this.width / 2 - this.edgeMargin),
            z: THREE.MathUtils.randFloat(-this.height / 2 + this.edgeMargin, this.height / 2 - this.edgeMargin)
        };
    }

    createTrees() {
        const treeGeometry = new THREE.ConeGeometry(0.5, 3, 12);
        const treeMaterial = new THREE.MeshStandardMaterial({ color: 0x305010, flatShading: true });

        for (let i = 0; i < this.treeCount; i++) {
            const { x, z } = this.getRandomPosition();
            if (this.#objectMap.has(`${x}-${z}`)) continue;

            const treeMesh = new THREE.Mesh(treeGeometry, treeMaterial);
            treeMesh.position.set(x, 1.5, z);
            this.trees.add(treeMesh);
            this.#objectMap.set(`${x}-${z}`, treeMesh);
        }
    }

    createRocks() {
        const rockMaterial = new THREE.MeshStandardMaterial({ color: 0xb0b0b0, flatShading: true });

        for (let i = 0; i < this.rockCount; i++) {
            const { x, z } = this.getRandomPosition();
            if (this.#objectMap.has(`${x}-${z}`)) continue;

            const rockMesh = new THREE.Mesh(new THREE.SphereGeometry(0.5, 12, 12), rockMaterial);
            rockMesh.position.set(x, 0, z);
            this.rocks.add(rockMesh);
            this.#objectMap.set(`${x}-${z}`, rockMesh);
        }
    }

    createBushes() {
        const bushMaterial = new THREE.MeshStandardMaterial({ color: 0x80a040, flatShading: true });

        for (let i = 0; i < this.bushCount; i++) {
            const { x, z } = this.getRandomPosition();
            if (this.#objectMap.has(`${x}-${z}`)) continue;

            const bushMesh = new THREE.Mesh(new THREE.SphereGeometry(0.3, 12, 12), bushMaterial);
            bushMesh.position.set(x, 0.3, z);
            this.bushes.add(bushMesh);
            this.#objectMap.set(`${x}-${z}`, bushMesh);
        }
    }
}