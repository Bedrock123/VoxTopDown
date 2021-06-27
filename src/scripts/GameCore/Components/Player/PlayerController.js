import * as THREE from 'three';
import globals from "@helpers/globals";

// ECS
import Component from '@EntityComponentCore/Component';

// Player State
import PlayerFiniteStateMachine from '@GameCore/Components/Player/State/PlayerFiniteStateMachine';
import CharacterControllerProxy from '@GameCore/Components/Common/CharacterControllerProxy';

class PlayerController extends Component {
    constructor(params) {
        super();
        this._params = params;
        this._intersectPoint = null;
        this._prevStateName = null;
        this._dogeMovement = null;
        this._dogeRotationHelper = [];
        this._invincible = false;
        this._animations = {};
        this._stateMachine = new PlayerFiniteStateMachine(new CharacterControllerProxy(this._animations));


        this._Init();
    }

    _Init() {
        // Set the player look helper
        this._SetPlayerOrientationHelpers();

    }

    InitComponent() {
        this._RegisterHandler('update.position', (m) => {
            this._OnPosition(m);
        });
        this._RegisterHandler('health.damage', (m) => {
            this._OnDamage(m);
        });
        this._RegisterHandler('health.death', (m) => { 
            this._OnDeath(m); 
        });
    }



    _OnPosition(m) {
        if (this._target) {
            this._target.position.set(m.value.x, 0, m.value.z);
        }
    }

    _OnDamage() {
        // When the player takes damage, set a flag so they cant take any more until the timer is over
        this._invincible = true;

        // After globals timing set it back to false
        setTimeout(function(){ this._invincible = false;  }.bind(this), globals.player.invincibilityRechargeTime);
    }

    _OnDeath(msg) {
        this._stateMachine.SetState('death');
    }


    // Gets if the player can take damage - they are either doging or invisible
    get CanTakeDamage() {
        return this._stateMachine._currentState.Name !== 'doge' && !this._invincible;
    }

        

    _SetPlayerOrientationHelpers() {
        // Helpers guide the player model orientation
        const playerOrientationHelper = new THREE.Mesh( new THREE.BoxGeometry(0, 0, 0), new THREE.MeshStandardMaterial());
        this._params.scene.add(playerOrientationHelper);

        // Set the player helper as the component target
        this._target = playerOrientationHelper;


        // For precise doge rollwing set 8 helpers around the doge to for target to look at
        const rotationHelperMesh = new THREE.MeshStandardMaterial({color: "red"});

        const positions = [
            [0, 0, -5],
            [2.5, 0, -2.5],
            [5, 0, 0],
            [2.5, 0, 2.5],
            [0, 0, 5],
            [-2.5, 0, 2.5],
            [-5, 0, 0],
            [-2.5, 0, -2.5],
        ];

        positions.map((position) => {
            const dogeRotationHelper = new THREE.Mesh( new THREE.BoxGeometry(0, 0, 0), rotationHelperMesh);
            dogeRotationHelper.position.set(position[0], position[1], position[2],);
            this._params.scene.add(dogeRotationHelper);
            this._dogeRotationHelper.push(dogeRotationHelper);
        });

    }

    _GetPointInBetweenByPerc(pointA, pointB, percentage) {
        let dir = pointB.clone().sub(pointA);
        let len = dir.length();
        dir = dir.normalize().multiplyScalar(len*percentage);
        return pointA.clone().add(dir);
    }

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

    _GetPlayerPositionChange(keysPressed, currentState, timeDelta) {
        // Define the changes to the characters x and z coordinates
        let xDelta = 0;
        let zDelta = 0;

        // Get the direction up or down 
        let xDirection = null;
        let yDirection = null;

        let speed = globals.player.moveSpeed;
        // Define the player speed based on state
        if (currentState.Name === 'doge') {
            speed = globals.player.dogeSpeed;
        }

        // Set the player in motion and position
        if (keysPressed.left.pressed) {
            xDelta = timeDelta * speed * -1;
            xDirection = 'left';
        }
        if (keysPressed.right.pressed) {
            xDelta = timeDelta * speed;
            xDirection = 'right';
        }
        if (keysPressed.up.pressed) {
            zDelta = timeDelta * speed  * - 1;
            yDirection = 'up';
        }
        if (keysPressed.down.pressed) {
            zDelta = timeDelta * speed;
            yDirection = 'down';
        }

        // Get the directional doge rotation of the player 
        let dogeRotationHelperToRotateTo = null;
        if (yDirection && !xDirection) {
            if (yDirection === 'up') {
                dogeRotationHelperToRotateTo = 1;
            } else {
                dogeRotationHelperToRotateTo = 5;
            }
        } else if (xDirection && !yDirection) {
            if (xDirection === 'right') {
                dogeRotationHelperToRotateTo = 3;
            } else {
                dogeRotationHelperToRotateTo = 7;
            }
        } else if (
            xDirection === "right" &&
            yDirection === "up"
        ) {
            dogeRotationHelperToRotateTo = 2;
        } else if (
            xDirection === "right" &&
            yDirection === "down"
        ) {
            dogeRotationHelperToRotateTo = 4;
        } else if (
            xDirection === "left" &&
            yDirection === "up"
        ) {
            dogeRotationHelperToRotateTo = 8;
        } else if (
            xDirection === "left" &&
            yDirection === "down"
        ) {
            dogeRotationHelperToRotateTo = 6;
        }

        return {
            xDelta,
            zDelta,
            dogeRotationHelperToRotateTo
        };
    }


