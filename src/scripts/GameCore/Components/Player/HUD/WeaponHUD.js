import Component from '@EntityComponentCore/Component';

class WeaponHUD extends Component {
    constructor()
    {
        super();
        this._ammoElements = {};

        // Initlize the weapon variables
        this._Init();
    }

    // All receivers that update the HUD
    InitComponent() {
        this._RegisterHandler('weapon.equip', (m) => this._OnWeaponEquip(m));
        
        this._RegisterHandler('weapon.shoot', (m) => this._OnWeaponShoot(m));
        
        this._RegisterHandler('weapon.reloaded', (m) => this._OnWeaponReloaded(m));
        
        this._RegisterHandler('weapon.reloading', () => this._OnWeaponReloading());
    }


    _Init() {
        // Update all the ammo elements with the proper document selectors
        this._ammoElements = {
            ammoLeftInMag: document.getElementById("ammoLeftInMag"), 
            magCapacity: document.getElementById("magCapacity"),
            ammoLeft: document.getElementById("ammoLeft"),
            maxAmmo: document.getElementById("maxAmmo"),
        };

    }

    // When the weapon is equipped, update all the current ammo stats
    _OnWeaponEquip(m) {
        this._ammoElements.magCapacity.innerText = m.magCapacity;
        this._ammoElements.maxAmmo.innerText = m.maxAmmo;
        this._ammoElements.ammoLeft.innerText = m.ammoLeft;
        this._ammoElements.ammoLeftInMag.innerText = m.ammoLeftInMag;
    }

    // When the weapon shoots, update the ammoLeft and ammoLeftInMag
    _OnWeaponShoot(m) {
        this._ammoElements.ammoLeft.innerText = m.ammoLeft;
        this._ammoElements.ammoLeftInMag.innerText = m.ammoLeftInMag;
    }

    // When the weapon reloads update the ammo left in mag
    _OnWeaponReloaded(m) {
        this._ammoElements.ammoLeftInMag.innerText = m.ammoLeftInMag;
    }

    // When the weapon is in the loading animation
    _OnWeaponReloading() {
        this._ammoElements.ammoLeftInMag.innerText = "-";
    }
}

export default WeaponHUD;

