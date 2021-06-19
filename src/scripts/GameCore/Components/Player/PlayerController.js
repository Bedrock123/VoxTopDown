import * as THREE from 'three';

// ECS
import Component from '@EntityComponentCore/Component';

class PlayerController extends Component {

    Update(timeDelta) {
        const keys = this.GetComponent('PlayerInput').keys;
        const controlObject = this._parent;

        // Set the player in motion and position
        if (keys.left.down) {
            controlObject.SetPosition(
                controlObject._position.x -= timeDelta * 16, 
                controlObject._position.y, 
                controlObject._position.z
            );
            
            const a = new THREE.Euler( 0, Math.PI  * 1.5,  0, 'YXZ' );
            controlObject.SetRotation(a);
        }
        if (keys.right.down) {
            controlObject.SetPosition(
                controlObject._position.x += timeDelta * 16,
                controlObject._position.y, 
                controlObject._position.z
            );
        }
        if (keys.up.down) {
            controlObject.SetPosition(
                controlObject._position.x,
                controlObject._position.y, 
                controlObject._position.z  -= timeDelta * 16 ,
            );
        }
        if (keys.down.down) {
                controlObject.SetPosition(
                controlObject._position.x, 
                controlObject._position.y, 
                controlObject._position.z += timeDelta * 16,
            );
        }
        
    }

}


export default PlayerController;