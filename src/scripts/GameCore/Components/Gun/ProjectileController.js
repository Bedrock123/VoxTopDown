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
        if (!this.box) {
            this.box = m.box;
        }

        // Helpers guide the player model orientation
        const playerOrientationHelper = new THREE.Mesh( new THREE.SphereGeometry(.5, 32, 32), new THREE.MeshLambertMaterial({color: this._gunDetails.bulletColor, emissive: this._gunDetails.bulletColor, emissiveIntensity: 3}));

        

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
        let colliision = false;
        this._bullets.map((bullet) => {
            bullet.translateZ(this._gunDetails.bulletSpeed * timeDelta);
            var bulletBB = new THREE.Box3().setFromObject(bullet);
            // bulletBB.expandByScalar(1s)
            var enemyBB = new THREE.Box3().setFromObject(this.box);


            var bulletCollision = bulletBB.intersectsBox(enemyBB);
            if(bulletCollision){
                colliision = true;
            }

        });

        if (colliision) {
            this._bullets.map((bullet) => {
                this._params.scene.remove(bullet);
            });
            this._bullets = [];
        }
    }

}

export default ProjectileController;

