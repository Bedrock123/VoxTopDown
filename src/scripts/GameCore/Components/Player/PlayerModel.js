import * as THREE from 'three';

import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

// ECS
import Component from '@EntityComponentCore/Component';

class PlayerModel extends Component {
    constructor(params) {
        super();
        this._Init(params);
    }

    InitComponent() {
        this._RegisterHandler('update.position', (m) => {
            this._OnPosition(m);
        });
        this._RegisterHandler('update.rotation', (m) => {
            this._OnRotation(m);
        });
    }

    _OnPosition(m) {
        if (this._target) {
            this._target.position.copy(m.value);
        }
    }
    _OnRotation(m) {
        if (this._target) {
            this._target.rotation.copy(m.value);
        }
    }

    _Init(params) {
        this._params = params;

        this._LoadFBX();
    }


    _OnLoaded(fbx) {
        fbx.scale.setScalar(1.03);


        fbx.traverse(c => {
            c.castShadow = true;
            c.receiveShadow = true;
            if (c.material && c.material.map) {
                c.material.map.encoding = THREE.sRGBEncoding;
            }
        });

        // Loop through the character model and add in the bones into the 
        this._bones = {};
        for (let b of fbx.children[0].skeleton.bones) {
            this._bones[b.name] = b;
        }

        this._mixer = new THREE.AnimationMixer(fbx);

        // Indivdual animation loaders
        const _OnLoad = (animName, anim) => {
            const clip = anim.animations[0];
            const action = this._mixer.clipAction(clip);

            // Set the player conoler animations to pass to the proxy to pass to the state machine
            const playerController = this.GetComponent('PlayerController');
            
            playerController._animations[animName] = {
                clip: clip,
                action: action,
            };
        };

        this._manager = new THREE.LoadingManager();
        this._manager.onLoad = () => {
            // ON all animatinos loaded set the idle state into the player state machine
            const playerController = this.GetComponent('PlayerController');
            playerController._stateMachine.SetState('idle');
        };

        // Fetch and load all of the player animations
        const loader = new FBXLoader(this._manager);
        loader.setPath('/public/voxel/');
        loader.load('model.fbx', (a) => { _OnLoad('idle', a); });
        loader.load('run.fbx', (a) => { _OnLoad('run', a); });
        loader.load('jump.fbx', (a) => { _OnLoad('doge', a); });
        loader.load('shoot.fbx', (a) => { _OnLoad('shoot', a); });

        // Append the model to the pivto to ensure te centering is correc
        const box = new THREE.Box3().setFromObject( fbx );
        const center = box.getCenter(fbx.position);

        // Center the model based on the center point
        fbx.position.set(-center.x, 0, -center.z);

        // Create a new pivot objecto be used as target
        const pivot = new THREE.Object3D();

        // Add the original object to the pivot
        pivot.add(fbx);

        // Add the model to the scene
        this._params.scene.add(pivot);
        
        // After loading set the rotation and position again incase it missed it
        pivot.position.set(
            this._parent._position.x,
            this._parent._position.y,
            this._parent._position.z
        );
        pivot.rotation.copy(this._parent._rotation);

        // Change the target to the pivot
        this._target = pivot;

        this.Broadcast({
            topic: 'load.character',
            bones: this._bones,
            target: fbx
        });
    }


    _LoadFBX() {
        const loader = new FBXLoader();
        loader.setPath('/public/voxel/');
        loader.load('model.fbx', (fbx) => {
            this._OnLoaded(fbx);
        });
    }

    Update(timeDelta) {
        if (this._mixer) {
            this._mixer.update(timeDelta);
        }
    }
}

export default PlayerModel;