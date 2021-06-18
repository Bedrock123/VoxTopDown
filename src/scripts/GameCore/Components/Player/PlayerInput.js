import * as THREE from 'three'
import Component from './base/Component'
import globals from "../utils/globals"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export const PlayerInput = (() => {
  class Controller extends Component {
    constructor(params) {
      super();

      this._Init(params)
    }

    _Init(params) {
      this._params = params
      // this._SetLookAtVector()
      this._LoadModels();

    }
  
    InitComponent() {
      this._RegisterHandler('update.position', (m) => { this._OnPosition(m); });
    }

    _OnPosition(m) {
      if (this._target) {
        this._target.position.copy(m.value);
        this._target.position.y = 14.5
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
      this._target = obj;
      this._params.scene.add(this._target);

      this._target.scale.setScalar(this._params.scale);
      this._target.position.copy(this._parent._position);
      this._target.rotation.y = Math.PI / 2
      this._target.position.y = 14
      let texture = null;
      if (this._params.resourceTexture) {
        const texLoader = new THREE.TextureLoader();
        texture = texLoader.load(this._params.resourceTexture);
        texture.encoding = THREE.sRGBEncoding;
      }
      var newMaterial = new THREE.MeshStandardMaterial({color: 0xff0000})
      newMaterial.metalness = .4
      newMaterial.roughness = .4
      this._target.traverse((o) => {
        // console.log(o)
        if (o.isMesh) {
          console.log(o)
          o.material.metalness = .5
          o.material.roughness = .4
        }
      });
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

    _SetLookAtVector() {
      var plane = new THREE.Plane(new THREE.Vector3(0, 1,0), 0);
      var raycaster = new THREE.Raycaster(); //for reuse
      var mouse = new THREE.Vector2();       //for reuse
      var intersectPoint = new THREE.Vector3();//for reuse
      window.addEventListener("mousemove", onmousemove, false);
      let that = this;
      function onmousemove(event) {
        //get mouse coordinates
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, that._params.camera);//set raycaster
        raycaster.ray.intersectPlane(plane, intersectPoint); // find the point of intersection
        intersectPoint.y = 0
        that.lookAt = intersectPoint
      }
      
    }


    Update() {
        const { keys } = this._params.inputManager;
        const controlObject = this._target

  

        // Set the player in motion and position
        if (keys.left.down) {
            this._parent.SetPosition(
              controlObject.position.x -= globals.delta * globals.moveSpeed, 
              controlObject.position.y, 
              controlObject.position.z
            )

          
 
        }
        if (keys.right.down) {
            this._parent.SetPosition(
              controlObject.position.x += globals.delta * globals.moveSpeed, 
              controlObject.position.y, 
              controlObject.position.z
            )

          
        }
        if (keys.up.down) {
            this._parent.SetPosition(
              controlObject.position.x,
              controlObject.position.y, 
              controlObject.position.z  -= globals.delta * globals.moveSpeed, 
            )

            this._params.cameraControls.moveTo(controlObject.position.x, controlObject.position.y, controlObject.position.z, true)

       
        }
        if (keys.down.down) {
            this._parent.SetPosition(
              controlObject.position.x, 
              controlObject.position.y, 
              controlObject.position.z += globals.delta * globals.moveSpeed,
            )
         
        }
        
        // Find nera by
        if (keys.space.down) {
          const grid = this.GetComponent('GridController');
          grid.FindNearbyEntities(1).map(function(client){
            client.entity.GetComponent('StaticModelComponent').SetColor("blue")
          })
        }

    }
  };

  return {
    Controller: Controller,
  };

})();