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
            console.log("idle");
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
            console.log("run");
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
            console.log("doge");
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