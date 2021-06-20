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

    InitComponent() {
        this._RegisterHandler('update.position', (m) => {
            this._OnPosition(m);
        });
    }

    _OnPosition(m) {
        this._cameraControls.moveTo(m.value.x, m.value.y, m.value.z, true);
    }

    _Init(params) {
        // Initalize and connect the camera controls
        CameraControls.install( { THREE: THREE } );
        
        // Set the camera controls to the dom and camera
        this._cameraControls = new CameraControls( params.camera, params.renderer.domElement );

        this._cameraControls.distance = 40;
        this._cameraControls.dampingFactor = .06;
        this._cameraControls.draggingDampingFactor = .06;
        this._cameraControls.polarAngle = Math.PI / 7;

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

