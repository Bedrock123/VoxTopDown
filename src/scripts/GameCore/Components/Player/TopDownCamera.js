import * as THREE from 'three';

import CameraControls from 'camera-controls';
import Component from '@EntityComponentCore/Component';

class TopDownCamera extends Component {
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

        const dampining = .04;
        this._cameraControls.distance = 40;
        this._cameraControls.dampingFactor = dampining;
        this._cameraControls.draggingDampingFactor = dampining;
        this._cameraControls.azimuthRotateSpeed = .3;
        this._cameraControls.polarRotateSpeed = .3;
        this._cameraControls.dollySpeed = .1;
        this._cameraControls.truckSpeed = 2;
        this._cameraControls.polarAngle = Math.PI / 12;

        // - Mouse Button Controls
        this._cameraControls.mouseButtons.left = null;
        this._cameraControls.mouseButtons.middle = null;
        this._cameraControls.mouseButtons.right = null;
        this._cameraControls.mouseButtons.wheel = null;

    }

    Update(timeDelta) {
        this._cameraControls.update( timeDelta );
    }
}

export default TopDownCamera;

