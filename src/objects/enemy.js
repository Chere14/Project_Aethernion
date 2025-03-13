import * as THREE from 'three';

export class Enemy extends THREE.Group {
    constructor() {
        super();

        const geometry = new THREE.CylinderGeometry(3, 3, 12, 12, 12);
        const material = new THREE.MeshStandardMaterial({ color: "#BF3131" });

        this.body = new THREE.Mesh(geometry, material);
        this.add(this.body);

        this.position.set(0, 1, 0);

        this.health = 300;
        this.isAlive = true;
        this.attackPower = 20;
        this.attackCooldown = 1.5;
        this.lastAttackTime = 0;
        this.speed = 0.03; // Increased for faster approach

        this.bufferZone = 12;
        this.attackRange = geometry.parameters.radius; // Base 3, adjusted in setScale
    }

    setScale(scale) {
        this.scale.set(scale, scale, scale);
        this.attackRange = this.body.geometry.parameters.radius * scale * 1.5; // 6.75 with scale 1.5 (increased for reliability)
        console.log(`Enemy scaled to ${scale}. Attack range: ${this.attackRange}`);
    }

    takeDamage(amount) {
        if (!this.isAlive) return;
        this.health -= amount;
        if (this.health <= 0) {
            this.health = 0;
            this.isAlive = false;
            this.visible = false;
            console.log('Enemy defeated');
        }
    }

    update(hero) {
        if (!this.isAlive) return;

        const heroPos = hero.position.clone();
        const enemyPos = this.position.clone();
        const distanceToHero = enemyPos.distanceTo(heroPos);
        const currentTime = performance.now() / 1000;

        console.log(`Enemy at (${enemyPos.x.toFixed(2)}, ${enemyPos.z.toFixed(2)}) to hero at (${heroPos.x.toFixed(2)}, ${heroPos.z.toFixed(2)}): ${distanceToHero.toFixed(2)}, Buffer: ${this.bufferZone}, Range: ${this.attackRange}`);

        if (distanceToHero <= this.bufferZone) {
            const direction = heroPos.sub(enemyPos).normalize();
            const targetAngle = Math.atan2(direction.x, direction.z);
            this.rotation.y = THREE.MathUtils.lerp(this.rotation.y, targetAngle, 0.05);

            const moveStep = direction.multiplyScalar(this.speed);
            this.position.add(moveStep);

            if (distanceToHero <= this.attackRange) {
                if (currentTime - this.lastAttackTime >= this.attackCooldown) {
                    this.attack(hero);
                    this.lastAttackTime = currentTime;
                    console.log(`Enemy attacking hero at ${distanceToHero.toFixed(2)} units`);
                }
            } else {
                console.log(`Hero out of attack range: ${distanceToHero.toFixed(2)} > ${this.attackRange}`);
            }
        }
    }

    attack(hero) {
        hero.health -= this.attackPower;
        console.log(`Enemy attacks hero! Hero health: ${hero.health}`);
        if (hero.health <= 0) {
            hero.health = 0;
            console.log('Hero defeated by enemy attack!');
        }
        if (window.showDamageMessage) {
            window.showDamageMessage(`Hero hit by enemy! Damage: ${this.attackPower}, Health: ${hero.health}`);
        }
    }
}