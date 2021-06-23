import Component from '@EntityComponentCore/Component';
import globals from "@helpers/globals";

// Entity that conrolls the guns stats and firing.
class GunController extends Component {
    constructor(params)
    {
        super();
        this._params = params; // used only to add to scene
        this._gunDetails = params.gunDetails; // global gun details dict pass through
        this._owner = null; // the player or AI entithy that owns this guns

        this._lastShot = null; // the time stamp of the last shot
        this._bulletsLeftInMagazine = this._gunDetails.magazineCapacity; // the relative current mag size
    }

    InitComponent() {
        // Listen for then the player entity triggers the item
        this._RegisterHandler('item.trigger', (m) => this._OnTrigger(m));

    }


    _OnTrigger(m) {

        // If the gun is current in a firing state
        // If they have bullets left in the magainze
        if ( this._bulletsLeftInMagazine > 0 || globals.debug) {

            // If this is their first time shooting
            if (!this._lastShot) {

                // Set the last shot to now
                this._lastShot = new Date();

                // Reduce the bullets in mag
                this._bulletsLeftInMagazine -= 1;

                // Shoot the gun
                this._Shoot(m);

            } else {
                // If the playuer has fired before then check the last time they fired and if they can based on teh fire rate
                const  now = new Date();
                const  difference = this._lastShot.getTime() - now.getTime();
                let  secondsSinceLastShot = difference / 1000;
                secondsSinceLastShot = Math.abs(secondsSinceLastShot);
                if (secondsSinceLastShot >= (this._gunDetails.rateOfFire / 1000)) {
                    // Set the last shot to now
                    this._lastShot = new Date();

                    // Reduce the bullets left in magainze
                    this._bulletsLeftInMagazine -= 1;

                    // Fire the gun
                    this._Shoot(m);
                }
            }
        }

    }

    _Shoot(m) {
        // Send to the gun entity that we should shoot the gun
        this.Broadcast({
            topic: 'gun.shoot',
            startingPosition: m.playerPosition,
            startingRotation: m.playerRotation,
            owner: this._owner.Name,
            damage: this._gunDetails.damage
        });

        // // Send to the gun owner that it is shot to edit
        // this._owner.Broadcast({
        //     topic: 'gun.shoot'
        // });
        
    }

}

export default GunController;

