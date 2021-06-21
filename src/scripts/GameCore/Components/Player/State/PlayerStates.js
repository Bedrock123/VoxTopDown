import * as THREE from 'three';


export const PlayerStates = (() => {

    class State {
        constructor(parent) {
            this._parent = parent;
        }

        Enter() {}
        Exit() {}
        Update() {}
    };


    class IdleState extends State {
        constructor(parent) {
            super(parent);
        }

        get Name() {
            return 'idle';
        }

        Enter(prevState) {
            const idleAction = this._parent._proxy._animations['shoot'].action;
            if (prevState) {
                const prevAction = this._parent._proxy._animations[prevState.Name].action;
                idleAction.time = 0.0;
                idleAction.enabled = true;
                idleAction.setEffectiveTimeScale(1.0);
                idleAction.setEffectiveWeight(1.0);
                idleAction.crossFadeFrom(prevAction, 0.25, true);
                idleAction.play();

            } else {
                idleAction.play();
            }
        }

        Exit() {}

        Update(_, input) {
            if (
                input.keysPressed.up.pressed || 
                input.keysPressed.down.pressed ||
                input.keysPressed.left.pressed ||
                input.keysPressed.right.pressed
            ) {
                this._parent.SetState('run');
            }
        }
    };
    class RunState extends State {
        constructor(parent) {
            super(parent);
        }

        get Name() {
            return 'run';
        }

        Enter(prevState) {
            const curAction = this._parent._proxy._animations['run'].action;
            if (prevState) {
                const prevAction = this._parent._proxy._animations[prevState.Name].action;
                curAction.enabled = true;
                curAction.time = 0.0;
                curAction.setEffectiveTimeScale(1.0);
                curAction.setEffectiveWeight(1.0);
                curAction.crossFadeFrom(prevAction, 0.1, true);
                curAction.play();

            } else {
                curAction.play();
            }
        }

        Exit() {}

        Update(_, input) {
            if (input.mouseButtonsPressed.right) {
                this._parent.SetState('doge');
                return;
            }

            if (
                input.keysPressed.up.pressed || 
                input.keysPressed.down.pressed ||
                input.keysPressed.left.pressed ||
                input.keysPressed.right.pressed
            ) {
                this._parent.SetState('run');
                return;
            }
            this._parent.SetState('idle');
        }
    };

    
    class DogeState extends State {
        constructor(parent) {
            super(parent);
        }

        get Name() {
            return 'doge';
        }

        Enter(prevState) {
            this._action = this._parent._proxy._animations['doge'].action;
        
            if (prevState) {
                const prevAction = this._parent._proxy._animations[prevState.Name].action;
        
                this._action.reset();  
                this._action.setLoop(THREE.LoopOnce, 1);
                this._action.clampWhenFinished = true;
                this._action.crossFadeFrom(prevAction, 0.2, true);
                this._action.play();
            } else {
                this._action.play();
            }
        }

        Exit() {
        }

        Update(_, input) {
            if (!input.mouseButtonsPressed.right) {
                if (
                    input.keysPressed.up.pressed || 
                    input.keysPressed.down.pressed ||
                    input.keysPressed.left.pressed ||
                    input.keysPressed.right.pressed
                ) {
                    this._parent.SetState('run');
                    return;
                }
                this._parent.SetState('idle');
            }
        }
    };

    return {
        State: State,
        IdleState: IdleState,
        RunState: RunState,
        DogeState: DogeState
    };

})();