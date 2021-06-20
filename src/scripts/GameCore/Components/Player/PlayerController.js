import * as THREE from 'three';

// ECS
import Component from '@EntityComponentCore/Component';

class PlayerController extends Component {
    constructor(params) {
        super();
        this._params = params;
        
        this._SetPlayerOrientationHelper();
    }

    InitComponent() {
        this._RegisterHandler('update.position', (m) => {
            this._OnPosition(m);
        });
    }

    _OnPosition(m) {
        if (this._target) {
            this._target.position.set(m.value.x, 0, m.value.z);
        }
    }

    _SetPlayerOrientationHelper() {
        // Helpers guide the player model orientation
        const playerOrientationHelper = new THREE.Mesh( new THREE.BoxGeometry(0, 0, 0), new THREE.MeshStandardMaterial());
        this._params.scene.add(playerOrientationHelper);

        // Set the player helper as the component target
        this._target = playerOrientationHelper;
    }

    Update(timeDelta) {

        // Get the input constants
        const input = this.GetComponent('PlayerInput');
        const keysPressed = input.keysPressed;
        const intersectPoint = input.intersectPoint;
        
        // Get the parent position and rotation
        const controlObject = this._parent;

        // Set the oritation helper to look at the intersect point and then set the entity rotation to match it
        this._target.lookAt(intersectPoint);
        controlObject.SetRotation(this._target.rotation.x, this._target.rotation.y, this._target.rotation.z);

        // Set the player in motion and position
        if (keysPressed.left.pressed) {
            controlObject.SetPosition(
                controlObject._position.x -= timeDelta * 16, 
                controlObject._position.y, 
                controlObject._position.z
            );
            
        }
        if (keysPressed.right.pressed) {
            controlObject.SetPosition(
                controlObject._position.x += timeDelta * 16,
                controlObject._position.y, 
                controlObject._position.z
            );
        }
        if (keysPressed.up.pressed) {
            controlObject.SetPosition(
                controlObject._position.x,
                controlObject._position.y, 
                controlObject._position.z  -= timeDelta * 16 ,
            );
        }
        if (keysPressed.down.pressed) {
                controlObject.SetPosition(
                controlObject._position.x, 
                controlObject._position.y, 
                controlObject._position.z += timeDelta * 16,
            );
        }
        
    }

}


export default PlayerController;