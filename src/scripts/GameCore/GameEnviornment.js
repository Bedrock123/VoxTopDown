import Stats from "stats.js";

import * as THREE from 'three';
import * as dat from 'dat.gui';

import globals from "@helpers/globals";


class GameEnviornment {
    constructor(_camera, _clock, _scene,_renderer)
    {
        this._camera = _camera;
        this._scene = _scene;
        this._renderer = _renderer;
        this._clock = _clock;

        if (globals.debug) {
            // Initalize the stats menu
            this._InitalizeStatsMenu();
            // this._InitalizeGUI();
        }
    }


    _Initialize() {
        // Provide camera - ie a point of view
        const sizes = {
            width: window.innerWidth,
            height: window.innerHeight
        };

        // Set the global click
        this._clock = new THREE.Clock();

        // Scene
        this._scene = new THREE.Scene();
        this._scene.background = new THREE.Color("#222");

        // Camnera
        this._camera = new THREE.PerspectiveCamera( 60, sizes.width / sizes.height, 3, 100 );
        this._camera.position.set( 0, 0, 5 );
        this._scene.add(this._camera);
        
        // Canvas
        const canvas = document.querySelector('.webgl');

        // Add the canvas to the game
        this._canvas = canvas;

        // Set antli alias to true if pixel ratio is under 2
        let pixelRatio = window.devicePixelRatio;
        let shouldHaveAntiAlias = true;
        if (pixelRatio > 1) {
            shouldHaveAntiAlias = false;
        }

        this._renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: shouldHaveAntiAlias,
            powerPreference: "high-performance",
        });

        // Gamma settings
        this._renderer.gammaFactor = .2;

        // Set the size of the renderer
        this._renderer.setSize(sizes.width, sizes.height);
        
        // Set the scene inside of the renderer
        this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this._renderer.render(this._scene, this._camera);

        // Set up global lighting and resizing
        this._Lighting();
        this._Resizing();

    }

    _InitalizeStatsMenu() {
        this._stats = new Stats();
        this._stats.showPanel( 0 );
        document.body.appendChild(  this._stats.dom );
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
        const deltaTime = this._clock.getDelta();
        
        // update entity manage with time delta
        this._entityManager.Update(deltaTime);

        // Render scene
        this._renderer.render( this._scene, this._camera );

        if (this._stats) {
            // End traking stats
            this._stats.end();
        }

        // Recall scene
        requestAnimationFrame( this._Animate.bind(this) );
    }

    _Lighting() {
        const spotLight = new THREE.SpotLight({color: "#fff"});
        spotLight.position.set( 100, 1000, 100 );
        spotLight.angle = .15;
        spotLight.penumbra = 1;
        this._scene.add(spotLight);

        const pointLight = new THREE.PointLight({color: "#fff"});
        pointLight.position.set(-10, -10, -10);
        this._scene.add(pointLight);

        const ambientLight = new THREE.AmbientLight({ color: "#fff" }, .5);
        this._scene.add(ambientLight);

        
    }

    _Resizing() {
        window.addEventListener('resize', () => {
            // Set the width and height contsts
            const width = window.innerWidth;
            const height = window.innerHeight;

            // Set the new aspect ratio
            this._camera.aspect =  width / height;

            // Update the projection matrix
            this._camera.updateProjectionMatrix();

            // Reseize the render
            this._renderer.setSize(width, height);

            // Reupdate the pixel ratio
            this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        });
        
    }


}

export default GameEnviornment;