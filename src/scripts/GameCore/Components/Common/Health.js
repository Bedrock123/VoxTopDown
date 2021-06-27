
// ECS
import Component from '@EntityComponentCore/Component';

// Stores the player or npc's health and takes in damage from impact
class Health extends Component {
    constructor(params) {
        super();
        this._health = params.health;
        this._player = params.player;
        this._params = params;
    }

    InitComponent() {
        this._RegisterHandler('health.damage', (m) => {
            this._OnDamage(m);
        });
    }

    _OnDeath() {
        this.Broadcast({
            topic: 'health.death',
        });
    }

    _OnDamage(m) {
        // If the health compone is owned by the player then only decrent 1 health point oer hit
        if (this._player) {
            this._health = Math.max(0.0, this._health - 1);
            
            // Send updates to the HUD
            this.Broadcast({
                topic: 'healthHUD.damage',
                healthLeft: this._health
            });

        } else {
            this._health = Math.max(0.0, this._health - m.damage);
        }
        if (this._health == 0) {
            this._OnDeath(m.attacker);
        }
    }

}

export default Health;