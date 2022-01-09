import Stats from "stats.js";
import * as dat from 'dat.gui';

import globals from "@helpers/globals";


// Used for delta time
var lastUpdate = Date.now();

class GameEnviornment {
    constructor(_camera, _clock, _scene,_renderer)
    {
        this._camera = _camera;
        this._scene = _scene;
        this._renderer = _renderer;

        if (globals.debug) {
            // Initalize the stats menu
            this._InitalizeStatsMenu(); // FPS
            this._InitalizeGUI(); // Control panel
        }
    }

    _Initialize() {
        // Provide camera - ie a point of view
        const sizes = {
            width: window.innerWidth,
            height: window.innerHeight
        };

        // Initialize canvas here

        // Set up global resizing
        this._Resizing();

    }

    _InitalizeStatsMenu() {
        this._stats = new Stats();
        this._stats.showPanel( 0 );
        document.body.appendChild(this._stats.dom );
    }

    _InitalizeGUI() {
        // Create the gui menu and set it appeared
        const gui = new dat.GUI({width: 400});
        this._gui = gui;
    }

    _Animate() {
        if (this._stats) {
            // Begin traking stats
            this._stats.begin();
        }

        // Get time elampshed delete
        const now = Date.now();
        const deltaTime = (now - lastUpdate) / 1000;
        lastUpdate = now;

        // Update entity manager with deltaTime
        this._entityManager.Update(deltaTime);

        // Render scene
        // Render the kanvas scene

        if (this._stats) {
            // End traking stats
            this._stats.end();
        }

        // Recall scene
        requestAnimationFrame( this._Animate.bind(this) );
    }

    _Resizing() {
        window.addEventListener('resize', () => {
            // Set the width and height contsts
            const width = window.innerWidth;
            const height = window.innerHeight;

            // TODO - set resizing helper function for canvas
        });
        
    }


}

export default GameEnviornment;