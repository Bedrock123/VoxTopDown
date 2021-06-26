
// ECS
import Component from '@EntityComponentCore/Component';

// Stores the player or npc's health and takes in damage from impact
class Health extends Component {
    constructor(params) {
        super();
        this._health = params.health;
        this._maxHealth = params.maxHealth;
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
        this._health = Math.max(0.0, this._health - m.damage);
        console.clear();
        console.log(this._health + "/" + this._maxHealth);
        if (this._health == 0) {
            this._OnDeath(m.attacker);
        }
    }

}

export default Health;