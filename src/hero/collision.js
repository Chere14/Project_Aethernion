import * as THREE from 'three';

// Check collision between hero and world objects
export function checkCollision(newPosition, world, heroScale = 1) {
    const { width, height, edgeMargin, trees, rocks, bushes, enemies } = world;
    const halfWidth = width / 2 - edgeMargin;
    const halfHeight = height / 2 - edgeMargin;

    // Prevent moving outside the world bounds
    if (Math.abs(newPosition.x) > halfWidth || Math.abs(newPosition.z) > halfHeight) {
        return true;
    }

    // Hero body parts scaled dynamically
    const bodyRadius = 0.5 * heroScale;
    const shoulderRadius = 0.25 * heroScale;
    const handRadius = 0.15 * heroScale;

    // Hero body part positions
    const shoulderLPos = new THREE.Vector3(newPosition.x - 0.7 * heroScale, newPosition.y + 0.4 * heroScale, newPosition.z);
    const shoulderRPos = new THREE.Vector3(newPosition.x + 0.7 * heroScale, newPosition.y + 0.4 * heroScale, newPosition.z);
    const handLPos = new THREE.Vector3(newPosition.x - 0.7 * heroScale, newPosition.y - 0.1 * heroScale, newPosition.z);
    const handRPos = new THREE.Vector3(newPosition.x + 0.7 * heroScale, newPosition.y - 0.1 * heroScale, newPosition.z);

    // Objects to check for collisions
    const objectsToCheck = [
        { group: trees, scaleFactor: 0.9 },
        { group: rocks, scaleFactor: 0.75 },
        { group: bushes, scaleFactor: 0.45 },
        { group: enemies, scaleFactor: 2.8 } 
    ];

    // Function to check if any body part collides with objects
    const checkPartCollision = (partPos, partRadius) => {
        return objectsToCheck.some(({ group, scaleFactor }) =>
            group.children.some(obj => {
                const objectRadius = scaleFactor * obj.scale.x; // Scale collision radius with size
                return partPos.distanceTo(obj.position) < partRadius + objectRadius;
            })
        );
    };

    // Check for collisions with body, shoulders, and hands
    return (
        checkPartCollision(newPosition, bodyRadius) ||
        checkPartCollision(shoulderLPos, shoulderRadius) ||
        checkPartCollision(shoulderRPos, shoulderRadius) ||
        checkPartCollision(handLPos, handRadius) ||
        checkPartCollision(handRPos, handRadius)
    );
}