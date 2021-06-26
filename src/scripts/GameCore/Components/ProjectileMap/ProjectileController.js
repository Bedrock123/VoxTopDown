// Three
import * as THREE from 'three';

// ECS
import Component from '@EntityComponentCore/Component';

// Entity that conrolls the guns stats and firing.
class ProjectileController extends Component {
    constructor(params)
    {
        super();
        this._params = params; // used only to add to scene
        this._mappedProjectiles = []; // All the bullets that are tracked in the scene
    }

    // Add the project to the global array
    AddProjectile(projectileObject) {
        this._mappedProjectiles.push(projectileObject);
    }


    Update(timeDelta) {
        let hitBoxesToCheck;
        if (this._mappedProjectiles.length > 0) {
            // Define the list of hitboxes to check form
            hitBoxesToCheck = [
                {
                    entity: this.FindEntity("NPC").GetComponent("HitBox"),
                    owner: "NPC"
                },
                {
                    entity: this.FindEntity("Player").GetComponent("HitBox"),
                    owner: "Player"
                },
    
            ];
        }

        // Loop through the projectiles fired
        this._mappedProjectiles.forEach((projectileObject, index) => {

            // Projectile flag to remove from scene or not
            let removeProjectile = false;

            // Calculate the distance the projectile should travel in the perdio
            const distanceToTravel = projectileObject.speed * timeDelta;
            projectileObject.distanceTraveled += distanceToTravel;

            if (projectileObject.distanceTraveled <= projectileObject.maxRange ) {
                projectileObject.model.translateZ(distanceToTravel);
            } else {
                removeProjectile = true;
            }

            if (!removeProjectile) {
                // Check for collisions
                const projectileBox3D = new THREE.Box3().setFromObject(projectileObject.model);
    
                // Loop through the hit boxes and check if its a good hit
                hitBoxesToCheck.map(function(hitBoxToCheck) {
                    // If there was not already a collision with another hitbox on the hiearchy, stop checking
                    if (projectileBox3D.intersectsBox(hitBoxToCheck.entity.Box3D) && !removeProjectile) {
                        
                        // If the projectile hit something that did not come from it
                        if (projectileObject.owner !== hitBoxToCheck.owner) {

                            // If the hit entity is a player then check to see if they are dogging or not
                            if (hitBoxToCheck.owner === "Player") {
                                if (hitBoxToCheck.entity.GetComponent("PlayerController").CanTakeDamage) {
                                    // Mark the projectile to tbe rmeoved
                                    removeProjectile = true;
                                
                                    // Broadcast the damage
                                    hitBoxToCheck.entity.Broadcast({
                                        topic: 'health.damage',
                                        damage: projectileObject.damage,
                                    });
                                }

                            // All else just remove the projectile and broadcast damage
                            } else {
                                // Mark the projectile to tbe rmeoved
                                removeProjectile = true;
                            
                                // Broadcast the damage
                                hitBoxToCheck.entity.Broadcast({
                                    topic: 'health.damage',
                                    damage: projectileObject.damage,
                                });
                            }
                        }
                    }
                });
            }

            // If we flagged to remove the proectile, remove it from the mapped array and the sceen
            if (removeProjectile) {
                this._params.scene.remove(this._mappedProjectiles[index].model);
                this._mappedProjectiles.splice(index, 1);
            }
        });
        
    }

}

export default ProjectileController;

