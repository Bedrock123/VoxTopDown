import Component from '@EntityComponentCore/Component';

class HealthHUD extends Component {
    constructor()
    {
        super();
        this._healthElements = {};

        // Initlize the weapon variables
        this._Init();
    }

    // All receivers that update the HUD
    InitComponent() {
        this._RegisterHandler('healthHUD.damage', (m) => this._OnDamage(m));
    }


    _Init() {
        // Update all the ammo elements with the proper document selectors
        this._healthElements = {
            healthLeft: document.getElementById("healthLeft")
        };

    }

    // Remove a heatlh bar when the player is damaged
    _OnDamage(m) {
        this._healthElements.healthLeft.innerText = m.healthLeft;
    }
}

export default HealthHUD;

