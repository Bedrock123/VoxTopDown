import * as THREE from 'three';
import globals from "@helpers/globals";

// ECS
import Component from '@EntityComponentCore/Component';

class PlayerController extends Component {
    constructor(params) {
        super();
        this._params = params;
        this._intersectPoint = null;

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

        const aimHelper = new THREE.Mesh( new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({color: "red"}));
        this._params.scene.add(aimHelper);
        this._aimHelper = aimHelper;

    }

    Update(timeDelta) {

        // Get the input constants
        const input = this.GetComponent('PlayerInput');
        const keysPressed = input.keysPressed;
        this._intersectPoint = input.intersectPoint;
        
        // Get the parent position and rotation
        const controlObject = this._parent;

        let xDelta = 0;
        let zDelta = 0;

        // Set the player in motion and position
        if (keysPressed.left.pressed) {
            xDelta = timeDelta * globals.player.moveSpeed * -1;
            
        }
        if (keysPressed.right.pressed) {
            xDelta = timeDelta * globals.player.moveSpeed;
        }
        if (keysPressed.up.pressed) {
            zDelta = timeDelta * globals.player.moveSpeed  * - 1;
        }
        if (keysPressed.down.pressed) {
            zDelta = timeDelta * globals.player.moveSpeed;
        }
        
        if (zDelta !== 0 || xDelta !== 0) {
            controlObject.SetPosition(
                controlObject._position.x += xDelta, 
                controlObject._position.y, 
                controlObject._position.z += zDelta,
            );
        }
        // Set the oritation helper to look at the intersect point and then set the entity rotation to match it
        if (this._intersectPoint) {
            this._intersectPoint.x += xDelta;
            this._intersectPoint.z += zDelta;
            this._target.lookAt(this._intersectPoint);
            controlObject.SetRotation(this._target.rotation.x, this._target.rotation.y, this._target.rotation.z);

            this._aimHelper.position.set(this._intersectPoint.x, this._intersectPoint.y, this._intersectPoint.z);
            // console.log(this._params.camera)
        }
        
    }

}


export default PlayerController;