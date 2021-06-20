import * as THREE from 'three';
import {
    GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {
    FBXLoader
} from 'three/examples/jsm/loaders/FBXLoader.js';

// ECS
import Component from '@EntityComponentCore/Component';


export const ModelLoader = (() => {


    class StaticModelComponent extends Component {
        constructor(params) {
            super();
            this._Init(params);
        }

        _Init(params) {
            this._params = params;

            this._LoadModels();
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
                this._target.position.set(
                    m.value.x,
                    m.value.y,
                    m.value.z 
                );
            }
        }
        
        _OnRotation(m) {
            if (this._target) {
                this._target.rotation.copy(m.value);
            }
        }

        _LoadModels() {
            if (this._params.resourceName.endsWith('glb') || this._params.resourceName.endsWith('gltf')) {
                this._LoadGLB();
            } else if (this._params.resourceName.endsWith('fbx')) {
                this._LoadFBX();
            }
        }

        _OnLoaded(obj) {
            obj.scale.setScalar(this._params.scale);
            obj.position.multiplyScalar( - 1 );

            let texture = null;
            if (this._params.resourceTexture) {
                const texLoader = new THREE.TextureLoader();
                texture = texLoader.load(this._params.resourceTexture);
                texture.encoding = THREE.sRGBEncoding;
            }

            obj.traverse(c => {
                let materials = c.material;
                if (!(c.material instanceof Array)) {
                    materials = [c.material];
                }

                for (let m of materials) {
                    if (m) {
                        if (texture) {
                            m.map = texture;
                        }
                        if (this._params.specular) {
                            m.specular = this._params.specular;
                        }
                        if (this._params.emissive) {
                            m.emissive = this._params.emissive;
                        }
                    }
                }
                if (this._params.receiveShadow != undefined) {
                    c.receiveShadow = this._params.receiveShadow;
                }
                if (this._params.castShadow != undefined) {
                    c.castShadow = this._params.castShadow;
                }
                if (this._params.visible != undefined) {
                    c.visible = this._params.visible;
                }
            });

            // console.log(this._target.position)
            const box = new THREE.Box3().setFromObject( obj );
            const center = box.getCenter();

            // Center the model based on the center point
            obj.position.set(-center.x, 0, -center.z);

            // Create a new pivot objecto be used as target
            const pivot = new THREE.Object3D();

            // Change the target to the pivot
            this._target = pivot;

            // Add the original object to the pivot
            this._target.add(obj);
    
            // Add the model to the scene
            this._params.scene.add(this._target);
            
            // After loading set the rotation and position again incase it missed it
            this._target.position.set(
                this._parent._position.x,
                this._parent._position.y,
                this._parent._position.z
            );
            this._target.rotation.copy(this._parent._rotation);

        }

        _LoadGLB() {
            const loader = new GLTFLoader();
            loader.setPath(this._params.resourcePath);
            loader.load(this._params.resourceName, (glb) => {
                this._OnLoaded(glb.scene);
            });
        }

        _LoadFBX() {
            const loader = new FBXLoader();
            loader.setPath(this._params.resourcePath);
            loader.load(this._params.resourceName, (fbx) => {
                this._OnLoaded(fbx);
            });
        }

        Update(timeDelta) {}
    };


    class AnimatedModelComponent extends Component {
        constructor(params) {
            super();
            this._Init(params);
        }

        InitComponent() {
            this._RegisterHandler('update.position', (m) => {
                this._OnPosition(m);
            });
        }

        _OnPosition(m) {
            if (this._target) {
                this._target.position.copy(m.value);
            }
        }

        _Init(params) {
            this._params = params;

            this._LoadModels();
        }

        _LoadModels() {
            if (this._params.resourceName.endsWith('glb') || this._params.resourceName.endsWith('gltf')) {
                this._LoadGLB();
            } else if (this._params.resourceName.endsWith('fbx')) {
                this._LoadFBX();
            }
        }

        _OnLoaded(obj, animations) {
            this._target = obj;
            this._params.scene.add(this._target);

            this._target.scale.setScalar(this._params.scale);
            this._target.position.copy(this._parent._position);

            this.Broadcast({
                topic: 'update.position',
                value: this._parent._position,
            });

            let texture = null;
            if (this._params.resourceTexture) {
                const texLoader = new THREE.TextureLoader();
                texture = texLoader.load(this._params.resourceTexture);
                texture.encoding = THREE.sRGBEncoding;
            }

            this._target.traverse(c => {
                let materials = c.material;
                if (!(c.material instanceof Array)) {
                    materials = [c.material];
                }

                for (let m of materials) {
                    if (m) {
                        if (texture) {
                            m.map = texture;
                        }
                        if (this._params.specular) {
                            m.specular = this._params.specular;
                        }
                        if (this._params.emissive) {
                            m.emissive = this._params.emissive;
                        }
                    }
                }
                if (this._params.receiveShadow != undefined) {
                    c.receiveShadow = this._params.receiveShadow;
                }
                if (this._params.castShadow != undefined) {
                    c.castShadow = this._params.castShadow;
                }
                if (this._params.visible != undefined) {
                    c.visible = this._params.visible;
                }
            });

            const _OnLoad = (anim) => {
                const clip = anim.animations[0];
                const action = this._mixer.clipAction(clip);

                action.play();
            };

            const loader = new FBXLoader();
            loader.setPath(this._params.resourcePath);
            loader.load(this._params.resourceAnimation, (a) => {
                _OnLoad(a);
            });

            this._mixer = new THREE.AnimationMixer(this._target);

            this._parent._mesh = this._target;
            this.Broadcast({
                topic: 'load.character',
                model: this._target,
            });
        }

        _LoadGLB() {
            const loader = new GLTFLoader();
            loader.setPath(this._params.resourcePath);
            loader.load(this._params.resourceName, (glb) => {
                this._OnLoaded(glb.scene, glb.animations);
            });
        }

        _LoadFBX() {
            const loader = new FBXLoader();
            loader.setPath(this._params.resourcePath);
            loader.load(this._params.resourceName, (fbx) => {
                this._OnLoaded(fbx);
            });
        }

        Update(timeDelta) {
            if (this._mixer) {
                this._mixer.update(timeDelta);
            }
        }
    };


    return {
        StaticModelComponent: StaticModelComponent,
        AnimatedModelComponent: AnimatedModelComponent,
    };

})();