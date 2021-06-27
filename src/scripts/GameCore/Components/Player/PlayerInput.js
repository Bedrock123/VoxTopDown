import * as THREE from 'three';
import globals from "@helpers/globals";

// ECS
import Component from '@EntityComponentCore/Component';

class PlayerInput extends Component {
    constructor(params) {
        super();
        this.keysPressed = {};
        this.mouseButtonsPressed = {
            left: false,
            right: false
        };
        this.intersectPoint = new THREE.Vector3(0, 0, 0);

        // Load up te inital params
        this._params = params;
        
        // Set the window listens to they key maps
        this._SetKeyMapping();

        // Set up the mouse look up vector
        this._SetCursorPosition();

        // Set up the mouse button window lisetener
        this._SetMouseButtonMapping();
    }

    _SetCursorPosition() {

        // Cursor position constancts
        const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        const raycaster = new THREE.Raycaster(); 
        const mouse = new THREE.Vector2();       
        const intersectPoint = new THREE.Vector3();

        let that = this;
        const onMouseMove = (event) => {
            //get mouse coordinates
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            // Set the ray caster from camera
            raycaster.setFromCamera(mouse, that._params.camera);//set raycaster
            raycaster.ray.intersectPlane(plane, intersectPoint); // find the point of intersection

            // Set the sect point y to 0 so it will just look at x and z
            intersectPoint.y = 0;

            // Set the 
            that.intersectPoint = intersectPoint;
        };

        // Add the mouse move listener
        window.addEventListener('mousemove', (event) => {
            onMouseMove(event);
        });
        
    }
    _SetKeyMapping() {
        const keyMap = new Map();
        
        // Set the keys into the pressed state or not
        const setKey = (keyName, pressed) => {
            const keyState = this.keysPressed[keyName];
            keyState.justPressed = pressed && !keyState.pressed;
            keyState.pressed = pressed;
        };
        
        // Add a key to even listeer
        const addKey = (keyCode, name) => {
            this.keysPressed[name] = { pressed: false, justPressed: false };
            keyMap.set(keyCode, name);
        };
        
        // Set a key from the ters
        const setKeyFromKeyCode = (keyCode, pressed) => {
            const keyName = keyMap.get(keyCode);
            if (!keyName) {
                return;
            }
            setKey(keyName, pressed);
        };
        
        // Add the keys we would like to listen to
        addKey(65, 'left');
        addKey(68, 'right');
        addKey(87, 'up');
        addKey(83, 'down');
        addKey(32, 'space');
        addKey(82, 'rKey');
        
        // Add in the window event listeners
        window.addEventListener('keydown', (e) => {
            setKeyFromKeyCode(e.keyCode, true);
        });
        window.addEventListener('keyup', (e) => {
            setKeyFromKeyCode(e.keyCode, false);
        });
    }

    _SetMouseButtonMapping() {
        const setRightClickButton = () => {
            this.mouseButtonsPressed.right = true;
            // set the right click for the deration of the doge roll so it canot be click again
            setTimeout(function(){ this.mouseButtonsPressed.right = false;  }.bind(this), globals.player.dogeTime);
        };

        // Check for the right mouse button click
        window.oncontextmenu = function ()
        {
            setRightClickButton();
            return false;
        };

        const setLeftClickButton = (clicked) => {
            this.mouseButtonsPressed.left = clicked;
        };

        document.body.onmousedown = function(event) { 
            if (event.which === 1) {
                setLeftClickButton(true);
            }
        };
        document.body.onmouseup = function(event) {
            if (event.which === 1) {
                setLeftClickButton(false);
            }
        };
    }


}

export default PlayerInput;