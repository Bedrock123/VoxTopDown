import * as THREE from 'three';

// ECS
import Component from '@EntityComponentCore/Component';

// Creates a simple hit box for the players or enemies for simplere detection
class HitBox extends Component {
    constructor(params) {
        super();
        this._params = params;
        this._target = null;
        this._box3D = null; // Used to track against projectile hits

        this._Init();
    }

    _Init() {
        // Create the hit box and set as target
        const hitBox = new THREE.Mesh( 
            new THREE.BoxGeometry(this._params.size.x, this._params.size.y, this._params.size.z), 
            new THREE.MeshStandardMaterial({    
                transparent: true,
                opacity: 0.0})
            );

        // define the possible z offset for the model
        if (this._params.zOffset) {
            hitBox.position.z = this._params.zOffset;
        }

        // Create the hit box group and add the hit box to it
        const hitBoxGroup = new THREE.Group();
        hitBoxGroup.add(hitBox);
        this._params.scene.add(hitBoxGroup);


        // Set the hit box as the targert
        this._target = hitBoxGroup ;
    }

    InitComponent() {
        this._RegisterHandler('update.position', (m) => {
            this._OnPosition(m);
        });
        this._RegisterHandler('update.rotation', (m) => {
            this._OnRotation(m);
        });
        
    }

    // Generate a new box 3d on move or rotate
    _GenerateBox3D() {
        const box3D =  new THREE.Box3().setFromObject(this._target);
        this._box3D = box3D;

    }

    _OnPosition(m) {
        if (this._target) {
            this._target.position.set(
                m.value.x,
                m.value.y,
                m.value.z 
            );
            // Generate the box 3D model
            this._GenerateBox3D();
        }
    }
    
    _OnRotation(m) {
        if (this._target) {
            this._target.rotation.copy(m.value);
            // Generate the box 3D model
            this._GenerateBox3D();
        }
    }

    // Returns the box 3d for it boxes
    get Box3D() {
        return this._box3D;
    }



}

export default HitBox;