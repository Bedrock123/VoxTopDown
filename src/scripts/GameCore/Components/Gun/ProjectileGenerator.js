import * as THREE from 'three';

import Component from '@EntityComponentCore/Component';

// Entity that conrolls the guns stats and firing.
class ProjectileGenerator extends Component {
    constructor(params)
    {
        super();
        this._params = params; // used only to add to scene
        this._gunDetails = params.gunDetails; // global gun details dict pass through

        this._Init();
    }

    InitComponent() {
        // Listen for then the player entity triggers the item
        this._RegisterHandler('gun.shoot', (m) => this._Shoot(m));
    }

    _Init() {
        // Create the projective grometry and material
        this._projectileGeometry = new THREE.SphereGeometry(.2, 32, 32);
        this._projectileMaterial = new THREE.MeshBasicMaterial({ color: this._gunDetails.bulletColor });
    }

    
    _Shoot(m) {
        // Create the bullet object
        const projectile = new THREE.Mesh(this._projectileGeometry, this._projectileMaterial);
        
        // Set the projtile position as the current players
        projectile.position.copy(m.startingPosition);

        // Set the y position to around 3.9 to be at player height
        projectile.position.y = 2.1;

        // Get the intial player angle as the base projetile angle
        let projectileAngle = m.startingRotation;

        // Based on the guns acruacy, convert that into the spread calculation
        const spreadFactor =  1 - this._gunDetails.accuracy;
        projectileAngle.y = projectileAngle.y + ((Math.random() * spreadFactor) - (spreadFactor / 2));

        // Set the new angle with the spread factored in
        projectile.rotation.copy(projectileAngle);

        // Add the projectile to the scene
        this._params.scene.add(projectile);
        
        // Push the projectile forward a little
        projectile.translateZ(1.3);
        
        // Add the project to the gobal projectiles fired so we can track collision
        const projectileMap = this.FindEntity("ProjectileMap");

        // Send the bullet details to the projectile map
        projectileMap.GetComponent("ProjectileController").AddProjectile({
            model: projectile,
            speed: this._gunDetails.bulletSpeed,
            owner: m.owner,
            damage: m.damage
        });
    
        
    }
}

export default ProjectileGenerator;

