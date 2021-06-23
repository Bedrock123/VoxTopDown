import * as THREE from 'three';

// ECS
import Component from '@EntityComponentCore/Component';

// Creates a simple hit box for the players or enemies for simplere detection
class HitBox extends Component {
    constructor(params) {
        super();
        this._params = params;
        this._target = null;

        this._Init();
    }

    InitComponent() {
        this._RegisterHandler('update.position', (m) => {
            this._OnPosition(m);
        });
        this._RegisterHandler('update.rotation', (m) => {
            this._OnRotation(m);
        });
    }

    _OnPosition(m) {
        if (this._target) {
            this._target.position.set(
                m.value.x,
                m.value.y,
                m.value.z 
            );
        }
    }
    
    _OnRotation(m) {
        if (this._target) {
            this._target.rotation.copy(m.value);
        }
    }

    _Init() {
        // Create the hit box and set as target
        const hitBox = new THREE.Mesh( 
            new THREE.BoxGeometry(this._params.size.x, this._params.size.y, this._params.size.z), 
            new THREE.MeshStandardMaterial({    
                transparent: true,
                opacity: 0.0})
            );

        // define the possible z offset for the model
        if (this._params.zOffset) {
            hitBox.position.z = this._params.zOffset;
        }

        // Create the hit box group and add the hit box to it
        const hitBoxGroup = new THREE.Group();
        hitBoxGroup.add(hitBox);
        this._params.scene.add(hitBoxGroup);


        // Set the hit box as the targert
        this._target = hitBoxGroup ;
    }

}

export default HitBox;