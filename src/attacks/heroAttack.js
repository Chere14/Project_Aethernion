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

        console.log(`Starting swing with attack power: ${this.hero.attackPower}, range: ${this.hero.attackRange}`);

        requestAnimationFrame(() => this.swing());
    }

    swing() {
        if (!this.isSwinging) return;

        this.swingTime += 0.03;

        const swingAngle = Math.sin(this.swingTime * 0.5 * Math.PI);
        this.weapon.rotation.set(Math.PI / 2, Math.PI / 2, 4 * Math.PI / 5 + swingAngle);

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
        const heroPos = this.hero.position.clone(); // Hero's world position

        this.world.enemies.children.forEach((enemy) => {
            if (!enemy.isAlive) return;

            const enemyPos = enemy.position.clone();
            const distanceToEnemy = heroPos.distanceTo(enemyPos);

            // Check if enemy is within attack range
            if (distanceToEnemy <= this.hero.attackRange) {
                const damage = this.hero.attackPower;
                enemy.takeDamage(damage);
                this.hasHit = true;
                window.selectedEnemy = enemy;
                window.updateTargetBar();
                console.log(`Hit enemy at ${distanceToEnemy.toFixed(2)} units. Dealt ${damage} damage. Enemy health: ${enemy.health}`);
                window.showDamageMessage(`Enemy hit! Damage: ${damage}`);
            } else {
                console.log(`Enemy at ${distanceToEnemy.toFixed(2)} units is beyond range (${this.hero.attackRange})`);
            }
        });
    }
}