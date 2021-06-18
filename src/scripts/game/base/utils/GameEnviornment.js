import CameraControls from 'camera-controls';
import globals from "../../../utils/globals"
import gsap from 'gsap'
import * as THREE from 'three'

CameraControls.install( { THREE: THREE } );

// Stats
import Stats from "stats.js"
var stats = new Stats();
stats.showPanel( 0 );
document.body.appendChild( stats.dom );


class GameEnviornment {
    constructor(_camera, _clock,  _cameraControls, _scene,_renderer)
    {
        this._camera = _camera;
        this._cameraControls = _cameraControls;
        this._scene = _scene;
        this._renderer = _renderer;
        this._clock = _clock

    }
    _CameraControls() {
        this._cameraControls = new CameraControls( this._camera, this._renderer.domElement );
        
        // Base Camera Control Settings
        this._cameraControls.distance = 25
        this._cameraControls.dampingFactor = .06
        this._cameraControls.draggingDampingFactor = .06
        this._cameraControls.azimuthRotateSpeed = .3
        this._cameraControls.polarRotateSpeed = .3
        this._cameraControls.dollySpeed = .1
        this._cameraControls.truckSpeed = 2
        this._cameraControls.polarAngle = Math.PI / 5

        // Camera Control Max / Mins 
        this._cameraControls.maxDistance = 35
        this._cameraControls.minDistance = 14
        this._cameraControls.maxPolarAngle = Math.PI / 2.5
        this._cameraControls.minPolarAngle = - Math.PI / 1.5
        
        // - Mouse Button Controls
        // // this._cameraControls.mouseButtons.left = null
        // this._cameraControls.mouseButtons.middle = null
        // this._cameraControls.mouseButtons.right = null

        this._cameraControls.mouseButtons.left = CameraControls.ACTION.ROTATE
        this._cameraControls.mouseButtons.middle = CameraControls.ACTION.DOLLY
        this._cameraControls.mouseButtons.right = CameraControls.ACTION.TRUCK

        // Add in a the camera helper box
        const bb = new THREE.Box3(
            new THREE.Vector3( -16, 0, -13 ),
            new THREE.Vector3( 16, 0, 13 )
        );
        this._cameraControls.setBoundary( bb );

    }

    Animate() {
        stats.begin();
        const delta = this._clock.getDelta();
        globals.delta = delta
        const updated = this._cameraControls.update( delta );
        requestAnimationFrame( this.Animate.bind(this) );
        if ( updated ) {
            gsap.to(this._cameraControls, { duration: 2.8, delay: 0, polarAngle: Math.PI / (this._cameraControls.distance / 2.5 ) })
            // Distance > Truck Speed
            if (this._cameraControls.distance >= 15) {
                this._cameraControls.truckSpeed = 3
            } else {
                this._cameraControls.truckSpeed = 4
            }
        }
        this._entityManager.Update();
        this._renderer.render( this._scene, this._camera );
        stats.end();
    }

    _Lighting() {
        const spotLight = new THREE.SpotLight({color: "#fff"})
        spotLight.position.set( 100, 1000, 100 );
        spotLight.angle = .15
        spotLight.penumbra = 1
        this._scene.add(spotLight)

        const pointLight = new THREE.PointLight({color: "#fff"})
        pointLight.position.set(-10, -10, -10)
        this._scene.add(pointLight)

        const ambientLight = new THREE.AmbientLight({ color: "#fff" }, .5)
        this._scene.add(ambientLight)

        
    }

    _Resizing() {
        window.addEventListener('resize', () => {
            const width = window.innerWidth
            const height = window.innerHeight
            this._camera.aspect =  width / height
            this._camera.updateProjectionMatrix()
            this._renderer.setSize(width, height)
            this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        })
        
    }

    Initialize() {
        // Provide camera - ie a point of view
        const sizes = {
            width: window.innerWidth,
            height: window.innerHeight
        }

        this._clock = new THREE.Clock();


        // Scene
        this._scene = new THREE.Scene()
        this._scene.background = new THREE.Color("#fff");

        // Camnera
        this._camera = new THREE.PerspectiveCamera( 60, sizes.width / sizes.height, 3, 100 );
        this._camera.position.set( 0, 0, 5 );
        this._scene.add(this._camera)
        
        // Create the rendered canvas
        const canvas = document.querySelector('.webgl')

        // Add the canvas to the game
        this._canvas = canvas

        let pixelRatio = window.devicePixelRatio
        let AA = true
        if (pixelRatio > 1) {
            AA = false
        }

        this._renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: AA,
            powerPreference: "high-performance",
        })

        // Gamma settings
        this._renderer.gammaFactor = .2;

        // Set the size of the renderer
        this._renderer.setSize(sizes.width, sizes.height)
        
        // Set the scene inside of the renderer
        this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        this._renderer.render(this._scene, this._camera)

        // Set up Camera Controls & Aniation
        this._CameraControls()
        this._Lighting()
        this._Resizing()

    }

}

export default GameEnviornment