import * as THREE from 'three';
import globals from "@helpers/globals";

// ECS
import Component from '@EntityComponentCore/Component';

// Player State
import PlayerFiniteStateMachine from './State/PlayerFiniteStateMachine';

class PlayerController extends Component {
    constructor(params) {
        super();
        this._params = params;
        this._intersectPoint = null;
        this._stateMachine = new PlayerFiniteStateMachine();
        this._Init();
    }

    _Init() {
        // Set the player look helper
        this._SetPlayerOrientationHelper();

        // Set the intial state
        this._stateMachine.SetState('idle');
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

    _GetPointInBetweenByPerc(pointA, pointB, percentage) {
        let dir = pointB.clone().sub(pointA);
        let len = dir.length();
        dir = dir.normalize().multiplyScalar(len*percentage);
        return pointA.clone().add(dir);
    };

    _UpdateStateMachineAndGetCurrentState(timeDelta, input, ) {
        // Update the player state machine to determine what state we are in
        this._stateMachine.Update(timeDelta, input);

        // Braod cast the current player state
        if (this._stateMachine._currentState._action) {
            this.Broadcast({
                topic: 'player.action',
                action: this._stateMachine._currentState.Name,
                time: this._stateMachine._currentState._action.time,
            });
        }
        return this._stateMachine._currentState;
    }
    Update(timeDelta) {

        // If there is no default player state then do nothing
        if (!this._stateMachine._currentState) {
            return;
        }
    
        // Get the input constants
        const input = this.GetComponent('PlayerInput');
        const keysPressed = input.keysPressed;
        this._intersectPoint = input.intersectPoint;
        
        // Get the current state and if it is not the following then cancel
        const currentState =  this._UpdateStateMachineAndGetCurrentState(timeDelta, input);

        // Get the parent position and rotation
        const controlObject = this._parent;

        // Define the changes to the characters x and z coordinates
        let xDelta = 0;
        let zDelta = 0;

        let speed = globals.player.moveSpeed;
        // Define the player speed based on state
        if (currentState.Name === 'doge') {
            speed = globals.player.dogeSpeed;
        }
        
        // Set the player in motion and position
        if (keysPressed.left.pressed) {
            xDelta = timeDelta * speed * -1;
        }
        if (keysPressed.right.pressed) {
            xDelta = timeDelta * speed;
        }
        if (keysPressed.up.pressed) {
            zDelta = timeDelta * speed  * - 1;
        }
        if (keysPressed.down.pressed) {
            zDelta = timeDelta * speed;
        }
        

        // If there is a change in the position, then update the entity position
        if (zDelta !== 0 || xDelta !== 0) {
            controlObject.SetPosition(
                controlObject._position.x += xDelta, 
                controlObject._position.y, 
                controlObject._position.z += zDelta,
            );
        }
        // Set the oritation helper to look at the intersect point and then set the entity rotation to match it
        if (this._intersectPoint) {
            
            // Change the mouse cursor intersect point by the change position
            this._intersectPoint.x += xDelta;
            this._intersectPoint.z += zDelta;
            
            // Dont roate the player if they are doging
            if (currentState.Name !== 'doge') {
                // Set orientation helper to look at the intersect point
                this._target.lookAt(this._intersectPoint);
    
                // Set the entity roation to the same as the orientation helper
                controlObject.SetRotation(this._target.rotation.x, this._target.rotation.y, this._target.rotation.z);
            }

            let lengthFactor = .7;
            // Get the middle point between the entity position and the intersect point
            const middlePoint = this._GetPointInBetweenByPerc(this._intersectPoint, controlObject._position, lengthFactor);

            // Access the topDown camera and set camera look at position to the center
            const topDownCamera = this.GetComponent('TopDownCamera');
            topDownCamera._cameraControls.moveTo(middlePoint.x, middlePoint.y, middlePoint.z, true);

        }


        
    }

}


export default PlayerController;