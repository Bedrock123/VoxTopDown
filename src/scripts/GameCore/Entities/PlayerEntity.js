import * as THREE from 'three'
import Component from './base/Component'
import globals from "../utils/globals"

export const PlayerEntity = (() => {
  class StaticModelComponent extends Component {
    constructor(params) {
      super();

      this._Init(params)
    }

    _Init(params) {
      this._params = params
      this._LoadStaticModel()
      this._SetLookAtVector()


    }
  
    InitComponent() {
      this._RegisterHandler('update.position', (m) => { this._OnPosition(m); });
    }

    _OnPosition(m) {
      if (this._target) {
        this._target.position.copy(m.value);
      }
    }

    _LoadStaticModel() {
        // Player Model Grouping
        const playerModelGroup = new THREE.Group()

        // PLAYER BODY
        // Construct the player geometry + material
        const playerBodyGeometry = new THREE.BoxGeometry(1, 1, 1)
        const playerBodyMaterial = new THREE.MeshStandardMaterial({color: "#22a6b3", roughness: .8, metalness: 0})
      
        // Create the player body and add to player group
        const playerBodyMesh = new THREE.Mesh(playerBodyGeometry, playerBodyMaterial)
        playerModelGroup.add(playerBodyMesh)

        // PLAYER POINTER HEAD
        // Construct the player geometry + material
        const playerPointerGeometry = new THREE.SphereGeometry(0.25, 32, 32)
        const playerPointerMaterial = new THREE.MeshStandardMaterial({color: "#7ed6df", roughness: .8, metalness: 0})

        const playerPointerMesh = new THREE.Mesh(playerPointerGeometry, playerPointerMaterial)
        playerPointerMesh.position.z += 1
        playerModelGroup.add(playerPointerMesh)

        // Add the full player model to the scene
        this._params.scene.add(playerModelGroup)

        // Set the player group as the component target
        this._target = playerModelGroup
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

        if (this.lookAt) {
          controlObject.lookAt(this.lookAt)
  
        }

        // Set the player in motion and position
        if (keys.left.down) {
            this._parent.SetPosition(
              controlObject.position.x -= globals.delta * globals.moveSpeed, 
              controlObject.position.y, 
              controlObject.position.z
            )

            this._params.cameraControls.moveTo(controlObject.position.x, controlObject.position.y, controlObject.position.z, true)

            if (this.lookAt) {
              const newLookAt = new THREE.Vector3(this.lookAt.x -= globals.delta * globals.moveSpeed, this.lookAt.y, this.lookAt.z)
              this.lookAt = newLookAt
              controlObject.lookAt(this.lookAt)
            }
 
        }
        if (keys.right.down) {
            this._parent.SetPosition(
              controlObject.position.x += globals.delta * globals.moveSpeed, 
              controlObject.position.y, 
              controlObject.position.z
            )

            this._params.cameraControls.moveTo(controlObject.position.x, controlObject.position.y, controlObject.position.z, true)

            if (this.lookAt) {
              const newLookAt = new THREE.Vector3(this.lookAt.x  += globals.delta * globals.moveSpeed, this.lookAt.y, this.lookAt.z)
              this.lookAt = newLookAt
              controlObject.lookAt(this.lookAt)
            }
        }
        if (keys.up.down) {
            this._parent.SetPosition(
              controlObject.position.x,
              controlObject.position.y, 
              controlObject.position.z  -= globals.delta * globals.moveSpeed, 
            )

            this._params.cameraControls.moveTo(controlObject.position.x, controlObject.position.y, controlObject.position.z, true)

            if (this.lookAt) {
              const newLookAt = new THREE.Vector3(this.lookAt.x, this.lookAt.y, this.lookAt.z -= globals.delta * globals.moveSpeed)
              this.lookAt = newLookAt
              controlObject.lookAt(this.lookAt)
            }
        }
        if (keys.down.down) {
            this._parent.SetPosition(
              controlObject.position.x, 
              controlObject.position.y, 
              controlObject.position.z += globals.delta * globals.moveSpeed,
            )
            this._params.cameraControls.moveTo(controlObject.position.x, controlObject.position.y, controlObject.position.z, true)

            if (this.lookAt) {
              const newLookAt = new THREE.Vector3(this.lookAt.x, this.lookAt.y, this.lookAt.z += globals.delta * globals.moveSpeed)
              this.lookAt = newLookAt
              controlObject.lookAt(this.lookAt)
            }
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
    StaticModelComponent: StaticModelComponent,
  };

})();