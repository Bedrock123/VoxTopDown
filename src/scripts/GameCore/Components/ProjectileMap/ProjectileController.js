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
        this.projectilesFired = []; // All the bullets that are tracked in the scene
    }

    // Add the project to the global array
    AddProjectile(projectileObject) {
        this.projectilesFired.push(projectileObject);
    }


    Update(timeDelta) {
        // Get all the player, enement, and wall border boxes
        // Loop through the projectiles fired
            // Move each projectile forward by the gun details speed
            // Create a border box for that individual bullet
            // Chceck to see if the bullet collided with any of the above
                // If the bullet is owned by that collosition object - do nothing
                // If not, then if
                    // Wall - kill bullet and remove from scene
                    // Enemy - send health damage to enement entity health component
                        // Remove from scene
                        // Kill Bullet
                    // Player - Check if currently in doge state
                        // Player - Send health damage to player 

        // Get all the objects in scene that projectils can collide with
        const playerHitBox = this.FindEntity("Player").GetComponent("PlayerModel")._target;


        let hitBullets = [];
        let count = 0;
        let playerModel = this.FindEntity("NPC").GetComponent("HitBox")._target;
        // console.log(playerModel)
        // if (playerModel) {
        //     playerModel = playerModel.children[0]
        // }



        // console.log(playerModel)
        this.projectilesFired.map((projectileObject) => {
            if (projectileObject) {
                projectileObject.model.translateZ(projectileObject.speed * timeDelta);
                var bulletBB = new THREE.Box3().setFromObject(projectileObject.model);
                // bulletBB.expandByScalar(1);
                var enemyBB = new THREE.Box3().setFromObject(playerModel);
    
    
                var bulletCollision = bulletBB.intersectsBox(enemyBB);
                if(bulletCollision){
                    console.log("collrision");
                    hitBullets.push(count);
       
    
                }
                count += 1;
            }

        });

        if (hitBullets.length > 0) {
            hitBullets.map((bulletIndex) => {
                if (this.projectilesFired[bulletIndex]) {

                    this._params.scene.remove(this.projectilesFired[bulletIndex].model);
                    this.projectilesFired.splice(bulletIndex, 1);
                }
                
            });
        }
    }

}

export default ProjectileController;

