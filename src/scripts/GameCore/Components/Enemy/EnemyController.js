
// ECS
import Component from '@EntityComponentCore/Component';

class EnemyController extends Component {
    constructor(params) {
        super();
    }

    Update(timeDelta) {
        this.Broadcast({
            topic: 'inventory.triggerItem',
            playerPosition: this._parent._position,
            playerRotation: this._parent._rotation
        });

        this._parent.SetRotation(0, this._parent._rotation.y += (timeDelta * 1) ,0);
    }
}

export default EnemyController;