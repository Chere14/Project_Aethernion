import * as THREE from 'three';

export class HeroAttack {
    constructor(hero, world) {
        this.hero = hero;
        this.weapon = this.hero.weapon;
        this.world = world;
        this.isSwinging = false;
        this.swingTime = 0;
        this.hasHit = false;

        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                this.startSwing();
            }
        });
    }

    startSwing() {
        if (this.isSwinging) return;

        if (!this.hero.weaponDrawn) {
            this.hero.attachWeaponToHand();
        }

        this.isSwinging = true;
        this.swingTime = 0;
        this.hasHit = false;

        console.log(`Starting swing with attack power: ${this.hero.attackPower}`);

        requestAnimationFrame(() => this.swing());
    }

    swing() {
        if (!this.isSwinging) return;

        this.swingTime += 0.05;

        const swingAngle = Math.sin(this.swingTime * 0.5 * Math.PI);
        this.weapon.rotation.set(Math.PI / 2, Math.PI / 2, 5 * Math.PI / 6 + swingAngle);

        if (!this.hasHit && this.swingTime > 0.3 && this.swingTime < 0.7) {
            this.checkCollisions();
        }

        if (this.swingTime >= 1) {
            this.isSwinging = false;
            this.weapon.rotation.set(Math.PI / 2, Math.PI / 2, 5 * Math.PI / 6);
        } else {
            requestAnimationFrame(() => this.swing());
        }
    }

    checkCollisions() {
        const weaponWorldPos = new THREE.Vector3();
        this.weapon.getWorldPosition(weaponWorldPos);

        const weaponRadius = 1.5;

        this.world.enemies.children.forEach((enemy) => {
            if (!enemy.isAlive) return;

            const enemyPos = enemy.position;
            const enemyRadius = 2.8 * enemy.scale.x;
            const distance = weaponWorldPos.distanceTo(enemyPos);

            if (distance < weaponRadius + enemyRadius) {
                const damage = this.hero.attackPower;
                enemy.takeDamage(damage);
                this.hasHit = true;
                // Set the selected enemy and update the target bar
                window.selectedEnemy = enemy; // Use global scope to match main.js
                window.updateTargetBar(); // Trigger target bar update
                console.log(`Dealt ${damage} damage to enemy. Enemy health: ${enemy.health}`);
                window.showDamageMessage(`Enemy hit! Damage: ${damage}`);
            }
        });
    }
}