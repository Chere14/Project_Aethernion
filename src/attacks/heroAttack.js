// HeroAttack.js
export class HeroAttack {
    constructor(hero) {
        this.hero = hero;
        this.weapon = this.hero.weapon; // Get the hero's weapon
        this.isSwinging = false;
        this.swingTime = 0;
        this.returnToBack = false;

        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                this.startSwing();
            }
        });
    }

    startSwing() {
        if (this.isSwinging) return;  // Prevent starting a new swing while already swinging

        // Draw the weapon only if it's not already drawn
        if (!this.hero.weaponDrawn) {
            this.hero.attachWeaponToHand(); // Draw weapon if not already drawn
        }

        this.isSwinging = true;
        this.swingTime = 0;

        // Start the swing animation
        requestAnimationFrame(() => this.swing());
    }

    swing() {
        if (!this.isSwinging) return;

        this.swingTime += 0.05;

        // Swing motion 
        const swingAngle = Math.sin(this.swingTime * 0.5 * Math.PI); 

        // Apply rotation to the weapon
        this.weapon.rotation.set(Math.PI / 2, Math.PI / 2, 5 * Math.PI / 6 + swingAngle); 

        // When the swing is complete, stop swinging and return weapon to the back
        if (this.swingTime >= 1) {
            this.isSwinging = false;
            this.weapon.rotation.set(Math.PI / 2, Math.PI / 2, 5 * Math.PI / 6);  

        } else {
            requestAnimationFrame(() => this.swing());
        }
    }
}