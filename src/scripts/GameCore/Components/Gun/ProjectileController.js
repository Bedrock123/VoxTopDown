import * as THREE from 'three';

import Component from '@EntityComponentCore/Component';

// Entity that conrolls the guns stats and firing.
class ProjectileController extends Component {
    constructor(params)
    {
        super();
        this._params = params; // used only to add to scene
        this._gunDetails = params.gunDetails; // global gun details dict pass through
        this._bullets = [];
    }

    InitComponent() {
        // Listen for then the player entity triggers the item
        this._RegisterHandler('gun.shoot', (m) => this._Shoot(m));
    }


    _Shoot(m) {
        // Helpers guide the player model orientation
        const playerOrientationHelper = new THREE.Mesh( new THREE.SphereGeometry(.2, 32, 32), new THREE.MeshLambertMaterial({color: this._gunDetails.bulletColor, emissive: this._gunDetails.bulletColor, emissiveIntensity: 3}));

        

        playerOrientationHelper.position.copy(m.playerPosition);
        playerOrientationHelper.position.y = 3.9;
        let position = m.playerRotation;
        const randomFactor =  1 - this._gunDetails.accuracy;
        position.y = position.y + ((Math.random() * randomFactor) - (randomFactor / 2));
        playerOrientationHelper.rotation.copy(m.playerRotation);
        this._params.scene.add(playerOrientationHelper);
        playerOrientationHelper.translateZ(2.3);
        this._bullets.push(playerOrientationHelper);
        
    }

    Update(timeDelta) {
        this._bullets.map((bullet) => {
            bullet.translateZ(this._gunDetails.bulletSpeed * timeDelta);
        });
    }

}

export default ProjectileController;

