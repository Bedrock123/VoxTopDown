import * as THREE from 'three';

import CameraControls from 'camera-controls';
import Component from '@EntityComponentCore/Component';

class DebugCamera extends Component {
    constructor( params)
    {
        super();
        this._cameraControls = null;

        // Initlize the camera controls
        this._Init(params);
    }

    _Init(params) {
        // Initalize and connect the camera controls
        CameraControls.install( { THREE: THREE } );
        
        // Set the camera controls to the dom and camera
        this._cameraControls = new CameraControls( params.camera, params.renderer.domElement );
        
        // Base Camera Control Settings
        this._cameraControls.distance = 25;
        this._cameraControls.dampingFactor = .06;
        this._cameraControls.draggingDampingFactor = .06;
        this._cameraControls.azimuthRotateSpeed = .3;
        this._cameraControls.polarRotateSpeed = .3;
        this._cameraControls.dollySpeed = .1;
        this._cameraControls.truckSpeed = 2;
        this._cameraControls.polarAngle = Math.PI / 5;
        
        // - Mouse Button Controls
        this._cameraControls.mouseButtons.left = CameraControls.ACTION.TRUCK;
        this._cameraControls.mouseButtons.middle = CameraControls.ACTION.OFFSET;
        this._cameraControls.mouseButtons.right = CameraControls.ACTION.ROTATE;
        this._cameraControls.mouseButtons.wheel = CameraControls.ACTION.DOLLY;

        // Set the camera bounderies
        const bounderyBox = new THREE.Box3(
            new THREE.Vector3( -1000, 0, -1000 ),
            new THREE.Vector3( 1000, 0, 1000 )
        );

        // Set the bounder box to the camera controls
        this._cameraControls.setBoundary( bounderyBox );
    }

    Update(timeDelta) {
        this._cameraControls.update( timeDelta );
    }
}

export default DebugCamera;