    _HandleMovement(timeDelta, input, currentState) {
        const keysPressed = input.keysPressed;
        this._intersectPoint = input.intersectPoint;
        
        // Get the parent position and rotation
        const controlObject = this._parent;

        // Get the player position change
        let {xDelta, zDelta, dogeRotationHelperToRotateTo} = this._GetPlayerPositionChange(keysPressed, currentState, timeDelta);

        // If the player is doging save the last x z delta and run that for the frams instead of new key presses
        if (this._prevStateName === "run") {
            if (currentState.Name === "doge") {
                this._dogeMovement = {xDelta, zDelta, dogeRotationHelperToRotateTo};
            };
        };

        // If the player is done dogging then remove those last saved delta
        if (this._prevStateName === "doge") {
            if (currentState.Name !== "doge") {
                this._dogeMovement = null;
            };
        };

        // Set the previous state 
        this._prevStateName = currentState.Name;

        // If there is a saved doge xz delta then set the xz delta to that last direction
        if (this._dogeMovement) {
            xDelta = this._dogeMovement.xDelta;
            zDelta = this._dogeMovement.zDelta;
        }

        // If there is a change in the position, then update the entity position
        if (zDelta !== 0 || xDelta !== 0) {
            controlObject.SetPosition(
                controlObject._position.x += xDelta, 
                controlObject._position.y, 
                controlObject._position.z += zDelta,
            );
        }

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
        else {
            if (this._dogeMovement.dogeRotationHelperToRotateTo) {
                // Set orientation helper to look at the intersect point
                this._target.lookAt(this._dogeRotationHelper[this._dogeMovement.dogeRotationHelperToRotateTo - 1].position);
                // Set the entity roation to the same as the orientation helper
                controlObject.SetRotation(this._target.rotation.x, this._target.rotation.y, this._target.rotation.z);
            }
        }

        // Change up the doge roatio helper positions based on the movment          
        this._dogeRotationHelper.map((rotationHelper) => {
            rotationHelper.position.set(rotationHelper.position.x += xDelta , 0, rotationHelper.position.z += zDelta);
        });

        let lengthFactor = .7;
        // Get the middle point between the entity position and the intersect point
        const middlePoint = this._GetPointInBetweenByPerc(this._intersectPoint, controlObject._position, lengthFactor);

        // Access the topDown camera and set camera look at position to the center
        const topDownCamera = this.GetComponent('TopDownCamera');
        topDownCamera._cameraControls.moveTo(middlePoint.x, middlePoint.y, middlePoint.z, true);
    }
    
    _HandleTriggerItem(_, input, currentState) {
        // If they are not currently dogging as well
        const triggerInventoryItem = input.mouseButtonsPressed.left && currentState.Name !== "doge";
        
        // If they are shooting then broadcast shoot
        // Pass in the player position and rotation to the item for actions
        if (triggerInventoryItem) {
            this.Broadcast({
                topic: 'inventory.triggerItem',
                playerPosition: this._parent._position,
                playerRotation: this._parent._rotation
            });
        };
    }

    _HandleInventoryChange(_, input) {
        const changeInventoryItem = input.keysPressed.space;

        // Change the weapon on a set interval if it is pressed
        if (changeInventoryItem.justPressed) {
            // Change the just pressed key back to false
            input.keysPressed.space.justPressed = false;
            this.Broadcast({
                topic: 'inventory.swapItem',
            });
        }
    }

    _HaneItemReload(_, input) {
        const reloadItem = input.keysPressed.rKey;

        // Change the weapon on a set interval if it is pressed
        if (reloadItem.justPressed) {
            // Change the just pressed key back to false
            input.keysPressed.rKey.justPressed = false;
            this.Broadcast({
                topic: 'inventory.reload',
            });
        }
    }

    Update(timeDelta) {
        // Get the input constants
        const input = this.GetComponent('PlayerInput');

        // If there is no default player state then do nothing
        if (!this._stateMachine._currentState) {
            return;
        }

        // Get the current state and if it is not the following then cancel
        const currentState =  this._UpdateStateMachineAndGetCurrentState(timeDelta, input);

        if (currentState.Name !== "death") {
            // Handle the player movememtn
            this._HandleMovement(timeDelta, input, currentState);
    
            // Handle hte player shooting
            this._HandleTriggerItem(timeDelta, input, currentState);
    
            // Handle weapon changes
            this._HandleInventoryChange(timeDelta, input);
            
            // Handle weapon reload 
            this._HaneItemReload(timeDelta, input);
        }

    }

}


export default PlayerController;