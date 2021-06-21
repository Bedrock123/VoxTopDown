import * as THREE from 'three';
import Component from '@EntityComponentCore/Component';

// Entity that conrolls the guns stats and firing.
class GunController extends Component {
    constructor(params)
    {
        super();
        this._params = params;
        this._magazineSize = 5000;
        this._hitDamage = 1;
        this._rateOfFire = 1; // millseconds per shot
        this._firingAction = 'bullet';

        this._firing = false;
        this._lastShot = null;

        this._bullets = [];

        this._currentMagSize = this._magazineSize;
    }

    InitComponent() {
        // when the gun is fired
        this._RegisterHandler('item.trigger', (m) => this._OnShoot(m));
    }

    _OnShoot(m) {
        // If the gun is current in a firing state
        if ( this._currentMagSize > 0) {
            // If there is not last shot then fire gun
            if (!this._lastShot) {
                this._lastShot = new Date();
                this._currentMagSize -= 1;
                this._fireBullet(m);
            } else {
                var t1 = this._lastShot;
                var t2 = new Date();
                var dif = t1.getTime() - t2.getTime();
                
                var Seconds_from_T1_to_T2 = dif / 1000;
                var Seconds_Between_Dates = Math.abs(Seconds_from_T1_to_T2);
                

                if (Seconds_Between_Dates >= (this._rateOfFire / 1000)) {
                    this._lastShot = new Date();
                    this._currentMagSize -= 1;
                    this._fireBullet(m);
                } else {
                    this._firing = false;
                }
            }

        }

    }

    _fireBullet(m) {
        // Helpers guide the player model orientation
        const playerOrientationHelper = new THREE.Mesh( new THREE.SphereGeometry(.2, 32, 32), new THREE.MeshStandardMaterial({color: "blue"}));

        playerOrientationHelper.position.copy(m.playerPosition);
        playerOrientationHelper.position.y = 3.9;
        let position = m.playerRotation;
        const randomFactor = .3;
        position.y = position.y + ((Math.random() * randomFactor) - (randomFactor / 2));
        playerOrientationHelper.rotation.copy(m.playerRotation);
        this._params.scene.add(playerOrientationHelper);
        playerOrientationHelper.translateZ(2.3);
        this._bullets.push(playerOrientationHelper);
    }

    Update(timeDelta) {
    
        this._bullets.map(function(bullet) {
            bullet.translateZ(30 * timeDelta);
        });
    }

}

export default GunController;

