import * as THREE from 'three';

// Check collision between hero and world objects
export function checkCollision(newPosition, world) {
    const { width, height, edgeMargin, trees, rocks, bushes } = world;
    const halfWidth = width / 2 - edgeMargin;
    const halfHeight = height / 2 - edgeMargin;

    // Prevent moving outside the world bounds
    if (Math.abs(newPosition.x) > halfWidth || Math.abs(newPosition.z) > halfHeight) {
        return true;
    }

    // Define bounding sphere radii based on object scales
    const bodyRadius = 0.5;
    const shoulderRadius = 0.25;
    const handRadius = 0.15;

    // Positions of additional body parts
    const shoulderLPos = new THREE.Vector3(newPosition.x - 0.7, newPosition.y + 0.4, newPosition.z);
    const shoulderRPos = new THREE.Vector3(newPosition.x + 0.7, newPosition.y + 0.4, newPosition.z);
    const handLPos = new THREE.Vector3(newPosition.x - 0.7, newPosition.y - 0.1, newPosition.z);
    const handRPos = new THREE.Vector3(newPosition.x + 0.7, newPosition.y - 0.1, newPosition.z);

    // Objects to check for collisions
    const objectsToCheck = [
        { group: trees, scaleFactor: 0.9 },
        { group: rocks, scaleFactor: 0.75 },
        { group: bushes, scaleFactor: 0.45 }
    ];

    // Function to check if any body part collides with objects
    const checkPartCollision = (partPos, partRadius) => {
        return objectsToCheck.some(({ group, scaleFactor }) =>
            group.children.some(obj => {
                const scaledRadius = scaleFactor * obj.scale.x; // Adjust collision radius based on scale
                return partPos.distanceTo(obj.position) < partRadius + scaledRadius;
            })
        );
    };

    // Check for collisions with the body, shoulders, and hands
    return (
        checkPartCollision(newPosition, bodyRadius) ||
        checkPartCollision(shoulderLPos, shoulderRadius) ||
        checkPartCollision(shoulderRPos, shoulderRadius) ||
        checkPartCollision(handLPos, handRadius) ||
        checkPartCollision(handRPos, handRadius)
    );
}