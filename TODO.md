# To Do List

- [X] World
    - [X] Terrain
    - [X] Trees
    - [X] Rocks

- [X] Player Character
    - [X] Create a character
    - [X] WASD controls
    - [X] Navigation 

- [X] Enemies
    - [X] Create the enemies

- [ ] Combat
    - [X] Health system for the hero and the creatures
    - [ ] Attack system for the hero and the creatures

- [ ] UI 
    - [X] Health bar for the hero
    - [ ] Mini map for a better orientation in the world
    - [ ] Skill icons
    - [ ] Menu bar
    - [X] Target bar with enemy health bar

## Observations and Improvements

- [X] Camera at the edge of the terrain is increasing the distance between it and the character when keep goinig in the direction of the edge. 
- [X] The character speed is incresing when moving in the diagonal direction. The speed should be the same in every direction, even when going in a combined movement (up + right).
- [X] Create modular files for objects to have a better structure, better performance and scalability.
- [ ] The creature will follow the hero but won't attack him, instead the hero get's stuck inside the creature.