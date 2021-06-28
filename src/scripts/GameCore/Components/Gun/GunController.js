import Component from '@EntityComponentCore/Component';

// Entity that conrolls the guns stats and firing.
class GunController extends Component {
    constructor(params)
    {
        super();
        this._params = params; // used only to add to scene
        this._gunDetails = params.gunDetails; // global gun details dict pass through
        this._owner = null; // the player or AI entithy that owns this guns

        this._lastShot = null; // the time stamp of the last shot
        this.bulletsLeftInMagazine = this._gunDetails.magazineCapacity; // the relative current mag size
        this.ammoLeft = this._gunDetails.maxAmmoCapacity;

        this._reloading = false;
    }

    InitComponent() {
        // Listen for then the player entity triggers the item
        this._RegisterHandler('item.trigger', (m) => this._OnTrigger(m));
        
        // Listen for then the player entity reloads the item
        this._RegisterHandler('item.reload', (m) => this._Reload(m));
    }

    // Sets the guns owner (Player or Enemy AI)
    SetOwner(owner) {
        this._owner = owner;
    }

    _OnTrigger(m) {

        // If the gun is current in a firing state
        // If they have bullets left in the magainze
        // If its an enemy then they dont have to reload
        if ((this.bulletsLeftInMagazine > 0 && this.ammoLeft > 0) || this._owner.Name !== "Player") {

            // If this is their first time shooting
            if (!this._lastShot) {

                // Set the last shot to now
                this._lastShot = new Date();

                // Reduce the bullets in mag
                this.bulletsLeftInMagazine -= 1;
                this.ammoLeft -= 1;

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
                    this.bulletsLeftInMagazine -= 1;
                    this.ammoLeft -= 1;

                    // Fire the gun
                    this._Shoot(m);
                }
            }
        } else {
            // If there is ammo left and they are not currently reloding their gund
            if (this.ammoLeft > 0 && !this._reloading) {
                // Reload the gun
                this._Reload();
            }
        }
    }

    _Reload() {

        // If we are not currently reloading now
        if (
            !this._reloading && 
            (this.bulletsLeftInMagazine !== this._gunDetails.magazineCapacity)
        ) {
            // Set reloading to true
            this._reloading = true;
    
            // If the player needs to reload then trigger on relod broad
            this._owner.Broadcast({
                topic: 'weapon.reloading'
            });
    
            // Reload the gun after the duration of the reload time
            setTimeout(function(){
                if (this.ammoLeft < this._gunDetails.magazineCapacity) {
                    this.bulletsLeftInMagazine = this.ammoLeft;
                } else {
                    this.bulletsLeftInMagazine = this._gunDetails.magazineCapacity;
                }
    
                // Proad cast the reload function
                this._owner.Broadcast({
                    topic: 'weapon.reloaded',
                    ammoLeftInMag: this.bulletsLeftInMagazine
                });
    
                this._reloading = false;
    
            }.bind(this), this._gunDetails.reloadTime);
        }

    }


    _Shoot(m) {
        // Send to the gun entity that we should shoot the gun
        this.Broadcast({
            topic: 'weapon.shoot',
            startingPosition: m.playerPosition,
            startingRotation: m.playerRotation,
            owner: this._owner.Name,
            damage: this._gunDetails.damage
        });

        // If the player is shooting, then update the HUD
        if (this._owner.Name === "Player") {
            this._owner.Broadcast({
                topic: 'weapon.shoot',
                ammoLeft: this.ammoLeft,
                ammoLeftInMag: this.bulletsLeftInMagazine
            });
        }
        
    }

}

export default GunController;

